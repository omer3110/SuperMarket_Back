import express, { Application } from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const app: Application = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log(`index: connected`, socket.id);
  
  socket.on("disconnect", () => {
    console.log(`index: disconnected`, socket.id);
  });
});

export { app, io, server };
