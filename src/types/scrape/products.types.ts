export interface ProductPriceElementI {
  brandName: string;
  price: number | null | string;
}

export type ProductCategory =
  | "Milk and Eggs"
  | "Fruits and Vegetables"
  | "Sweets"
  | "Drinks"
  | "Meat and Fish"
  | "Frozens";

export interface ProductI {
  name: string;
  category: ProductCategory;
  prices: ProductPriceElementI[];
}
