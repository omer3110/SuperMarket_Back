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

export async function getProductById(req: Request, res: Response) {
  const { id } = req.params;
  try {
    const product = await ProductModel.findById(id);

    if (!product) {
      return res.status(404).json("Product not found");
    }

    res.status(200).json(product);
  } catch (error) {
    const { errorMessage, errorName } = getErrorData(error);
    console.log(errorName, errorMessage);
    res.status(500).json("Server error getting all reviews");
  }
}

export async function getProductByName(req: Request, res: Response) {
  const { productName } = req.body;
  if (!productName) {
    res.status(200).json([]);
  }

  try {
    const products = await ProductModel.find(
      {
        name: { $regex: productName as string, $options: "i" },
      },
      {},
      { limit: 8 }
    );
    if (!products) {
      return res.status(404).json("Product not found");
    }
    res.status(200).json(products);
  } catch (error) {
    const { errorMessage, errorName } = getErrorData(error);
    console.log(errorName, errorMessage);
    res.status(500).json("Server error getting all reviews");
  }
}
