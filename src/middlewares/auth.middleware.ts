import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import Cart from "../models/cart.model";
import { getErrorData } from "../utils/errors/ErrorsFunctions";
import { AuthRequest } from "../types/auth.types";

const JWT_SECRET = process.env.JWT_SECRET as string;

export function verifyToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.header("Authorization") || req.header("authorization");
  const token = authHeader?.replace("Bearer ", "");
  if (!token) {
    console.log(`auth.middleware: no token provided`);
    return res.status(401).json("Access denied");
  }

  // const authHeader = req.headers["authorization"] as
  //   | string
  //   | string[]
  //   | undefined;

  // const token =
  //   authHeader && typeof authHeader === "string"
  //     ? authHeader.split(" ")[1]
  //     : null;

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    (req as AuthRequest).userId = decoded.userId;
    next();
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
