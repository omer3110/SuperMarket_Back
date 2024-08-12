"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProducts = getProducts;
exports.getProductById = getProductById;
exports.getProductByName = getProductByName;
const ErrorsFunctions_1 = require("../utils/errors/ErrorsFunctions");
const product_model_1 = __importDefault(require("../models/product.model"));
async function getProducts(req, res) {
    const { category } = req.query;
    const queryCategory = category || "Milk and Eggs";
    try {
        const products = await product_model_1.default.find({
            category: queryCategory,
        });
        res.status(200).json(products);
    }
    catch (error) {
        const { errorMessage, errorName } = (0, ErrorsFunctions_1.getErrorData)(error);
        console.log(errorName, errorMessage);
        res.status(500).json("Server error getting all reviews");
    }
}
async function getProductById(req, res) {
    const { id } = req.params;
    try {
        const product = await product_model_1.default.findById(id);
        if (!product) {
            return res.status(404).json("Product not found");
        }
        res.status(200).json(product);
    }
    catch (error) {
        const { errorMessage, errorName } = (0, ErrorsFunctions_1.getErrorData)(error);
        console.log(errorName, errorMessage);
        res.status(500).json("Server error getting all reviews");
    }
}
async function getProductByName(req, res) {
    const { productName } = req.body;
    if (!productName) {
        res.status(200).json([]);
    }
    try {
        const products = await product_model_1.default.find({
            name: { $regex: productName, $options: "i" },
        }, {}, { limit: 8 });
        if (!products) {
            return res.status(404).json("Product not found");
        }
        res.status(200).json(products);
    }
    catch (error) {
        const { errorMessage, errorName } = (0, ErrorsFunctions_1.getErrorData)(error);
        console.log(errorName, errorMessage);
        res.status(500).json("Server error getting all reviews");
    }
}
