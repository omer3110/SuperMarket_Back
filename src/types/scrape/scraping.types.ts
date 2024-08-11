export interface SuperMarketCategoriesI {
  MILK_AND_EGGS_CATEGORY: string[];
  FRUITS_AND_VEGETABLES_CATEGORY: string[];
  SWEETS_CATEGORY: string[];
  DRINKS_CATEGORY: string[];
  MEAST_AND_FISH_CATEGORY: string[];
  FROZENS_CATEGORY: string[];
}

export type ScrapedProductCategoriesOptions =
  | "MILK_AND_EGGS_CATEGORY"
  | "FRUITS_AND_VEGETABLES_CATEGORY"
  | "SWEETS_CATEGORY"
  | "DRINKS_CATEGORY"
  | "MEAST_AND_FISH_CATEGORY"
  | "FROZENS_CATEGORY";

export interface CategoryProductI {
  name: string;
  price: number | string | null;
}

export interface SuperMarketPricesI {
  MILK_AND_EGGS_CATEGORY: CategoryProductI[];
  FRUITS_AND_VEGETABLES_CATEGORY: CategoryProductI[];
  SWEETS_CATEGORY: CategoryProductI[];
  DRINKS_CATEGORY: CategoryProductI[];
  MEAST_AND_FISH_CATEGORY: CategoryProductI[];
  FROZENS_CATEGORY: CategoryProductI[];
}

export interface SuperMarketImgsI {
  MILK_AND_EGGS_CATEGORY: string[];
  FRUITS_AND_VEGETABLES_CATEGORY: string[];
  SWEETS_CATEGORY: string[];
  DRINKS_CATEGORY: string[];
  MEAST_AND_FISH_CATEGORY: string[];
  FROZENS_CATEGORY: string[];
}
