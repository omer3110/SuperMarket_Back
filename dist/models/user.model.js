"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const product_model_1 = require("./product.model");
const userSchema = new mongoose_1.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    address: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    currentCart: {
        type: [
            {
                productId: {
                    type: String,
                    required: true,
                },
                productName: {
                    type: String,
                    required: true,
                },
                productPrices: {
                    type: [product_model_1.CompanyProductSchema],
                    required: true,
                },
                quantity: {
                    type: Number,
                    required: true,
                    default: 1,
                },
            },
        ],
        default: [],
    },
});
// Export the User model
const UserModel = (0, mongoose_1.model)("User", userSchema);
exports.default = UserModel;
