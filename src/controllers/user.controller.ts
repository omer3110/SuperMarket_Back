import { Request, Response } from "express";
import UserModel from "../models/user.model";
import { Types } from "mongoose";
import { CartProductI } from "../types/userTypes";
import { AuthRequest } from "../types/auth.types";
import { getErrorData } from "../utils/errors/ErrorsFunctions";

export const addProductToCurrentCart = async (
  req: AuthRequest,
  res: Response
) => {
  const { productId, productName, quantity } = req.body;
  if (!productId || !productName || !quantity) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const user = await UserModel.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const productIndex = user.currentCart.findIndex(
      (item) => item.productId === productId
    );

    if (productIndex > -1) {
      user.currentCart[productIndex].quantity += quantity;
    } else {
      user.currentCart.push({
        productId,
        productName,
        quantity,
      } as CartProductI);
    }

    await user.save();

    res.status(200).json(user.currentCart);
  } catch (error) {
    const { errorMessage, errorName } = getErrorData(error);
    console.log(errorName, errorMessage);
    res.status(500).json({ message: errorMessage });
  }
};

// Controller to update product quantity in current cart
export const incrementProductQuantity = async (
  req: AuthRequest,
  res: Response
) => {
  const { productId } = req.params;

  try {
    const user = await UserModel.findOneAndUpdate(
      { _id: req.userId, "currentCart.productId": productId },
      { $inc: { "currentCart.$.quantity": 1 } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user.currentCart);
  } catch (error) {
    const { errorMessage, errorName } = getErrorData(error);
    console.log(errorName, errorMessage);
    res.status(500).json({ message: errorMessage });
  }
};

// Controller to delete product from current cart
export const decrementProductQuantity = async (
  req: AuthRequest,
  res: Response
) => {
  const { productId } = req.params;

  try {
    const user = await UserModel.findOneAndUpdate(
      { _id: req.userId, "currentCart.productId": productId },
      { $inc: { "currentCart.$.quantity": -1 } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user.currentCart);
  } catch (error) {
    const { errorMessage, errorName } = getErrorData(error);
    console.log(errorName, errorMessage);
    res.status(500).json({ message: errorMessage });
  }
};
// Controller to clear all products from the current cart
export const clearCurrentCart = async (req: AuthRequest, res: Response) => {
  try {
    const user = await UserModel.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Clear the current cart by setting it to an empty Types.Array<CartProduct>
    user.currentCart = new Types.Array<CartProductI>();

    await user.save();

    res.status(200).json({
      message: "Cart cleared successfully",
      currentCart: user.currentCart,
    });
  } catch (error) {
    const { errorMessage, errorName } = getErrorData(error);
    console.log(errorName, errorMessage);
    res.status(500).json({ message: errorMessage });
  }
};

export const getCartComparison = async (req: AuthRequest, res: Response) => {
  try {
    // const products = 
  } catch (error) {
    const { errorMessage, errorName } = getErrorData(error);
    console.log(errorName, errorMessage);
    res.status(500).json({ message: errorMessage });
  }
};
