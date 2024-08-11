import { Router } from "express";
import {
  register,
  login,
  getLoggedInUser,
} from "../controllers/auth.controller";
import { verifyToken } from "../middlewares/auth.middleware";

const router = Router();

// Route to handle user registration
router.post("/register", register);

// Route to handle user login
router.post("/login", login);

router.get("/loggedInUser", verifyToken, getLoggedInUser);

export default router;
