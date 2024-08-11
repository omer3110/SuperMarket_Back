import { ElementHandle } from "puppeteer";
import {
  CategoryProductI,
  ScrapedProductCategoriesOptions,
  SuperMarketPricesI,
} from "../../types/scrape/scraping.types";
import { ProductI } from "../../types/scrape/products.types";
import { ramiLevyScrape } from "../../scrape/rami_levi/rami_levyScraping";
import { shufersalScrape } from "../../scrape/shufersal/shufersalScraping";
import { yohananofScrape } from "../../scrape/yohannanof/yohananofScraping";

export function reverseString(str: string) {
  return str.split("").reverse().join("");
}

export function defineCategory(category: ScrapedProductCategoriesOptions) {
  switch (category) {
    case "MILK_AND_EGGS_CATEGORY":
      return "Milk and Eggs";
    case "FRUITS_AND_VEGETABLES_CATEGORY":
      return "Fruits and Vegetables";
    case "SWEETS_CATEGORY":
      return "Sweets";
    case "DRINKS_CATEGORY":
      return "Drinks";
    case "MEAST_AND_FISH_CATEGORY":
      return "Meat and Fish";
    case "FROZENS_CATEGORY":
      return "Frozens";
    default:
      throw new Error("Category not found");
  }
}

export async function getScrapedProductNameAndPrice(
  itemHandle: ElementHandle<Element>
) {
  const name = await itemHandle.$eval(
    ".text-wrap",
    (el) => el.textContent?.trim() || ""
  );

  const price = await itemHandle.$eval(
    ".sr-only span:first-child",
    (el) => el.textContent?.trim() || "N/A"
  );

  return { name, price };
}

export async function addScrapedProductToCurrentCategory(
  itemHandle: ElementHandle<Element>,
  scrapedProducts: CategoryProductI[],
  nameSelector: string,
  priceSelector: string
) {
  const name = await itemHandle.$eval(
    nameSelector,
    (el) => el.textContent?.trim() || ""
  );
  const price = await itemHandle.$eval(
    priceSelector,
    (el) => el.textContent?.trim() || "N/A"
  );
  console.log(name + " : " + price);

  if (name && price) {
    scrapedProducts.push({ name, price });
  } else if (name && !price) {
    scrapedProducts.push({ name, price: null });
  }
}

export function adjustDataByIndex(
  data1: SuperMarketPricesI,
  data2: SuperMarketPricesI,
  data3: SuperMarketPricesI
) {
  const adjustedData: ProductI[] = [];
  for (const key in data1) {
    const categoryKey = key as ScrapedProductCategoriesOptions;
    for (let i = 0; i < data1[categoryKey].length; i++) {
      const adjustedProduct: ProductI = {
        name: data1[categoryKey][i].name,
        category: defineCategory(categoryKey),
        prices: [
          {
            brandName: "Shufersal",
            price: data1[categoryKey][i]?.price || "N/A",
          },
          {
            brandName: "Yohananof",
            price: data2[categoryKey][i]?.price || "N/A",
          },
          {
            brandName: "Rami Levy",
            price: data3[categoryKey][i]?.price || "N/A",
          },
        ],
      };
      adjustedData.push(adjustedProduct);
    }
  }
  return adjustedData;
}
export async function writeOrderReq() {
  try {
    const ramiLevyData = await ramiLevyScrape();
    const shufersalData = await shufersalScrape();
    const yohananofData = await yohananofScrape();
    console.log(
      "Please translate all te hebrew to english and convert all the sub prices to numbers (omit symbols or chars if needed)"
    );
    console.dir(adjustDataByIndex(shufersalData, yohananofData, ramiLevyData), {
      depth: null,
    });
  } catch (error) {
    console.log(error);
  }
}
