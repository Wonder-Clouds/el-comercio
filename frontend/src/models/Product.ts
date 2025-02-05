export enum ProductType {
  NEWSPAPER = "NEWSPAPER",
  PRODUCT = "PRODUCT",
}

export interface Product {
  id: number;
  name: string;
  type: ProductType | null;
  returns_date: number;
  monday_price: number;
  tuesday_price: number;
  wednesday_price: number;
  thursday_price: number;
  friday_price: number;
  saturday_price: number;
  sunday_price: number;
  product_price: number;
  status_product: boolean;
}

export const defaultProduct: Product = {
  id: 0,
  name: "",
  type: null,
  returns_date: 0,
  monday_price: 0,
  tuesday_price: 0,
  wednesday_price: 0,
  thursday_price: 0,
  friday_price: 0,
  saturday_price: 0,
  sunday_price: 0,
  product_price: 0,
  status_product: false,
};
