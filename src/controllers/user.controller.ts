import { Request, Response } from "express";
import UserModel, { CartProduct } from "../models/user.model";
import { Types } from "mongoose";

// Extend the Express Request interface within this file
interface CustomRequest extends Request {
  userId?: string;
}

// export const getUserById = async (req: CustomRequest, res: Response) => {
//   const { userId } = req;

//   try {
//     const user = await UserModel.findById(userId).select("-password");
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     res.json(user);
//   } catch (err: any) {
//     res.status(500).json({ message: err.message });
//   }
// };

// Controller to add product to current cart
export const addProductToCurrentCart = async (
  req: CustomRequest,
  res: Response
) => {
  const { productId, quantity } = req.body;

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
      user.currentCart.push({ productId, quantity });
    }

    await user.save();

    res.status(200).json(user.currentCart);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// Controller to update product quantity in current cart
export const updateProductQuantityInCurrentCart = async (
  req: CustomRequest,
  res: Response
) => {
  const { productId, quantity } = req.body;

  try {
    const user = await UserModel.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const productIndex = user.currentCart.findIndex(
      (item) => item.productId === productId
    );

    if (productIndex > -1) {
      user.currentCart[productIndex].quantity = quantity;
      await user.save();
      res.status(200).json(user.currentCart);
    } else {
      res.status(404).json({ message: "Product not found in cart" });
    }
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// Controller to delete product from current cart
export const deleteProductFromCurrentCart = async (
  req: CustomRequest,
  res: Response
) => {
  const { productId } = req.body;

  try {
    const user = await UserModel.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.currentCart.pull({ productId } as CartProduct);

    await user.save();

    res.status(200).json(user.currentCart);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
// Controller to clear all products from the current cart
export const clearCurrentCart = async (req: CustomRequest, res: Response) => {
  try {
    const user = await UserModel.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Clear the current cart by setting it to an empty Types.Array<CartProduct>
    user.currentCart = new Types.Array<CartProduct>();

    await user.save();

    res.status(200).json({
      message: "Cart cleared successfully",
      currentCart: user.currentCart,
    });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
