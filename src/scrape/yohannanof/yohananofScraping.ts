import puppeteer from "puppeteer";
import YOHANANOF_CATEGORIES from "./yohananof.contants";
import {
  SuperMarketCategoriesI,
  SuperMarketPricesI,
} from "../../types/scrape/scraping.types";
import { getErrorData } from "../../utils/errors/ErrorsFunctions";
import { addScrapedProductToCurrentCategory } from "../../utils/scrape/funcs";

export async function yohananofScrape() {
  try {
    const browser = await puppeteer.launch({
      headless: false,
      defaultViewport: null,
    });
    const page = await browser.newPage();
    await page.goto("https://yochananof.co.il/category?id=MTI%3D");

    const yohananofPrices: SuperMarketPricesI = {
      MILK_AND_EGGS_CATEGORY: [],
      FRUITS_AND_VEGETABLES_CATEGORY: [],
      SWEETS_CATEGORY: [],
      DRINKS_CATEGORY: [],
      MEAST_AND_FISH_CATEGORY: [],
      FROZENS_CATEGORY: [],
    };

    for (const key in YOHANANOF_CATEGORIES) {
      const categoryKey = key as keyof SuperMarketCategoriesI;
      const scrapedProducts = [];
      for (const productToScrape of YOHANANOF_CATEGORIES[categoryKey]) {
        try {
          await page.waitForSelector("#search-form");

          await page.locator('input[id=":r6:"]').fill(productToScrape);

          await page.waitForSelector(".MuiBox-root.muirtl-1b53jue", {
            timeout: 15000,
          });

          const itemHandle = await page.$(".MuiBox-root.muirtl-1b53jue");

          if (itemHandle) {
            await addScrapedProductToCurrentCategory(
              itemHandle,
              scrapedProducts,
              '[data-aria-desc="item_name"]',
              '[data-aria-desc="final_price"]'
            );
            // const name = await itemHandle.$eval(
            //   '[data-aria-desc="item_name"]',
            //   (el) => el.textContent?.trim() || ""
            // );

            // const price = await itemHandle.$eval(
            //   '[data-aria-desc="final_price"]',
            //   (el) => el.textContent?.trim() || ""
            // );

            // if (name && price) {
            //   scrapedProducts.push({ name, price });
            // } else if (name && !price) {
            //   scrapedProducts.push({ name, price: null });
            // }
          } else {
            console.log("No product found.");
          }
        } catch (error) {
          const { errorName, errorMessage } = getErrorData(error);
          console.log(
            `Error for product: ${productToScrape}`,
            errorName,
            "\n" + errorMessage
          );
          scrapedProducts.push({ name: productToScrape, price: "N/A" });
        }
      }
      yohananofPrices[categoryKey] = scrapedProducts;
    }

    await browser.close();
    return yohananofPrices;
  } catch (error) {
    const { errorName, errorMessage } = getErrorData(error);
    console.log(errorName, "\n" + errorMessage);
    throw error;
  }
}
