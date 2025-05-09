export enum ProductType {
  NEWSPAPER = "NEWSPAPER",
  PRODUCT = "PRODUCT",
}

export interface Item {
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
  total_quantity: number;
}

export type Product = Omit<Item, 'monday_price' | 'tuesday_price' | 'wednesday_price' | 'thursday_price' | 'friday_price' | 'saturday_price' | 'sunday_price'>;

export type Newspaper = Omit<Item, 'product_price'>;

export const defaultProduct: Item = {
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
  total_quantity: 0,
};

export const defaultNewspaper: Newspaper = {
  id: 0,
  name: "",
  type: ProductType.NEWSPAPER,
  returns_date: 0,
  monday_price: 0,
  tuesday_price: 0,
  wednesday_price: 0,
  thursday_price: 0,
  friday_price: 0,
  saturday_price: 0,
  sunday_price: 0,
  status_product: true,
  total_quantity: 0,
};