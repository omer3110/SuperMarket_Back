"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLoggedInUser = exports.login = exports.register = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const ErrorsFunctions_1 = require("../utils/errors/ErrorsFunctions");
const dotenv_1 = require("dotenv");
// Extract JWT_SECRET from environment variables
(0, dotenv_1.config)();
const JWT_SECRET = process.env.JWT_SECRET;
const SALT_ROUNDS = 10;
// Controller to handle user registration
const register = async (req, res) => {
    const { firstName, lastName, email, username, address, password } = req.body;
    try {
        const hashedPassword = await bcrypt_1.default.hash(password, SALT_ROUNDS);
        const newUser = new user_model_1.default({
            email,
            password: hashedPassword,
            username,
            firstName,
            lastName,
            address,
        });
        await newUser.save();
        const token = jsonwebtoken_1.default.sign({ userId: newUser._id }, JWT_SECRET, {
            expiresIn: "4h",
        });
        res.status(201).json({ token, user: newUser });
    }
    catch (error) {
        const { errorMessage, errorName } = (0, ErrorsFunctions_1.getErrorData)(error);
        console.log("register", errorName, errorMessage);
        if (error.code === 11000) {
            const duplicateField = Object.keys(error.keyPattern)[0];
            const message = `The ${duplicateField} is already taken.`;
            console.log(message);
            return res.status(400).json({ message });
        }
        res.status(500).json({ message: "Registration failed" });
    }
};
exports.register = register;
// Controller to handle user login
const login = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await user_model_1.default.findOne({ username });
        if (!user) {
            return res.status(401).json({ message: "Authentication failed" });
        }
        const isPasswordMatch = await bcrypt_1.default.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(401).json({ message: "Authentication failed" });
        }
        const token = jsonwebtoken_1.default.sign({ userId: user._id }, JWT_SECRET, {
            expiresIn: "5h",
        });
        res.status(200).json({ token });
    }
    catch (error) {
        const { errorMessage, errorName } = (0, ErrorsFunctions_1.getErrorData)(error);
        console.log("login", errorName, errorMessage);
        res.status(500).json({ message: "Login failed" });
    }
};
exports.login = login;
// Controller to get the logged-in user's data
const getLoggedInUser = async (req, res) => {
    try {
        const user = await user_model_1.default.findById(req.userId).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({
            _id: user._id,
            username: user.username,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            address: user.address,
            currentCart: user.currentCart,
        });
    }
    catch (err) {
        const { errorMessage, errorName } = (0, ErrorsFunctions_1.getErrorData)(err);
        console.log("Login error: ", errorName + "\n" + errorMessage);
        res.status(500).json({ message: "Internal Error" });
    }
};
exports.getLoggedInUser = getLoggedInUser;
