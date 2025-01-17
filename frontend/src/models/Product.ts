enum ProductType {
  NEWSPAPER = "PERIODICO",
  PRODUCT = "PRODUCTO"
}

interface Product {
  id_product: number;
  name: string;
  type: ProductType | null;
  returns_date: number;
}

const defaultProduct = {
  id_product: 0,
  name: "",
  type: null,
  returns_date: 0
}

export type { Product };
export { ProductType, defaultProduct };