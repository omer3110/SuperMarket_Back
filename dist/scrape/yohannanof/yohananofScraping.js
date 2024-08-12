"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.yohananofScrape = yohananofScrape;
const puppeteer_1 = __importDefault(require("puppeteer"));
const yohananof_contants_1 = __importDefault(require("./yohananof.contants"));
const ErrorsFunctions_1 = require("../../utils/errors/ErrorsFunctions");
const funcs_1 = require("../../utils/scrape/funcs");
async function yohananofScrape() {
    try {
        const browser = await puppeteer_1.default.launch({
            headless: false,
            defaultViewport: null,
        });
        const page = await browser.newPage();
        await page.goto("https://yochananof.co.il/category?id=MTI%3D");
        const yohananofPrices = {
            MILK_AND_EGGS_CATEGORY: [],
            FRUITS_AND_VEGETABLES_CATEGORY: [],
            SWEETS_CATEGORY: [],
            DRINKS_CATEGORY: [],
            MEAST_AND_FISH_CATEGORY: [],
            FROZENS_CATEGORY: [],
        };
        for (const key in yohananof_contants_1.default) {
            const categoryKey = key;
            const scrapedProducts = [];
            for (const productToScrape of yohananof_contants_1.default[categoryKey]) {
                try {
                    await page.waitForSelector("#search-form");
                    await page.locator('input[id=":r6:"]').fill(productToScrape);
                    await page.waitForSelector(".MuiBox-root.muirtl-1b53jue", {
                        timeout: 15000,
                    });
                    const itemHandle = await page.$(".MuiBox-root.muirtl-1b53jue");
                    if (itemHandle) {
                        await (0, funcs_1.addScrapedProductToCurrentCategory)(itemHandle, scrapedProducts, '[data-aria-desc="item_name"]', '[data-aria-desc="final_price"]');
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
                    }
                    else {
                        console.log("No product found.");
                    }
                }
                catch (error) {
                    const { errorName, errorMessage } = (0, ErrorsFunctions_1.getErrorData)(error);
                    console.log(`Error for product: ${productToScrape}`, errorName, "\n" + errorMessage);
                    scrapedProducts.push({ name: productToScrape, price: "N/A" });
                }
            }
            yohananofPrices[categoryKey] = scrapedProducts;
        }
        await browser.close();
        return yohananofPrices;
    }
    catch (error) {
        const { errorName, errorMessage } = (0, ErrorsFunctions_1.getErrorData)(error);
        console.log(errorName, "\n" + errorMessage);
        throw error;
    }
}
