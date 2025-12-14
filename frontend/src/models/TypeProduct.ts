export enum Types {
  NEWSPAPER = "NEWSPAPER",
  PRODUCT = "PRODUCT",
}

export interface TypeProduct {
  id: number;
  name: string;
  type: Types | null;
  monday_price?: number;
  tuesday_price?: number;
  wednesday_price?: number;
  thursday_price?: number;
  friday_price?: number;
  saturday_price?: number;
  sunday_price?: number;
}

export const defaultTypeProduct: TypeProduct = {
  id: 0,
  name: "",
  type: null,
  monday_price: undefined,
  tuesday_price: undefined,
  wednesday_price: undefined,
  thursday_price: undefined,
  friday_price: undefined,
  saturday_price: undefined,
  sunday_price: undefined,
};
