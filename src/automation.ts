// import app from "./app";

// const PORT = process.env.PORT || 3000;

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

import { shufersalScrape } from "./scrape/shufersal/shufersalScraping";
import { ramiLevyScrape } from "./scrape/rami_levi/rami_levyScraping";
import { yohananofScrape } from "./scrape/yohannanof/yohananofScraping";
import {
  ScrapedProductCategoriesOptions,
  SuperMarketPricesI,
} from "./types/scrape/scraping.types";
import { ProductI } from "./types/scrape/products.types";
import { defineCategory } from "./utils/scrape/funcs";

const SHUFERSAL_DATA = {
  MILK_AND_EGGS_CATEGORY: [
    { name: "חלב בקרטון 3% שומן", price: 7.11 },
    { name: "חלב מפוסטר 1% בקרטון", price: 6.7 },
    { name: "חלב בקרטון 3% שומן", price: 7.11 },
    { name: "מעדן שיבולת שועל", price: 6.9 },
    { name: "גבינה צהובה עמק פרוס 28%", price: 32.5 },
    { name: "ביצים M שופרסל", price: 12.89 },
    { name: "ביצים L שופרסל", price: 13.97 },
    { name: "גבינה לבנה 5% שומן", price: 11.36 },
    { name: "קוטג'' תנובה 5%", price: 5.9 },
    { name: "מעדן מילקי בטעם שוקולד", price: 2.9 },
    { name: "יוגורט פרו חלבון ניל 0% שומן", price: 6.4 },
  ],
  FRUITS_AND_VEGETABLES_CATEGORY: [
    { name: "עגבניה - תוצרת ישראל", price: 9.9 },
    { name: "מלפפון - תוצרת ישראל", price: 9.9 },
    { name: "בצל יבש - תוצרת ישראל", price: 7.9 },
    { name: "אבטיח אורגני", price: 40.05 },
    { name: "פלפל חריף - תוצרת ישראל", price: 11.9 },
    { name: "מלון אורגני", price: 29.8 },
    { name: "לימון - תוצרת ישראל", price: 11.9 },
    { name: "תפוח אדמה אורגני", price: 9.9 },
    { name: "תפוח עץ פינקריספי - תוצרת ישראל", price: 18.9 },
    { name: "חסה אורגני", price: 7.9 },
    { name: "עגבניה שרי בודד", price: 10.9 },
    { name: "מארז שום אורגני", price: 13.57 },
    { name: "כרוב לבן אורגני", price: 13.09 },
  ],
  SWEETS_CATEGORY: [
    { name: "קליק חום לבן", price: 8.5 },
    { name: "ממרח נוטלה", price: 29.9 },
    { name: "מרשמלו ורוד לבן 150 גרם", price: 6.9 },
    { name: "שוקולד פרה חלב עלית", price: 6.8 },
    { name: "שוקולד חלב אצבעות קינדר", price: 15.9 },
    { name: "חטיף קינדר הפי היפו", price: 15.5 },
    { name: "בונבוניירה פררו רושה", price: 31.9 },
    { name: "בונבוניירה מרסי", price: 27.3 },
    { name: "טופיפי", price: 12.5 },
    { name: "קליק ביסקוויט", price: 8.5 },
  ],
  DRINKS_CATEGORY: [
    { name: "פריגת מיקס תות-בננה", price: 7.9 },
    { name: "קוקה קולה בקבוק", price: 7.9 },
    { name: "פריגת ענבים", price: 7.9 },
    { name: "סאפה אלוורה מלון", price: 7.9 },
    { name: "ג''ל אורנים כחול לניקוי רב תכליתי", price: 14.9 },
    { name: "נביעות+טעם ענבים עדין", price: 8.9 },
    { name: "שוופס מוגז עדין אננס", price: 7.9 },
    { name: "פאנטה בטעם אורנג'", price: 7.9 },
    { name: "פפסי קולה", price: 6.9 },
    { name: "פריגת מנגו", price: 7.9 },
    { name: "ספרינג תה אפרסק", price: 7.3 },
    { name: "ג''אמפ ענבים", price: 6.9 },
  ],
  MEAST_AND_FISH_CATEGORY: [
    { name: "שניצל עוף טרי ארוז", price: 44.9 },
    { name: "שוקיים עוף טרי פרימיום כ- 750 גרם", price: 40.41 },
    { name: "פרגיות פרימיום שופרסל", price: 52.43 },
    { name: "בשר טחון טרי", price: 29.95 },
    { name: "אנטריקוט טרי מוכשר", price: 149.0 },
    { name: "נתח פילה סלמון קפוא", price: 19.93 },
    { name: "פילה אמנון קפוא", price: 5.08 },
    { name: "אסאדו עם עצם טרי", price: 69.9 },
    { name: "כנפי עוף טרי ארוז", price: 12.9 },
  ],
  FROZENS_CATEGORY: [],
};
const YOHANANOF_DATA = {
  MILK_AND_EGGS_CATEGORY: [
    { name: "חלב 3% בקרטון 1 ליטר", price: 7.1 },
    { name: "חלב תנובה טרי קרט+ פקק 1ל %1", price: 6.7 },
    { name: "משקה סויה ללא תוספת סוכר", price: 10.5 },
    { name: "משקה שיבולת שועל 1 ליטר", price: 12.5 },
    { name: "פרוסות גבינת עמק 28% 400 גרם", price: 24.9 },
    { name: "ביצים 12 יחידות M", price: 12.89 },
    { name: "ביצים גדול L 12", price: 13.97 },
    { name: "גבינה לבנה 5% מהדרין 250 גרם", price: 5.68 },
    { name: "קוטג תנובה גביע 250 גרם %5 ו.מהדרין", price: 5.9 },
    { name: "מילקי בטעם שוקולד", price: 2.9 },
    { name: "דנונה פרו 20 גר 1.5% שומן", price: 5.9 },
  ],
  FRUITS_AND_VEGETABLES_CATEGORY: [
    { name: "עגבניה", price: 6.9 },
    { name: "מלפפון", price: 6.9 },
    { name: "בצל יבש הולנד/סין", price: 4.9 },
    { name: "אבטיח  שלם", price: 3.9 },
    { name: "פלפל  חריף", price: 9.9 },
    { name: `מלון\n(1 יח' כ 1.5 ק"ג)`, price: 3.9 },
    { name: "לימון", price: 6.9 },
    { name: "תפוח אדמה לבן ארוז", price: 5.9 },
    {
      name: "תפוח עץ סמיט יוון/ספרד/איטליה/צרפת/פורטוגל/ארגנטינה/טורקיה",
      price: 10.9,
    },
    { name: "חסה  עגולה", price: 5.9 },
    { name: "עגבניות שרי במשקל", price: 19.9 },
    { name: "מארז שום יבש", price: 3.9 },
    { name: `כרוב לבן\n(1 יח' כ 2.2 ק"ג)`, price: 3.9 },
  ],
  SWEETS_CATEGORY: [
    { name: "קליק מעורב חום לבן תפזורת 65גר", price: 6.4 },
    { name: "ממרח נוטלה 750 גרם", price: 29.5 },
    { name: 'מרשמלו ורוד לבן בד"ץ כרמית 150 גרם', price: 5.5 },
    { name: "שוקולד חלב 100 גרם מגדים ללא גלוטן", price: 6.8 },
    { name: "אצבעות קינדר 200 גרם", price: 14.9 },
    { name: "קינדר הפי היפו חמישייה", price: 14.9 },
    { name: "פררו רושה 200 גרם", price: 27.5 },
    { name: "מרסי בונבוניירה 250 גרם", price: 24.9 },
    { name: "טופיפי 125 גרם", price: 13.9 },
    { name: "קליק ביסקויט תפזורת 65גר", price: 6.4 },
  ],
  DRINKS_CATEGORY: [
    { name: "פריגת מיקס תות בננה 1.5 ליטר", price: 7.9 },
    { name: "קוקה קולה 1.5 ליטר", price: 7.9 },
    { name: "פריגת ענבים 1.5 ליטר", price: 7.9 },
    { name: "משקה אלוורה בטעם מלון 1 ליטר", price: 12.9 },
    { name: "קוקה קולה זירו 1.5 ליטר", price: 7.9 },
    { name: "ויטמינצ'יק ענבים 1 ליטר", price: 12.9 },
    { name: "שוופס מוגז עדין אננס 1.5 ליטר", price: 6.8 },
    { name: "פאנטה אורנג' 1.5 ליטר", price: 7.9 },
    { name: "פפסי קולה 1.5 ליטר", price: 6.5 },
    { name: "פריגת מנגו 1.5 ליטר", price: 7.9 },
    { name: "ספרינג אפרסק 1.5 ליטר", price: 6.2 },
    { name: "ג'אמפ ענבים 1.5 ליטר", price: 6.9 },
  ],
  MEAST_AND_FISH_CATEGORY: [
    { name: "שניצל עוף טרי פרימיום  דק דק", price: 54.9 },
    { name: "שוקיים עוף טרי  פרימיום", price: 39.9 },
    { name: "סטייק פרגית טרי  פרימיום", price: 69.9 },
    { name: "בשר טחון דל שומן טרי", price: 59.9 },
    { name: "אנטריקוט טרי פרימיום", price: 179.9 },
    { name: "פילה סלמון נורווגי קפוא", price: 69.9 },
    { name: "פילה אמנון 7-9 קפוא", price: 28.9 },
    { name: "אסאדו ללא עצם מעובד מופשר", price: 59.9 },
    { name: "כנפיים עוף טרי  פרימיום", price: 16.9 },
  ],
  FROZENS_CATEGORY: [],
};

function adjustDataByIndex(
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

async function writeOrderReq() {
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
writeOrderReq();
