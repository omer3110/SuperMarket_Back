"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decrementProductQuantity = exports.incrementProductQuantity = exports.addProductToCurrentCart = void 0;
exports.validateProductPrices = validateProductPrices;
exports.removeProductFromCart = removeProductFromCart;
exports.clearCurrentCart = clearCurrentCart;
const user_model_1 = __importDefault(require("../models/user.model"));
const ErrorsFunctions_1 = require("../utils/errors/ErrorsFunctions");
const products_constants_1 = require("../constants/products.constants");
function validateProductPrices(productPrices) {
    if (!productPrices ||
        !Array.isArray(productPrices) ||
        productPrices.length === 0) {
        return false;
    }
    for (const product of productPrices) {
        if (!product.brandName || isNaN(Number(product.price))) {
            return false;
        }
        if (!products_constants_1.BRANDS_NAMES.includes(product.brandName)) {
            return false;
        }
    }
    return true;
}
const addProductToCurrentCart = async (req, res) => {
    const { productId, productName, quantity, productPrices } = req.body;
    if (!productId || !productName || !quantity || !productPrices) {
        return res.status(400).json({ message: "Missing required fields" });
    }
    if (!validateProductPrices(productPrices)) {
        return res.status(400).json({ message: "Invalid product prices" });
    }
    try {
        const user = await user_model_1.default.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const productIndex = user.currentCart.findIndex((item) => item.productId === productId);
        if (productIndex > -1) {
            return res.status(400).json({ message: "Product Already exist" });
        }
        else {
            const newProduct = {
                productId,
                productName,
                productPrices,
                quantity,
            };
            user.currentCart.push(newProduct);
        }
        await user.save();
        res.status(200).json(user.currentCart);
    }
    catch (error) {
        const { errorMessage, errorName } = (0, ErrorsFunctions_1.getErrorData)(error);
        console.log(errorName, errorMessage);
        res.status(500).json({ message: errorMessage });
    }
};
exports.addProductToCurrentCart = addProductToCurrentCart;
const incrementProductQuantity = async (req, res) => {
    const { productId } = req.params;
    try {
        const user = await user_model_1.default.findOneAndUpdate({ _id: req.userId, "currentCart.productId": productId }, { $inc: { "currentCart.$.quantity": 1 } }, { new: true });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user.currentCart);
    }
    catch (error) {
        const { errorMessage, errorName } = (0, ErrorsFunctions_1.getErrorData)(error);
        console.log(errorName, errorMessage);
        res.status(500).json({ message: errorMessage });
    }
};
exports.incrementProductQuantity = incrementProductQuantity;
const decrementProductQuantity = async (req, res) => {
    const { productId } = req.params;
    try {
        let user = await user_model_1.default.findOneAndUpdate({ _id: req.userId, "currentCart.productId": productId }, { $inc: { "currentCart.$.quantity": -1 } }, { new: true });
        if (!user) {
            return res
                .status(404)
                .json({ message: "User cart with that product ID not found" });
        }
        const product = user.currentCart.find((item) => {
            return item.productId === productId;
        });
        if (product && product.quantity < 1) {
            user = await user_model_1.default.findOneAndUpdate({ _id: req.userId }, { $pull: { currentCart: { productId } } }, { new: true });
            if (!user) {
                return res
                    .status(404)
                    .json({ message: "User not found after removing product" });
            }
        }
        res.status(200).json(user.currentCart);
    }
    catch (error) {
        const { errorMessage, errorName } = (0, ErrorsFunctions_1.getErrorData)(error);
        console.log(errorName, errorMessage);
        res.status(500).json({ message: errorMessage });
    }
};
exports.decrementProductQuantity = decrementProductQuantity;
async function removeProductFromCart(req, res) {
    const { productId } = req.params;
    try {
        const user = await user_model_1.default.findOneAndUpdate({ _id: req.userId }, { $pull: { currentCart: { productId } } }, { new: true });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user.currentCart);
    }
    catch (error) {
        const { errorMessage, errorName } = (0, ErrorsFunctions_1.getErrorData)(error);
        console.log(errorName, errorMessage);
        res.status(500).json({ message: errorMessage });
    }
}
async function clearCurrentCart(req, res) {
    try {
        console.log(1);
        const user = await user_model_1.default.findById(req.userId);
        console.log(user);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        user.currentCart = [];
        await user.save();
        res.status(200).json(user.currentCart);
    }
    catch (error) {
        const { errorMessage, errorName } = (0, ErrorsFunctions_1.getErrorData)(error);
        console.log(errorName, errorMessage);
        res.status(500).json({ message: errorMessage });
    }
}
// export const getCartComparison = async (req: AuthRequest, res: Response) => {
//   try {
//     // const products =
//   } catch (error) {
//     const { errorMessage, errorName } = getErrorData(error);
//     console.log(errorName, errorMessage);
//     res.status(500).json({ message: errorMessage });
//   }
// };
