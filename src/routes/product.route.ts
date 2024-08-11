import { Router } from "express";
import { getProducts } from "../controllers/product.controller";
// import { register, login, getUserById } from "../controllers/user.controller";

const productsRouter = Router();

productsRouter.get("/", getProducts);

// router.post("/register", register);
// router.post("/login", login);
// router.get("/:id", getUserById);

export default productsRouter;
