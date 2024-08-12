"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeCartOwner = void 0;
exports.verifyToken = verifyToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const cart_model_1 = __importDefault(require("../models/cart.model"));
const ErrorsFunctions_1 = require("../utils/errors/ErrorsFunctions");
const JWT_SECRET = process.env.JWT_SECRET;
function verifyToken(req, res, next) {
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
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        req.userId = decoded.userId;
        next();
    }
    catch (error) {
        console.log("auth.middleware, verifyToken. Error while verifying token", error);
        res.status(401).json({ error: "Invalid token" });
    }
}
// Middleware to authorize cart owner
const authorizeCartOwner = async (req, res, next) => {
    const { cartId } = req.params; // Extract cartId from the route parameters
    try {
        const cart = await cart_model_1.default.findById(cartId); // Use cartId here
        if (!cart) {
            console.log(cartId);
            return res
                .status(404)
                .json({ message: `Cart with id ${cartId} not found` });
        }
        if (cart.userId.toString() !== req.userId) {
            return res
                .status(403)
                .json({ message: "You do not have permission to access this cart" });
        }
        next();
    }
    catch (err) {
        const { errorMessage, errorName } = (0, ErrorsFunctions_1.getErrorData)(err);
        res.status(500).json({ message: errorMessage });
    }
};
exports.authorizeCartOwner = authorizeCartOwner;
// // Extend the Request interface to include userId
// declare module "express-serve-static-core" {
//   interface Request {
//     userId?: string;
//   }
// }
