import { Request, Response } from "express";
import CartModel from "../models/cart.model";
import UserModel from "../models/user.model";

// Extend the Express Request interface within this file
interface CustomRequest extends Request {
  userId?: string;
}

// Controller to create a new cart
export const createCart = async (req: CustomRequest, res: Response) => {
  const { name, cartProducts, collaborators } = req.body;

  try {
    const newCart = new CartModel({
      name,
      userId: req.userId, // Now TypeScript will recognize userId on req
      collaborators,
      cartProducts,
    });

    await newCart.save();

    res.status(201).json(newCart);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// Controller to add collaborators to an existing cart
export const addCollaborator = async (req: CustomRequest, res: Response) => {
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

    // Check if the user is already a collaborator
    if (cart.collaborators?.includes(user._id)) {
      return res
        .status(400)
        .json({ message: "User is already a collaborator" });
    }

    cart.collaborators?.push(user._id);
    await cart.save();

    res.json(cart);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// Controller to get all carts of a user
export const getUserCarts = async (req: CustomRequest, res: Response) => {
  try {
    const carts = await CartModel.find({ userId: req.userId });
    res.json(carts);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// Controller to get a specific cart by ID
export const getCartById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const cart = await CartModel.findById(id);
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    res.json(cart);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// Controller to update a cart
export const updateCart = async (req: CustomRequest, res: Response) => {
  const { id } = req.params;
  const { name, cartProducts, collaborators } = req.body;

  try {
    const cart = await CartModel.findById(id);
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Update the cart's properties
    cart.name = name || cart.name;
    cart.cartProducts = cartProducts || cart.cartProducts;
    cart.collaborators = collaborators || cart.collaborators;

    await cart.save();

    res.json(cart);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// Controller to delete a cart
export const deleteCart = async (req: CustomRequest, res: Response) => {
  const { cartId } = req.params;

  try {
    const cart = await CartModel.findByIdAndDelete(cartId);
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    res.json({ message: "Cart deleted successfully" });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
