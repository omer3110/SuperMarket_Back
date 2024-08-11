import { Router } from "express";
import {
  addProductToCurrentCart,
  decrementProductQuantity,
  clearCurrentCart,
  incrementProductQuantity,
  removeProductFromCart,
} from "../controllers/user.controller";

const router = Router();
// Route to add a product to the current cart
router.post("/current-cart", addProductToCurrentCart);

// Route to update the quantity of a product in the current cart
router.patch("/current-cart/increment/:productId", incrementProductQuantity);

// Route to delete a product from the current cart
router.patch("/current-cart/decrement/:productId", decrementProductQuantity);

// Route to clear all products from the current cart
router.delete("/current-cart/clear", clearCurrentCart);

router.delete("/current-cart/:productId", removeProductFromCart);

export default router;
