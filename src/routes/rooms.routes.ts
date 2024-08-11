import { Router } from "express";
import {
  addCollaborator,
  createRoom,
  deleteRoom,
  getUserRooms,
  toggleProduct,
  updateQuantity,
} from "../controllers/rooms.controller";

const roomsRouter = Router();

roomsRouter.get("/", getUserRooms);
roomsRouter.post("/", createRoom);
roomsRouter.delete("/:roomId", deleteRoom);
roomsRouter.post("/add-collaborator/:roomId", addCollaborator);
roomsRouter.patch(":roomdId/quantity/:productId", updateQuantity);
roomsRouter.patch("/:roomId/toggle/:productId", toggleProduct);

export default roomsRouter;
