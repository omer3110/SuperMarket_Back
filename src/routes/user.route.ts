import { Router } from "express";
import {
  getUserById,
  addProductToCurrentCart,
  updateProductQuantityInCurrentCart,
  deleteProductFromCurrentCart,
  clearCurrentCart,
} from "../controllers/user.controller";

const router = Router();

// Route to get user by ID
router.get("/:id", getUserById);

// Route to add a product to the current cart
router.post("/current-cart/add", addProductToCurrentCart);

// Route to update the quantity of a product in the current cart
router.put("/current-cart/update", updateProductQuantityInCurrentCart);

// Route to delete a product from the current cart
router.delete("/current-cart/delete", deleteProductFromCurrentCart);

// Route to clear all products from the current cart
router.delete("/current-cart/clear", clearCurrentCart);
export default router;
