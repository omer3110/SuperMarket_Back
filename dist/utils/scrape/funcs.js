"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reverseString = reverseString;
exports.defineCategory = defineCategory;
exports.getScrapedProductNameAndPrice = getScrapedProductNameAndPrice;
exports.addScrapedProductToCurrentCategory = addScrapedProductToCurrentCategory;
exports.adjustDataByIndex = adjustDataByIndex;
exports.writeOrderReq = writeOrderReq;
const rami_levyScraping_1 = require("../../scrape/rami_levi/rami_levyScraping");
const shufersalScraping_1 = require("../../scrape/shufersal/shufersalScraping");
const yohananofScraping_1 = require("../../scrape/yohannanof/yohananofScraping");
function reverseString(str) {
    return str.split("").reverse().join("");
}
function defineCategory(category) {
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
async function getScrapedProductNameAndPrice(itemHandle) {
    const name = await itemHandle.$eval(".text-wrap", (el) => el.textContent?.trim() || "");
    const price = await itemHandle.$eval(".sr-only span:first-child", (el) => el.textContent?.trim() || "N/A");
    return { name, price };
}
async function addScrapedProductToCurrentCategory(itemHandle, scrapedProducts, nameSelector, priceSelector, scrapedImgs, imageSelector) {
    const name = await itemHandle.$eval(nameSelector, (el) => el.textContent?.trim() || "");
    const price = await itemHandle.$eval(priceSelector, (el) => el.textContent?.trim() || "N/A");
    if (imageSelector && scrapedImgs) {
        const imgUrl = await itemHandle.$eval(imageSelector, (el) => el.getAttribute("src") || "N/A");
        console.log(imgUrl);
        scrapedImgs.push(imgUrl);
    }
    console.log(name + " : " + price);
    if (name && price) {
        scrapedProducts.push({ name, price });
    }
    else if (name && !price) {
        scrapedProducts.push({ name, price: null });
    }
}
function adjustDataByIndex(data1, data2, data3, imgs) {
    const adjustedData = [];
    for (const key in data1) {
        const categoryKey = key;
        for (let i = 0; i < data1[categoryKey].length; i++) {
            const adjustedProduct = {
                name: data1[categoryKey][i].name,
                img: imgs[categoryKey][i],
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
async function writeOrderReq() {
    try {
        const ramiLevyData = await (0, rami_levyScraping_1.ramiLevyScrape)();
        const { shufersalPrices: shufersalData, shufersalImgs } = await (0, shufersalScraping_1.shufersalScrape)();
        console.log(shufersalImgs);
        const yohananofData = await (0, yohananofScraping_1.yohananofScrape)();
        console.log("Please translate all the hebrew to english and convert all the sub prices to numbers (omit symbols or chars if needed, if null then insert -1). Also I want you to add one line description key for each ");
        console.dir(adjustDataByIndex(shufersalData, yohananofData, ramiLevyData, shufersalImgs), {
            depth: null,
        });
    }
    catch (error) {
        console.log(error);
    }
}
