import { Request, Response } from "express";
import UserModel from "../models/user.model";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

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
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await UserModel.findOne({ email });
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

    res.json({ token, user });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
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
