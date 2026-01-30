import { TypeProduct } from "./TypeProduct";

export interface Item {
  id: number;
  name: string;
  type_product: TypeProduct | null;
  returns_date: number;
  product_price: number;
  status_product: boolean;
  total_quantity: number;
  available_stock?: number;
}

export interface ItemCreateData {
  id: number;
  name: string;
  type_product: number | null;
  returns_date: number;
  product_price: number;
  status_product: boolean;
  total_quantity: number;
}

export const defaultItem: Item = {
  id: 0,
  name: "",
  type_product: null,
  returns_date: 0,
  product_price: 0,
  status_product: false,
  total_quantity: 0,
};
