import mongoose, { Schema, Document, Types } from "mongoose";
import { ActiveCartProductI, Room } from "../types/rooms.types";

export const activeCartProductSchema = new Schema<ActiveCartProductI>({
  isActive: {
    type: Boolean,
    default: true,
  },
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
  },
});

const roomSchema = new Schema<Room>({
  roomId: {
    type: String,
    required: true,
    unique: true,
  },
  admin: {
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
  todoCart: [{ type: activeCartProductSchema }, { default: [] }],
});

const RoomModel = mongoose.model<Room>("Room", roomSchema);
export default RoomModel;
