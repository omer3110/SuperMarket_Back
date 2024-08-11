import e, { Request, Response } from "express";
import UserModel from "../models/user.model";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { getErrorData } from "../utils/errors/ErrorsFunctions";

// Extend the Express Request interface within this file
interface CustomRequest extends Request {
  userId?: string;
}

// Extract JWT_SECRET from environment variables
const JWT_SECRET = process.env.JWT_SECRET as string;

// Controller to handle user registration
export const register = async (req: Request, res: Response) => {
  const { firstName, lastName, email, username, address, password } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create a new user
    const newUser = new UserModel({
      firstName,
      lastName,
      email,
      username,
      address,
      password, // Password will be hashed by the pre-save middleware in the model
    });

    await newUser.save();

    // Generate a JWT token
    const token = jwt.sign({ userId: newUser._id }, JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(201).json({ token, user: newUser });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// Controller to handle user login
export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body; // Accept username and password from the request body
  try {
    // Find the user by username
    const user = await UserModel.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Compare the password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate a JWT token
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: "1h",
    });
    res.status(200).json({ token, user });
  } catch (err) {
    const { errorMessage, errorName } = getErrorData(err);
    console.log(errorName, errorMessage);
    res.status(500).json({ message: errorMessage });
  }
};

// Controller to get user by ID
export const getUserById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const user = await UserModel.findById(id).select("-password"); // Exclude the password from the result
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

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
      // Product exists in cart, update quantity
      user.currentCart[productIndex].quantity += quantity;
    } else {
      // Add new product to cart
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
      // Update the quantity of the product
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
// export const deleteProductFromCurrentCart = async (
//   req: Request,
//   res: Response
// ) => {
//   const { productId } = req.body;

//   try {
//     const user = await UserModel.findById(req.userId);

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     // Use Mongoose's `pull` method to remove the product from the currentCart
//     user.currentCart.pull({ productId });

//     await user.save();

//     res.status(200).json(user.currentCart);
//   } catch (err: any) {
//     res.status(500).json({ message: err.message });
//   }
// };
