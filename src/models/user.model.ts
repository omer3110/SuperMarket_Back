import { Schema, model, Document, Types } from "mongoose";
import bcrypt from "bcrypt";
import { UserI } from "../types/userTypes";
import { CompanyProductSchema } from "./product.model";

const userSchema = new Schema<UserI>({
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
          type: [CompanyProductSchema],
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
const UserModel = model<UserI>("User", userSchema);
export default UserModel;
