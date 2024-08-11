import { Request, Response } from "express";
import UserModel from "../models/user.model";
import jwt from "jsonwebtoken";
import mongoose, { get } from "mongoose";
import { getErrorData } from "../utils/errors/ErrorsFunctions";
import { AuthRequest } from "../types/auth.types";

// Extract JWT_SECRET from environment variables
const JWT_SECRET = process.env.JWT_SECRET as string;

// Controller to handle user registration
export const register = async (req: Request, res: Response) => {
  const { firstName, lastName, email, username, address, password } = req.body;

  try {
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
  } catch (err) {
    const { errorMessage, errorName } = getErrorData(err);
    console.log("Register error: ", errorName + "\n" + errorMessage);

    if (err instanceof mongoose.mongo.MongoServerError && err.code === 11000) {
      return res.status(400).json("User already exists");
    }
    res.status(500).json({ message: "Internal Error" });
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

    res.status(200).json({ token });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// Controller to get the logged-in user's data
export const getLoggedInUser = async (req: AuthRequest, res: Response) => {
  try {
    const user = await UserModel.findById(req.userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      address: user.address,
      currentCart: user.currentCart,
    });
  } catch (err: any) {
    const { errorMessage, errorName } = getErrorData(err);
    console.log("Login error: ", errorName + "\n" + errorMessage);
    res.status(500).json({ message: "Internal Error" });
  }
};
