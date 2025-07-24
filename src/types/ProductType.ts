import type { CategoryType } from "./CategoryType";

export interface ProductType {
  id: number;
  categoryId: number;
  price: number;
  size: number;
  shape: string;
  shapeUzb: string;
  status: "available" | "recommended" | "discount" | "none";
  count: number;
  discountPrice: number;
  image: string;
  Category: CategoryType;
  depth: string
}
