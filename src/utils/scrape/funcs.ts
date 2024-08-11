import { ElementHandle } from "puppeteer";
import {
  CategoryProductI,
  ScrapedProductCategoriesOptions,
} from "../../types/scrape/scraping.types";

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
