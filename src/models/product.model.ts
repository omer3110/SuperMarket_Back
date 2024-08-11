import mongoose, { Schema } from "mongoose";
import { BRANDS_NAMES } from "../types/products.types";

const CompanyProductSchema = new Schema({
  brandName: {
    type: String,
    required: true,
    enum: BRANDS_NAMES,
  },
  price: { type: Number, required: true },
});

const ProductSchema = new Schema({
  // description - string
  name: { type: String, required: true },
  img: { type: String, required: true },
  prices: { type: [CompanyProductSchema], required: true },
});

const ProductModel = mongoose.model("Product", ProductSchema);
export default ProductModel;
