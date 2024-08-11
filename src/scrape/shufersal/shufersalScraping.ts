import puppeteer from "puppeteer";
import SHUFERSAL_CATEGORIES from "./shufersal.constatns"; // SHUFERSAL_MILK_AND_EGGS_CATEGORY,
import {
  CategoryProductI,
  SuperMarketCategoriesI,
  SuperMarketImgsI,
  SuperMarketPricesI,
} from "../../types/scrape/scraping.types";
import { getErrorData } from "../../utils/errors/ErrorsFunctions";
import { addScrapedProductToCurrentCategory } from "../../utils/scrape/funcs";

export async function shufersalScrape() {
  const shufersalPrices: SuperMarketPricesI = {
    MILK_AND_EGGS_CATEGORY: [],
    FRUITS_AND_VEGETABLES_CATEGORY: [],
    SWEETS_CATEGORY: [],
    DRINKS_CATEGORY: [],
    MEAST_AND_FISH_CATEGORY: [],
    FROZENS_CATEGORY: [],
  };
  const shufersalImgs: SuperMarketImgsI = {
    MILK_AND_EGGS_CATEGORY: [],
    FRUITS_AND_VEGETABLES_CATEGORY: [],
    SWEETS_CATEGORY: [],
    DRINKS_CATEGORY: [],
    MEAST_AND_FISH_CATEGORY: [],
    FROZENS_CATEGORY: [],
  };
  try {
    const browser = await puppeteer.launch({
      headless: false,
      defaultViewport: null,
    });
    const page = await browser.newPage();
    await page.goto("https://www.shufersal.co.il/online/he/S");

    for (const key in SHUFERSAL_CATEGORIES) {
      const categoryKey = key as keyof SuperMarketCategoriesI;
      const scrapedProducts: CategoryProductI[] = [];
      const scrapedImgs: string[] = [];
      for (const productToScrape of SHUFERSAL_CATEGORIES[categoryKey]) {
        try {
          await page.locator("#js-site-search-input").fill(productToScrape);

          await page.waitForSelector(".tile.miglog-prod", { timeout: 5000 });

          const itemHandle = await page.$(".tile.miglog-prod");

          if (itemHandle) {
            await addScrapedProductToCurrentCategory(
              itemHandle,
              scrapedProducts,
              ".text",
              ".totalPrice .number",
              scrapedImgs,
              "a.imgContainer img"
            );
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
      shufersalImgs[categoryKey] = scrapedImgs;
      shufersalPrices[categoryKey] = scrapedProducts;
    }

    await browser.close();
    return { shufersalPrices, shufersalImgs };
  } catch (error) {
    const { errorName, errorMessage } = getErrorData(error);
    console.log(errorName, "\n" + errorMessage);
    throw error;
  }
}
