export interface ProductType {
  id: number;
  categoryId: number;
  price: number;
  size: number;
  shape: string;
  shapeUzb: string;
  status: string;
  count: number;
  discountPrice: number | null;
  image: string;
}

export interface OrderType {
  id: number;
  userName: string;
  userPhone: string;
  userAddress: string;
  status: boolean;
  productId: number;
  product: ProductType;
  createdAt: string;
  updatedAt: string;
}
