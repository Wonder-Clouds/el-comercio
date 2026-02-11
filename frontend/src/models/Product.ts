import { TypeProduct } from "./TypeProduct";

export interface Item {
  id: number;
  name: string;
  returns_date: number;
  base_price: number;
  discount_percent: number;
  product_price: number;
  status_product: boolean;
  total_quantity: number;
  available_stock?: number;
  reserved_quantity?: number;
  type_product: TypeProduct | null;
}

export interface ItemCreateData {
  id: number;
  name: string;
  returns_date: number;
  base_price: number;
  discount_percent: number;
  status_product: boolean;
  total_quantity: number;
  type_product: number | null;
}

export const defaultItem: Item = {
  id: 0,
  name: "",
  returns_date: 0,
  base_price: 0,
  discount_percent: 0,
  product_price: 0,
  status_product: false,
  total_quantity: 0,
  type_product: null,
};
