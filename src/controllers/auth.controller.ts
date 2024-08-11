import { Request, Response } from "express";
import UserModel from "../models/user.model";
import jwt from "jsonwebtoken";

// Extract JWT_SECRET from environment variables
const JWT_SECRET = process.env.JWT_SECRET as string;

// Controller to handle user registration
export const register = async (req: Request, res: Response) => {
  const { firstName, lastName, email, username, address, password } = req.body;

  try {
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const newUser = new UserModel({
      firstName,
      lastName,
      email,
      username,
      address,
      password,
    });

    await newUser.save();

    const token = jwt.sign({ userId: newUser._id }, JWT_SECRET, {
      expiresIn: "4h",
    });

    res.status(201).json({ token, user: newUser });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// Controller to handle user login
export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    const user = await UserModel.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: "4h",
    });

    res.json({ token, user });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
