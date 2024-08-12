import express, { Application } from "express";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import { getErrorData } from "../utils/errors/ErrorsFunctions";
import RoomModel from "../models/rooms.model";

const app: Application = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

interface CustomSocket extends Socket {
  userId?: string;
}

export async function checkUserRoom(userId: string) {
  try {
    const room = await RoomModel.findOne({
      $or: [{ admin: userId }, { collaborators: userId }],
    });
    return room;
  } catch (error) {
    const { errorMessage, errorName } = getErrorData(error);
    if (errorName === "CastError") {
      return null;
    }
    console.log("checkUserRoom error: ", errorName, errorMessage);
  }
}

io.on("connection", (socket: CustomSocket) => {
  socket.on("login", async (userId: string) => {
    socket.userId = userId;
    console.log(`User ${userId} logged in `);
    const userRoom = await checkUserRoom(userId);
    if (userRoom) {
      socket.join(userRoom.roomId);
      io.to(userRoom.roomId).emit("New user joined", userRoom);
      console.log(`new User joined room ${userRoom.roomId}`);
    } else {
      console.log("User has no room");
    }
  });

  socket.on("create_room", async (userId: string) => {
    console.log(`Room created`);
    const userRoom = await checkUserRoom(userId);
    if (userRoom) {
      socket.join(userRoom.roomId);
      io.to(userRoom.roomId).emit("New user joined", userRoom);
      console.log(`User ${userId} joined room ${userRoom.roomId}`);
    } else {
      console.log("User has no room");
    }
  });

  socket.on("disconnect", () => {
    // console.log(`index: disconnected`, socket.id);
  });
});

export { app, io, server };
