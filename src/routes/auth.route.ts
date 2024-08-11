import { Router } from "express";
import {
  register,
  login,
  getLoggedInUser,
} from "../controllers/auth.controller";
import { verifyToken } from "../middlewares/auth.middleware";

const router = Router();

router.get("/loggedInUser", verifyToken, getLoggedInUser);
router.post("/register", register);
router.post("/login", login);

export default router;
