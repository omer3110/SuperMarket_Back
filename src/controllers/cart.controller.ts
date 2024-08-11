import { Request, Response } from "express";
import CartModel from "../models/cart.model";
import UserModel from "../models/user.model";
import { AuthRequest } from "../types/auth.types";
import { getErrorData } from "../utils/errors/ErrorsFunctions";

export const createCart = async (req: AuthRequest, res: Response) => {
  const { name, cartProducts, collaborators } = req.body;

  try {
    // Check if a cart with the same name already exists for the user
    const cart = await CartModel.findOne({ name, userId: req.userId });
    if (cart) {
      return res.status(400).json({ message: "Cart Name already exists" });
    }

    // Create a new cart with the provided data
    const newCart = new CartModel({
      name,
      userId: req.userId,
      collaborators,
      cartProducts,
    });

    // Save the new cart to the database
    await newCart.save();

    // Return the newly created cart
    return res.status(201).json(newCart);
  } catch (err) {
    const { errorMessage, errorName } = getErrorData(err);
    console.error("createCart: error", errorName, errorMessage);
    if (errorName === "ValidationError") {
      return res.status(400).json({ message: errorMessage });
    }
    res.status(500).json({ message: "Internal Error" });
  }
};

// Controller to add collaborators to an existing cart
export const addCollaborator = async (req: AuthRequest, res: Response) => {
  const { cartId } = req.params;
  const { collaboratorUsername } = req.body;

  try {
    const user = await UserModel.findOne({ username: collaboratorUsername });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const cart = await CartModel.findById(cartId);
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
  } catch (err) {
    const { errorMessage, errorName } = getErrorData(err);
    res.status(500).json({ message: errorMessage });
  }
};

// Controller to get all carts of a user
export const getUserCarts = async (req: AuthRequest, res: Response) => {
  try {
    const carts = await CartModel.find({ userId: req.userId });
    res.json(carts);
  } catch (err) {
    const { errorMessage, errorName } = getErrorData(err);
    res.status(500).json({ message: errorMessage });
  }
};

// Controller to get a specific cart by ID
export const getCartById = async (req: AuthRequest, res: Response) => {
  const { cartId } = req.params;

  try {
    const cart = await CartModel.findById(cartId);
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    res.json(cart);
  } catch (err) {
    const { errorMessage, errorName } = getErrorData(err);
    res.status(500).json({ message: errorMessage });
  }
};

// Controller to update a cart
export const updateCart = async (req: AuthRequest, res: Response) => {
  const { cartId } = req.params;
  const { name, cartProducts, collaborators } = req.body;

  try {
    const cart = await CartModel.findById(cartId);
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Update the cart's properties
    cart.name = name || cart.name;
    cart.cartProducts = cartProducts || cart.cartProducts;
    cart.collaborators = collaborators || cart.collaborators;

    await cart.save();

    res.json(cart);
  } catch (err) {
    const { errorMessage, errorName } = getErrorData(err);
    res.status(500).json({ message: errorMessage });
  }
};

// Controller to delete a cart
export const deleteCart = async (req: AuthRequest, res: Response) => {
  const { cartId } = req.params;

  try {
    const cart = await CartModel.findByIdAndDelete(cartId);
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    res.json({ message: "Cart deleted successfully" });
  } catch (err) {
    const { errorMessage, errorName } = getErrorData(err);
    res.status(500).json({ message: errorMessage });
  }
};
