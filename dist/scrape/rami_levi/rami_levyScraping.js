"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ramiLevyScrape = ramiLevyScrape;
const puppeteer_1 = __importDefault(require("puppeteer"));
const rami_constants_1 = __importDefault(require("./rami.constants"));
const ErrorsFunctions_1 = require("../../utils/errors/ErrorsFunctions");
const funcs_1 = require("../../utils/scrape/funcs");
async function ramiLevyScrape() {
    try {
        const browser = await puppeteer_1.default.launch({
            headless: false,
            defaultViewport: null,
        });
        const page = await browser.newPage();
        await page.goto("https://www.rami-levy.co.il/he/online/market");
        const ramiLevyPrices = {
            MILK_AND_EGGS_CATEGORY: [],
            FRUITS_AND_VEGETABLES_CATEGORY: [],
            SWEETS_CATEGORY: [],
            DRINKS_CATEGORY: [],
            MEAST_AND_FISH_CATEGORY: [],
            FROZENS_CATEGORY: [],
        };
        for (const key in rami_constants_1.default) {
            const categoryKey = key;
            const scrapedProducts = [];
            // const scrapedProducts = [];
            for (const productToScrape of rami_constants_1.default[categoryKey]) {
                try {
                    await page.waitForSelector("#destination", { timeout: 5000 });
                    await page.type("#destination", productToScrape + " ", {
                        delay: 100,
                    });
                    await page.waitForSelector("#item-srch-0", { timeout: 5000 });
                    const itemHandle = await page.$("#item-srch-0");
                    if (itemHandle) {
                        const { name, price } = await (0, funcs_1.getScrapedProductNameAndPrice)(itemHandle);
                        console.log(name + " : " + price);
                        if (name && price) {
                            scrapedProducts.push({ name, price });
                        }
                        else if (name && !price) {
                            scrapedProducts.push({ name, price: null });
                        }
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
                finally {
                    await page.locator("#destination").fill("");
                }
            }
            ramiLevyPrices[categoryKey] = scrapedProducts;
        }
        // console.log(ramiLevyPrices);
        await browser.close();
        return ramiLevyPrices;
    }
    catch (error) {
        const { errorName, errorMessage } = (0, ErrorsFunctions_1.getErrorData)(error);
        console.log(errorName, "\n" + errorMessage);
        throw error;
    }
}
