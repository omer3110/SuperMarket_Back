import { Router } from "express";
import {
  addProductToCurrentCart,
  updateProductQuantityInCurrentCart,
  deleteProductFromCurrentCart,
  clearCurrentCart,
} from "../controllers/user.controller";

const router = Router();
// Route to add a product to the current cart
router.post("/current-cart", addProductToCurrentCart);

// Route to update the quantity of a product in the current cart
router.patch("/current-cart", updateProductQuantityInCurrentCart);

// Route to delete a product from the current cart
router.patch("/current-cart/delete/:productId", deleteProductFromCurrentCart);

// Route to clear all products from the current cart
router.delete("/current-cart/clear", clearCurrentCart);
export default router;
