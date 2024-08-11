export type BrandsOptions = "Shufersal" | "Yohananof" | "Rami Levy";
export type ProductsCategoriesOptions =
  | "Milk and Eggs"
  | "Fruits and Vegetables"
  | "Sweets"
  | "Drinks"
  | "Meat and Fish"
  | "Frozens";

export interface CompanyProductI {
  brandName: BrandsOptions;
  price: number;
}
export interface ProductI {
  name: string;
  category: ProductsCategoriesOptions;
  img: string;
  prices: CompanyProductI[];
}


