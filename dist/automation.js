"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const funcs_1 = require("./utils/scrape/funcs");
const product_model_1 = __importDefault(require("./models/product.model"));
const scrape_constants_1 = require("./constants/scrape.constants");
dotenv_1.default.config();
const seedProducts = async () => {
    try {
        // Connect to MongoDB
        await mongoose_1.default.connect(process.env.MONGO_URI);
        // Clear existing products
        await product_model_1.default.deleteMany({});
        // Insert products
        await product_model_1.default.insertMany(scrape_constants_1.PRODUCTS);
        console.log("Products seeded successfully");
    }
    catch (error) {
        console.error("Error seeding products:", error);
    }
    finally {
        // Disconnect from MongoDB
        await mongoose_1.default.disconnect();
    }
};
(0, funcs_1.writeOrderReq)();
// seedProducts();
