import mongoose from "mongoose";
import dotenv from "dotenv";
import { writeOrderReq } from "./utils/scrape/funcs";
import ProductModel from "./models/product.model";
import { PRODUCTS } from "./constants/scrape.constants";

dotenv.config();

const seedProducts = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI!);

    // Clear existing products
    await ProductModel.deleteMany({});

    // Insert products
    await ProductModel.insertMany(PRODUCTS);

    console.log("Products seeded successfully");
  } catch (error) {
    console.error("Error seeding products:", error);
  } finally {
    // Disconnect from MongoDB
    await mongoose.disconnect();
  }
};

// writeOrderReq();
seedProducts();
