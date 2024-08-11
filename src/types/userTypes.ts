import { Document, Types } from "mongoose";

export interface CartProductI {
  productId: string;
  productName: string;
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
  currentCart: Types.Array<CartProductI>;

  comparePassword(candidatePassword: string): Promise<boolean>;
}
