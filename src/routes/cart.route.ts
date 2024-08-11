import { Router } from "express";
import {
  createCart,
  getUserCarts,
  getCartById,
  updateCart,
  deleteCart,
  addCollaborator, // Import the addCollaborator controller
} from "../controllers/cart.controller";
import { authorizeCartOwner } from "../middlewares/auth.middleware"; // Import the authorizeCartOwner middleware

const router = Router();

// Route to create a new cart
router.post("/", createCart);

// Route to get all carts of the current user
router.get("/", getUserCarts);

// Route to get a specific cart by ID
router.get("/:cartId", getCartById);

// Route to update a cart by ID
router.patch("/:cartId", authorizeCartOwner, updateCart);

// Route to delete a cart by ID
router.delete("/:cartId", authorizeCartOwner, deleteCart);

// Route to add a collaborator to a cart
router.post("/:cartId/collaborators", authorizeCartOwner, addCollaborator);

export default router;
