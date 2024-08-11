import puppeteer from "puppeteer";
import RAMI_LEVT_CATEGORIES from "./rami.constants";
import { getErrorData } from "../../utils/errors/ErrorsFunctions";
import {
  CategoryProductI,
  SuperMarketCategoriesI,
  SuperMarketPricesI,
} from "../../types/scrape/scraping.types";
import { getScrapedProductNameAndPrice } from "../../utils/scrape/funcs";

export async function ramiLevyScrape() {
  try {
    const browser = await puppeteer.launch({
      headless: false,
      defaultViewport: null,
    });
    const page = await browser.newPage();
    await page.goto("https://www.rami-levy.co.il/he/online/market");

    const ramiLevyPrices: SuperMarketPricesI = {
      MILK_AND_EGGS_CATEGORY: [],
      FRUITS_AND_VEGETABLES_CATEGORY: [],
      SWEETS_CATEGORY: [],
      DRINKS_CATEGORY: [],
      MEAST_AND_FISH_CATEGORY: [],
      FROZENS_CATEGORY: [],
    };

    for (const key in RAMI_LEVT_CATEGORIES) {
      const categoryKey = key as keyof SuperMarketCategoriesI;
      const scrapedProducts: CategoryProductI[] = [];
      // const scrapedProducts = [];
      for (const productToScrape of RAMI_LEVT_CATEGORIES[categoryKey]) {
        try {
          await page.waitForSelector("#destination", { timeout: 5000 });

          await page.type("#destination", productToScrape + " ", {
            delay: 100,
          });

          await page.waitForSelector("#item-srch-0", { timeout: 5000 });

          const itemHandle = await page.$("#item-srch-0");

          if (itemHandle) {
            const { name, price } = await getScrapedProductNameAndPrice(
              itemHandle
            );
            console.log(name + " : " + price);

            if (name && price) {
              scrapedProducts.push({ name, price });
            } else if (name && !price) {
              scrapedProducts.push({ name, price: null });
            }
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
        } finally {
          await page.locator("#destination").fill("");
        }
      }
      ramiLevyPrices[categoryKey] = scrapedProducts;
    }

    // console.log(ramiLevyPrices);

    await browser.close();
    return ramiLevyPrices;
  } catch (error) {
    const { errorName, errorMessage } = getErrorData(error);
    console.log(errorName, "\n" + errorMessage);
    throw error;
  }
}
