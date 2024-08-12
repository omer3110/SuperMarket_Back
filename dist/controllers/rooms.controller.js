"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyCollaborator = verifyCollaborator;
exports.verifyAdmin = verifyAdmin;
exports.createRoom = createRoom;
exports.addCollaborator = addCollaborator;
exports.getUserRooms = getUserRooms;
exports.toggleProduct = toggleProduct;
exports.updateQuantity = updateQuantity;
exports.deleteRoom = deleteRoom;
const rooms_model_1 = __importDefault(require("../models/rooms.model"));
const ErrorsFunctions_1 = require("../utils/errors/ErrorsFunctions");
const user_model_1 = __importDefault(require("../models/user.model"));
const sockets_1 = require("../config/sockets");
async function verifyCollaborator(userId, roomId) {
    const room = await rooms_model_1.default.findOne({ roomId, collaborators: userId });
    return room ? true : false;
}
async function verifyAdmin(userId, roomId) {
    const room = await rooms_model_1.default.findOne({ roomId, admin: userId });
    return room ? true : false;
}
async function createRoom(req, res) {
    const { roomId, todoCart } = req.body; // should be the socket id
    const activeCart = todoCart || [];
    if (!roomId) {
        return res.status(400).json({ message: "Missing required fields" });
    }
    try {
        const admin = req.userId;
        const collaborators = [];
        const room = new rooms_model_1.default({
            roomId,
            admin,
            collaborators,
            todoCart: activeCart,
        });
        await room.save();
        res.status(201).json(room);
    }
    catch (error) {
        const { errorMessage, errorName } = (0, ErrorsFunctions_1.getErrorData)(error);
        console.log("addCollaborator error: ", errorName, errorMessage);
        res.status(500).json({ message: "Internal server error" });
    }
}
async function addCollaborator(req, res) {
    const { roomId } = req.params;
    const { collaboratorId } = req.body;
    if (!collaboratorId) {
        return res.status(400).json({ message: "Missing required fields" });
    }
    try {
        const room = await rooms_model_1.default.findOne({ roomId });
        if (!room) {
            return res.status(404).json({ message: "Room not found" });
        }
        if (!verifyAdmin(req.userId, roomId)) {
            return res.status(403).json({ message: "You are not the admin" });
        }
        if (room.collaborators.includes(collaboratorId)) {
            return res.status(400).json({ message: "Collaborator already added" });
        }
        const collaborator = await user_model_1.default.findById(collaboratorId);
        if (!collaborator)
            return res.status(404).json({ message: "Collaborator not found" });
        room.collaborators.push(collaboratorId);
        await room.save();
        res.status(200).json(room);
    }
    catch (error) {
        const { errorMessage, errorName } = (0, ErrorsFunctions_1.getErrorData)(error);
        console.log("addCollaborator error: ", errorName, errorMessage);
        res.status(500).json({ message: "Internal server error" });
    }
}
async function getUserRooms(req, res) {
    try {
        const rooms = await rooms_model_1.default.findOne({
            $or: [{ admin: req.userId }, { collaborators: req.userId }],
        });
        res.status(200).json(rooms);
    }
    catch (error) {
        const { errorMessage, errorName } = (0, ErrorsFunctions_1.getErrorData)(error);
        console.log("addCollaborator error: ", errorName, errorMessage);
        res.status(500).json({ message: "Internal server error" });
    }
}
async function toggleProduct(req, res) {
    const { roomId, productId } = req.params;
    if (!verifyAdmin(req.userId, roomId) &&
        !verifyCollaborator(req.userId, roomId)) {
        return res
            .status(403)
            .json({ message: "You are not the admin or collaborator" });
    }
    try {
        const room = await rooms_model_1.default.findOne({ roomId });
        if (!room) {
            return res.status(404).json({ message: "Room not found" });
        }
        if (!verifyAdmin(req.userId, roomId)) {
            return res.status(403).json({ message: "You are not the admin" });
        }
        const productIndex = room.todoCart.findIndex((product) => product.productId === productId);
        if (productIndex === -1) {
            return res.status(404).json({ message: "Product not found" });
        }
        room.todoCart[productIndex].isActive =
            !room.todoCart[productIndex].isActive;
        await room.save();
        res.status(200).json(room);
    }
    catch (error) {
        const { errorMessage, errorName } = (0, ErrorsFunctions_1.getErrorData)(error);
        console.log("addCollaborator error: ", errorName, errorMessage);
        res.status(500).json({ message: "Internal server error" });
    }
}
async function updateQuantity(req, res) {
    const { roomId, productId } = req.params;
    const { quantity } = req.body;
    if (!quantity || isNaN(Number(quantity)) || quantity < 0) {
        return res.status(400).json({ message: "Quantity value not valid" });
    }
    if (!verifyAdmin(req.userId, roomId) &&
        !verifyCollaborator(req.userId, roomId)) {
        return res
            .status(403)
            .json({ message: "You are not the admin or collaborator" });
    }
    try {
        const room = await rooms_model_1.default.findOne({ roomId });
        if (!room) {
            return res.status(404).json({ message: "Room not found" });
        }
        if (!verifyAdmin(req.userId, roomId)) {
            return res.status(403).json({ message: "You are not the admin" });
        }
        const productIndex = room.todoCart.findIndex((product) => product.productId === productId);
        if (productIndex === -1) {
            return res.status(404).json({ message: "Product not found" });
        }
        room.todoCart[productIndex].quantity = quantity;
        await room.save();
        res.status(200).json(room);
    }
    catch (error) {
        const { errorMessage, errorName } = (0, ErrorsFunctions_1.getErrorData)(error);
        console.log("addCollaborator error: ", errorName, errorMessage);
        res.status(500).json({ message: "Internal server error" });
    }
}
async function deleteRoom(req, res) {
    const { roomId } = req.params;
    try {
        const room = await rooms_model_1.default.findOne({ roomId });
        if (!room) {
            return res.status(404).json({ message: "Room not found" });
        }
        if (!verifyAdmin(req.userId, roomId)) {
            return res.status(403).json({ message: "You are not the admin" });
        }
        await rooms_model_1.default.deleteOne({ roomId });
        sockets_1.io.in(roomId).disconnectSockets();
        res.status(200).json({ message: "Room deleted" });
    }
    catch (error) {
        const { errorMessage, errorName } = (0, ErrorsFunctions_1.getErrorData)(error);
        console.log("deleteRoom error: ", errorName, errorMessage);
        res.status(500).json({ message: "Internal server error" });
    }
}
