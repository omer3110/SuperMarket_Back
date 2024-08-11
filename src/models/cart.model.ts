import { Schema, model, Document, Types } from "mongoose";

// Define the CartProduct interface
interface CartProduct {
  productId: string;
  quantity: number;
}

// Define the Cart interface extending Mongoose's Document
interface Cart extends Document {
  name: string;
  userId: Types.ObjectId;
  collaborators?: Types.Array<Types.ObjectId>;
  cartProducts: Types.Array<CartProduct>;
}

// Define the Cart Schema
const cartSchema = new Schema<Cart>({
  name: {
    type: String,
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  collaborators: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: [],
    },
  ],
  cartProducts: [
    {
      productId: {
        type: String,
        required: true,
      },
      productName: {
        type: String,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        default: 1,
      },
    },
  ],
});

const CartModel = model<Cart>("Cart", cartSchema);
export default CartModel;
