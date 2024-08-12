"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCart = exports.updateCart = exports.getCartById = exports.getUserCarts = exports.addCollaborator = exports.createCart = void 0;
const cart_model_1 = __importDefault(require("../models/cart.model"));
const user_model_1 = __importDefault(require("../models/user.model"));
const ErrorsFunctions_1 = require("../utils/errors/ErrorsFunctions");
const createCart = async (req, res) => {
    const { name, cartProducts, collaborators } = req.body;
    try {
        // Check if a cart with the same name already exists for the user
        const cart = await cart_model_1.default.findOne({ name, userId: req.userId });
        if (cart) {
            return res.status(400).json({ message: "Cart Name already exists" });
        }
        // Create a new cart with the provided data
        const newCart = new cart_model_1.default({
            name,
            userId: req.userId,
            collaborators,
            cartProducts,
        });
        // Save the new cart to the database
        await newCart.save();
        // Return the newly created cart
        return res.status(201).json(newCart);
    }
    catch (err) {
        const { errorMessage, errorName } = (0, ErrorsFunctions_1.getErrorData)(err);
        console.error("createCart: error", errorName, errorMessage);
        if (errorName === "ValidationError") {
            return res.status(400).json({ message: errorMessage });
        }
        res.status(500).json({ message: "Internal Error" });
    }
};
exports.createCart = createCart;
// Controller to add collaborators to an existing cart
const addCollaborator = async (req, res) => {
    const { cartId } = req.params;
    const { collaboratorUsername } = req.body;
    try {
        const user = await user_model_1.default.findOne({ username: collaboratorUsername });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const cart = await cart_model_1.default.findById(cartId);
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }
        if (cart.collaborators?.includes(user._id)) {
            return res
                .status(400)
                .json({ message: "User is already a collaborator" });
        }
        cart.collaborators?.push(user._id);
        await cart.save();
        res.json(cart);
    }
    catch (err) {
        const { errorMessage, errorName } = (0, ErrorsFunctions_1.getErrorData)(err);
        res.status(500).json({ message: errorMessage });
    }
};
exports.addCollaborator = addCollaborator;
// Controller to get all carts of a user
const getUserCarts = async (req, res) => {
    try {
        const carts = await cart_model_1.default.find({ userId: req.userId });
        res.json(carts);
    }
    catch (err) {
        const { errorMessage, errorName } = (0, ErrorsFunctions_1.getErrorData)(err);
        res.status(500).json({ message: errorMessage });
    }
};
exports.getUserCarts = getUserCarts;
// Controller to get a specific cart by ID
const getCartById = async (req, res) => {
    const { cartId } = req.params;
    try {
        const cart = await cart_model_1.default.findById(cartId);
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }
        res.json(cart);
    }
    catch (err) {
        const { errorMessage, errorName } = (0, ErrorsFunctions_1.getErrorData)(err);
        res.status(500).json({ message: errorMessage });
    }
};
exports.getCartById = getCartById;
// Controller to update a cart
const updateCart = async (req, res) => {
    const { cartId } = req.params;
    const { name, cartProducts, collaborators } = req.body;
    try {
        const cart = await cart_model_1.default.findById(cartId);
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }
        // Update the cart's properties
        cart.name = name || cart.name;
        cart.cartProducts = cartProducts || cart.cartProducts;
        cart.collaborators = collaborators || cart.collaborators;
        await cart.save();
        res.json(cart);
    }
    catch (err) {
        const { errorMessage, errorName } = (0, ErrorsFunctions_1.getErrorData)(err);
        res.status(500).json({ message: errorMessage });
    }
};
exports.updateCart = updateCart;
// Controller to delete a cart
const deleteCart = async (req, res) => {
    const { cartId } = req.params;
    try {
        const cart = await cart_model_1.default.findByIdAndDelete(cartId);
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }
        res.json({ message: "Cart deleted successfully" });
    }
    catch (err) {
        const { errorMessage, errorName } = (0, ErrorsFunctions_1.getErrorData)(err);
        res.status(500).json({ message: errorMessage });
    }
};
exports.deleteCart = deleteCart;
