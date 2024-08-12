"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const router = (0, express_1.Router)();
// Route to add a product to the current cart
router.post("/current-cart", user_controller_1.addProductToCurrentCart);
// Route to update the quantity of a product in the current cart
router.patch("/current-cart/increment/:productId", user_controller_1.incrementProductQuantity);
// Route to delete a product from the current cart
router.patch("/current-cart/decrement/:productId", user_controller_1.decrementProductQuantity);
// Route to clear all products from the current cart
router.delete("/current-cart/clear", user_controller_1.clearCurrentCart);
router.delete("/current-cart/:productId", user_controller_1.removeProductFromCart);
exports.default = router;
