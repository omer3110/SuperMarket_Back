"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const product_controller_1 = require("../controllers/product.controller");
const productsRouter = (0, express_1.Router)();
productsRouter.get("/", product_controller_1.getProducts);
productsRouter.post("/", product_controller_1.getProductByName);
productsRouter.get("/:id", product_controller_1.getProductById);
exports.default = productsRouter;
