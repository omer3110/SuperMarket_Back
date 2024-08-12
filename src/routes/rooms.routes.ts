import { Router } from "express";
import {
  addCollaborator,
  createRoom,
  deleteRoom,
  getUserRooms,
  toggleProduct,
  updateQuantity,
} from "../controllers/rooms.controller";

const roomsRoutes = Router();

roomsRoutes.get("/", getUserRooms);
roomsRoutes.post("/", createRoom);
roomsRoutes.delete("/:roomId", deleteRoom);
roomsRoutes.post("/add-collaborator/:roomId", addCollaborator);
roomsRoutes.patch(":roomdId/quantity/:productId", updateQuantity);
roomsRoutes.patch("/:roomId/toggle/:productId", toggleProduct);
roomsRoutes.post("/:roomId/:productId", );

export default roomsRoutes;
