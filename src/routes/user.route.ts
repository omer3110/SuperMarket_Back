import { Router } from "express";
import {
  register,
  login,
  getUserById,
  addProductToCurrentCart,
  updateProductQuantityInCurrentCart,
  //   deleteProductFromCurrentCart,
} from "../controllers/user.controller";
import { verifyToken } from "../middlewares/auth.middleware";

const router = Router();

// Route to handle user registration
router.post("/register", register);

// Route to handle user login
router.post("/login", login);

// Route to get user by ID
router.get("/:id", verifyToken, getUserById);

// Route to add a product to the current cart
router.post("/current-cart/add", verifyToken, addProductToCurrentCart);

// Route to update the quantity of a product in the current cart
router.put(
  "/current-cart/update",
  verifyToken,
  updateProductQuantityInCurrentCart
);

// Route to delete a product from the current cart
// router.delete(
//   "/current-cart/delete",
//   verifyToken,
//   deleteProductFromCurrentCart
// );

export default router;
