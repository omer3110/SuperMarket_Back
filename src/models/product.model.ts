import mongoose, { Schema } from "mongoose";
import {
  BrandsOptions,
  CompanyProductI,
  ProductI,
  ProductsCategoriesOptions,
} from "../types/products.types";
import {
  BRANDS_NAMES,
  PRODUCTS_CATEGORIES,
} from "../constants/products.constants";

export const CompanyProductSchema = new Schema<CompanyProductI>({
  brandName: {
    type: String,
    required: true,
    enum: BRANDS_NAMES,
  },
  price: { type: Number, required: true },
});

const ProductSchema = new Schema<ProductI>({
  name: { type: String, required: true },
  category: { type: String, required: true, enum: PRODUCTS_CATEGORIES },
  img: { type: String, required: true },
  prices: { type: [CompanyProductSchema], required: true },
});

const ProductModel = mongoose.model("Product", ProductSchema);
export default ProductModel;
