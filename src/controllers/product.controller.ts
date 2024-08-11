import { Request, Response } from "express";
import { getErrorData } from "../utils/errors/ErrorsFunctions";
import ProductModel from "../models/product.model";

export async function getProducts(req: Request, res: Response) {
  const { category } = req.query;
  const queryCategory = category || "Milk and Eggs";

  try {
    const products = await ProductModel.find({
      category: queryCategory,
    });
    res.status(200).json(products);
  } catch (error) {
    const { errorMessage, errorName } = getErrorData(error);
    console.log(errorName, errorMessage);
    res.status(500).json("Server error getting all reviews");
  }
}
