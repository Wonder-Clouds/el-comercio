export enum Types {
  NEWSPAPER = "NEWSPAPER",
  PRODUCT = "PRODUCT",
}

export interface TypeProduct {
  id: number;
  name: string;
  type: Types | null;
}

export const defaultTypeProduct: TypeProduct = {
  id: 0,
  name: "",
  type: null,
};
