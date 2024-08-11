import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import Cart from "../models/cart.model";

// Define the payload interface for JWT
interface JwtPayload {
  userId: string;
}

// Extract JWT_SECRET from environment variables
const JWT_SECRET = process.env.JWT_SECRET as string;

// Middleware to verify the JWT token
export function verifyToken(req: Request, res: Response, next: NextFunction) {
  const authHeader =
    req.headers["Authorization"] || req.headers["authorization"]; // Get the authorization header
  const token = authHeader && authHeader.split(" ")[1]; // Get the token from the header

  if (!token) {
    console.log("auth.middleware, verifyToken. No token provided");
    return res.status(401).json({ error: "Access denied" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload; // Verify token and cast to JwtPayload
    req.userId = decoded.userId; // Add userId to request object
    next(); // Call next middleware
  } catch (error) {
    console.log(
      "auth.middleware, verifyToken. Error while verifying token",
      error
    );
    res.status(401).json({ error: "Invalid token" });
  }
}

// Middleware to authorize cart owner
export const authorizeCartOwner = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params; // Assuming the cart ID is passed as a route parameter

  try {
    const cart = await Cart.findById(id);
    if (!cart) {
      return res.status(404).json({ message: `Cart with id ${id} not found` });
    }

    if (cart.userId.toString() !== req.userId) {
      return res
        .status(403)
        .json({ message: "You do not have permission to access this cart" });
    }

    next();
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// Extend the Request interface to include userId
declare module "express-serve-static-core" {
  interface Request {
    userId?: string;
  }
}
