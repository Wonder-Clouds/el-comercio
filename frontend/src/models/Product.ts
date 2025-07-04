export enum ItemType {
  NEWSPAPER = "NEWSPAPER",
  PRODUCT = "PRODUCT",
}

export interface Item {
  id: number;
  name: string;
  type: ItemType | null;
  returns_date: number;
  product_price: number;
  status_product: boolean;
  total_quantity: number;
}

export const defaultItem: Item = {
  id: 0,
  name: "",
  type: null,
  returns_date: 0,
  product_price: 0,
  status_product: false,
  total_quantity: 0,
};
