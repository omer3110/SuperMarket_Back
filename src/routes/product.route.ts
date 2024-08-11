import { Router } from "express";
import router from "./user.route";
import { getProducts } from "../controllers/product.controller";
// import { register, login, getUserById } from "../controllers/user.controller";

const productsRouter = Router();

// router.get("/", getProducts);

// router.post("/register", register);
// router.post("/login", login);
// router.get("/:id", getUserById);

export default productsRouter;
