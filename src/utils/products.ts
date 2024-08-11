export function defineQueryCategory(category: string) {
  switch (category) {
    // case "Milk and Eggs":
    //   return "MILK_AND_EGGS_CATEGORY";
    case "Fruits and Vegetables":
      return "FRUITS_AND_VEGETABLES_CATEGORY";
    case "Sweets":
      return "SWEETS_CATEGORY";
    case "Drinks":
      return "DRINKS_CATEGORY";
    case "Meat and Fish":
      return "MEAST_AND_FISH_CATEGORY";
    case "Frozens":
      return "FROZENS_CATEGORY";
    default:
      return "MILK_AND_EGGS_CATEGORY";
  }
}
