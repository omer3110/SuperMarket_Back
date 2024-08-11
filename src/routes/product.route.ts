import { Router } from "express";
import {
  getProductById,
  getProductByName,
  getProducts,
} from "../controllers/product.controller";
// import { register, login, getUserById } from "../controllers/user.controller";

const productsRouter = Router();

productsRouter.get("/", getProducts);
productsRouter.post("/", getProductByName);
productsRouter.get("/:id", getProductById);

// router.post("/register", register);
// router.post("/login", login);
// router.get("/:id", getUserById);

export default productsRouter;
