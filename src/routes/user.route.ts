import { Router, Request, Response } from "express";
import { register, login, getUserById } from "../controllers/user.controller";

const router: Router = Router();

router.post("/register", (req: Request, res: Response) => {
  register(req, res);
});

router.post("/login", (req: Request, res: Response) => {
  login(req, res);
});

router.get("/:id", (req: Request, res: Response) => {
  getUserById(req, res);
});

export default router;
