"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cart_controller_1 = require("../controllers/cart.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware"); // Import the authorizeCartOwner middleware
const router = (0, express_1.Router)();
// Route to create a new cart
router.post("/", cart_controller_1.createCart);
// Route to get all carts of the current user
router.get("/", cart_controller_1.getUserCarts);
// Route to get a specific cart by ID
router.get("/:cartId", cart_controller_1.getCartById);
// Route to update a cart by ID
router.patch("/:cartId", auth_middleware_1.authorizeCartOwner, cart_controller_1.updateCart);
// Route to delete a cart by ID
router.delete("/:cartId", auth_middleware_1.authorizeCartOwner, cart_controller_1.deleteCart);
// Route to add a collaborator to a cart
router.post("/:cartId/collaborators", auth_middleware_1.authorizeCartOwner, cart_controller_1.addCollaborator);
exports.default = router;
