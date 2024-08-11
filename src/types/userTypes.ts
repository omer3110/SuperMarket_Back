import { Document, Types } from "mongoose";
import { CompanyProductI } from "./products.types";

export interface CartProductI {
  productId: string;
  productName: string;
  productPrices: CompanyProductI[];
  quantity: number;
}

export interface UserI extends Document {
  _id: Types.ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  address: string;
  password: string;
  currentCart: CartProductI[];

  comparePassword(candidatePassword: string): Promise<boolean>;
}
