import { Router } from "express";
import { register, login } from "../controllers/auth.controller";

const router = Router();

// Route to handle user registration
router.post("/register", register);

// Route to handle user login
router.post("/login", login);

export default router;
