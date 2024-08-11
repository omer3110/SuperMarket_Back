import { Request, Response } from "express";
import { getErrorData } from "../utils/errors/ErrorsFunctions";
import ProductModel from "../models/product.model";

export async function getProducts(req: Request, res: Response) {
  console.log(1);

  //   const { userId } = req;
  try {
    const products = await ProductModel.find();
    res.status(200).json(products);
  } catch (error) {
    const { errorMessage, errorName } = getErrorData(error);
    console.log(errorName, errorMessage);
    res.status(500).json("Server error getting all reviews");
  }
}
