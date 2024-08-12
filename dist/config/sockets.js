"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.server = exports.io = exports.app = void 0;
exports.checkUserRoom = checkUserRoom;
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const ErrorsFunctions_1 = require("../utils/errors/ErrorsFunctions");
const rooms_model_1 = __importDefault(require("../models/rooms.model"));
const app = (0, express_1.default)();
exports.app = app;
const server = (0, http_1.createServer)(app);
exports.server = server;
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "*",
    },
});
exports.io = io;
async function checkUserRoom(userId) {
    try {
        const room = await rooms_model_1.default.findOne({
            $or: [{ admin: userId }, { collaborators: userId }],
        });
        return room;
    }
    catch (error) {
        const { errorMessage, errorName } = (0, ErrorsFunctions_1.getErrorData)(error);
        if (errorName === "CastError") {
            console.log("User has no room");
            return null;
        }
        console.log("checkUserRoom error: ", errorName, errorMessage);
    }
}
io.on("connection", (socket) => {
    console.log(`index: connected`, socket.id);
    socket.on("login", async (userId) => {
        socket.userId = userId;
        console.log(`User ${userId} logged in with socket ID ${socket.id}`);
        const userRoom = await checkUserRoom(userId);
        if (userRoom) {
            socket.join(userRoom.roomId);
            io.to(userRoom.roomId).emit("New user joined", userId);
        }
        else {
            console.log("User has no room");
        }
    });
    socket.on("disconnect", () => {
        console.log(`index: disconnected`, socket.id);
    });
});
