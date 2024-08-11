import { Types } from "mongoose";

export interface ActiveCartProductI {
  isActive: boolean;
  productId: string;
  productName: string;
  quantity: number;
}

export interface Room extends Document {
  roomId: string;
  admin: Types.ObjectId;
  collaborators: Types.Array<Types.ObjectId>;
  todoCart: ActiveCartProductI[];
}
