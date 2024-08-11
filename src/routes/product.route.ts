import { Router } from "express";
import {
  getProductById,
  getProductByName,
  getProducts,
} from "../controllers/product.controller";

const productsRouter = Router();

productsRouter.get("/", getProducts);
productsRouter.post("/", getProductByName);
productsRouter.get("/:id", getProductById);

export default productsRouter;
