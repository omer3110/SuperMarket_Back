import { Response } from "express";
import { AuthRequest } from "../types/auth.types";
import RoomModel from "../models/rooms.model";
import { getErrorData } from "../utils/errors/ErrorsFunctions";
import UserModel from "../models/user.model";
import { io } from "../config/sockets";
import ProductModel from "../models/product.model";

export async function verifyCollaborator(userId: string, roomId: string) {
  const room = await RoomModel.findOne({ roomId, collaborators: userId });
  return room ? true : false;
}
export async function verifyAdmin(userId: string, roomId: string) {
  const room = await RoomModel.findOne({ roomId, admin: userId });
  return room ? true : false;
}

export async function createRoom(req: AuthRequest, res: Response) {
  const { roomId, todoCart } = req.body; // should be the socket id
  const activeCart = todoCart || [];
  if (!roomId) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const admin = req.userId;
    const collaborators: string[] = [];
    const room = new RoomModel({
      roomId,
      admin,
      collaborators,
      todoCart: activeCart,
    });
    await room.save();
    res.status(201).json(room);
  } catch (error) {
    const { errorMessage, errorName } = getErrorData(error);
    console.log("addCollaborator error: ", errorName, errorMessage);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function addCollaborator(req: AuthRequest, res: Response) {
  const { roomId } = req.params;
  const { collaboratorId } = req.body;
  if (!collaboratorId) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const room = await RoomModel.findOne({ roomId });
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    if (!verifyAdmin(req.userId as string, roomId)) {
      return res.status(403).json({ message: "You are not the admin" });
    }

    if (room.collaborators.includes(collaboratorId)) {
      return res.status(400).json({ message: "Collaborator already added" });
    }

    const collaborator = await UserModel.findById(collaboratorId);
    if (!collaborator)
      return res.status(404).json({ message: "Collaborator not found" });

    room.collaborators.push(collaboratorId);
    await room.save();

    res.status(200).json(room);
  } catch (error) {
    const { errorMessage, errorName } = getErrorData(error);
    console.log("addCollaborator error: ", errorName, errorMessage);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getUserRooms(req: AuthRequest, res: Response) {
  try {
    const room = await RoomModel.findOne({
      $or: [{ admin: req.userId }, { collaborators: req.userId }],
    });
    res.status(200).json(room);
  } catch (error) {
    const { errorMessage, errorName } = getErrorData(error);
    console.log("addCollaborator error: ", errorName, errorMessage);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function toggleProduct(req: AuthRequest, res: Response) {
  const { roomId, productId } = req.params;

  if (
    !verifyAdmin(req.userId as string, roomId) &&
    !verifyCollaborator(req.userId as string, roomId)
  ) {
    return res
      .status(403)
      .json({ message: "You are not the admin or collaborator" });
  }

  try {
    const room = await RoomModel.findOne({ roomId });
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    if (!verifyAdmin(req.userId as string, roomId)) {
      return res.status(403).json({ message: "You are not the admin" });
    }

    const productIndex = room.todoCart.findIndex(
      (product) => product.productId === productId
    );
    if (productIndex === -1) {
      return res.status(404).json({ message: "Product not found" });
    }

    room.todoCart[productIndex].isActive =
      !room.todoCart[productIndex].isActive;
    await room.save();

    res.status(200).json(room);
  } catch (error) {
    const { errorMessage, errorName } = getErrorData(error);
    console.log("addCollaborator error: ", errorName, errorMessage);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function updateQuantity(req: AuthRequest, res: Response) {
  const { roomId, productId } = req.params;
  const { quantity } = req.body;
  if (!quantity || isNaN(Number(quantity)) || quantity < 0) {
    return res.status(400).json({ message: "Quantity value not valid" });
  }

  if (
    !verifyAdmin(req.userId as string, roomId) &&
    !verifyCollaborator(req.userId as string, roomId)
  ) {
    return res
      .status(403)
      .json({ message: "You are not the admin or collaborator" });
  }

  try {
    const room = await RoomModel.findOne({ roomId });
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    if (!verifyAdmin(req.userId as string, roomId)) {
      return res.status(403).json({ message: "You are not the admin" });
    }

    const productIndex = room.todoCart.findIndex(
      (product) => product.productId === productId
    );
    if (productIndex === -1) {
      return res.status(404).json({ message: "Product not found" });
    }

    room.todoCart[productIndex].quantity = quantity;
    await room.save();

    res.status(200).json(room);
  } catch (error) {
    const { errorMessage, errorName } = getErrorData(error);
    console.log("addCollaborator error: ", errorName, errorMessage);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function deleteRoom(req: AuthRequest, res: Response) {
  const { roomId } = req.params;
  try {
    const room = await RoomModel.findOne({ roomId });
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    if (!verifyAdmin(req.userId as string, roomId)) {
      return res.status(403).json({ message: "You are not the admin" });
    }

    await RoomModel.deleteOne({ roomId });
    io.in(roomId).disconnectSockets();
    res.status(200).json({ message: "Room deleted" });
  } catch (error) {
    const { errorMessage, errorName } = getErrorData(error);
    console.log("deleteRoom error: ", errorName, errorMessage);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function addProduct(req: AuthRequest, res: Response) {
  const { userId } = req;
  const { roomId, productId } = req.params;
  try {
    const product = await ProductModel.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    const adjustedProduct = {
      isActive: true,
      quantity: 1,
      productName: product.name,
      productId: product._id,
    };
    const room = await RoomModel.findOneAndUpdate(
      { roomId },
      {
        $push: { todoCart: adjustedProduct },
      },
      { new: true }
    );
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }
    res.status(200).json(room);
  } catch (error) {
    const { errorMessage, errorName } = getErrorData(error);
    console.log("deleteRoom error: ", errorName, errorMessage);
    res.status(500).json({ message: "Internal server error" });
  }
}
