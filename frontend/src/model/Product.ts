
enum ProductType {
  NEWSPAPER = "NEWSPAPER",
  PRODUCT = "PRODUCT"
}

interface Product {
  id_product: number;
  name: string;
  type: ProductType;
  returns_date: number;
}

export type { Product };
export { ProductType };