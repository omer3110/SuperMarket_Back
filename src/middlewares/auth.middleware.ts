import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import Cart from "../models/cart.model";
import { getErrorData } from "../utils/errors/ErrorsFunctions";
import { AuthRequest } from "../types/auth.types";

// Extract JWT_SECRET from environment variables
const JWT_SECRET = process.env.JWT_SECRET as string;

// Middleware to verify the JWT token
export function verifyToken(req: Request, res: Response, next: NextFunction) {
  // Get the authorization header (it could be a string or an array of strings)
  const authHeader = req.headers["authorization"] as
    | string
    | string[]
    | undefined;

  // Ensure authHeader is a string before calling split
  const token =
    authHeader && typeof authHeader === "string"
      ? authHeader.split(" ")[1]
      : null;

  if (!token) {
    console.log("auth.middleware, verifyToken. No token provided");
    return res.status(401).json({ error: "Access denied" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload; // Verify token and cast to JwtPayload
    (req as AuthRequest).userId = decoded.userId; // Add userId to request object
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
  const { cartId } = req.params; // Extract cartId from the route parameters

  try {
    const cart = await Cart.findById(cartId); // Use cartId here
    if (!cart) {
      console.log(cartId);

      return res
        .status(404)
        .json({ message: `Cart with id ${cartId} not found` });
    }

    if (cart.userId.toString() !== (req as AuthRequest).userId) {
      return res
        .status(403)
        .json({ message: "You do not have permission to access this cart" });
    }

    next();
  } catch (err) {
    const { errorMessage, errorName } = getErrorData(err);
    res.status(500).json({ message: errorMessage });
  }
};

// // Extend the Request interface to include userId
// declare module "express-serve-static-core" {
//   interface Request {
//     userId?: string;
//   }
// }
