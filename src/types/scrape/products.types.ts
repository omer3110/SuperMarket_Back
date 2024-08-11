import { ProductsCategoriesOptions } from "../products.types";

export interface ProductPriceElementI {
  brandName: string;
  price: number | null | string;
}

export interface ProductToSeedI {
  name: string;
  img: string;
  category: ProductsCategoriesOptions;
  prices: ProductPriceElementI[];
}
