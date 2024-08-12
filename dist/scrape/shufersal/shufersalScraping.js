"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.shufersalScrape = shufersalScrape;
const puppeteer_1 = __importDefault(require("puppeteer"));
const shufersal_constatns_1 = __importDefault(require("./shufersal.constatns")); // SHUFERSAL_MILK_AND_EGGS_CATEGORY,
const ErrorsFunctions_1 = require("../../utils/errors/ErrorsFunctions");
const funcs_1 = require("../../utils/scrape/funcs");
async function shufersalScrape() {
    const shufersalPrices = {
        MILK_AND_EGGS_CATEGORY: [],
        FRUITS_AND_VEGETABLES_CATEGORY: [],
        SWEETS_CATEGORY: [],
        DRINKS_CATEGORY: [],
        MEAST_AND_FISH_CATEGORY: [],
        FROZENS_CATEGORY: [],
    };
    const shufersalImgs = {
        MILK_AND_EGGS_CATEGORY: [],
        FRUITS_AND_VEGETABLES_CATEGORY: [],
        SWEETS_CATEGORY: [],
        DRINKS_CATEGORY: [],
        MEAST_AND_FISH_CATEGORY: [],
        FROZENS_CATEGORY: [],
    };
    try {
        const browser = await puppeteer_1.default.launch({
            headless: false,
            defaultViewport: null,
        });
        const page = await browser.newPage();
        await page.goto("https://www.shufersal.co.il/online/he/S");
        for (const key in shufersal_constatns_1.default) {
            const categoryKey = key;
            const scrapedProducts = [];
            const scrapedImgs = [];
            for (const productToScrape of shufersal_constatns_1.default[categoryKey]) {
                try {
                    await page.locator("#js-site-search-input").fill(productToScrape);
                    await page.waitForSelector(".tile.miglog-prod", { timeout: 5000 });
                    const itemHandle = await page.$(".tile.miglog-prod");
                    if (itemHandle) {
                        await (0, funcs_1.addScrapedProductToCurrentCategory)(itemHandle, scrapedProducts, ".text", ".totalPrice .number", scrapedImgs, "a.imgContainer img");
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
            shufersalImgs[categoryKey] = scrapedImgs;
            shufersalPrices[categoryKey] = scrapedProducts;
        }
        await browser.close();
        return { shufersalPrices, shufersalImgs };
    }
    catch (error) {
        const { errorName, errorMessage } = (0, ErrorsFunctions_1.getErrorData)(error);
        console.log(errorName, "\n" + errorMessage);
        throw error;
    }
}
