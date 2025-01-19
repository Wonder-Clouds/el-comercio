import { defaultProduct, Product } from "./Product";

enum DayWeek {
  SUNDAY = "SUNDAY",
  MONDAY = "MONDAY",
  TUESDAY = "TUESDAY",
  WEDNESDAY = "WEDNESDAY",
  THURSDAY = "THURSDAY",
  FRIDAY = "FRIDAY",
  SATURDAY = "SATURDAY"
}

interface ProductPrice {
  id_price_product: number;
  product: Product;
  price: number;
  day_week: DayWeek;
  start_date: Date;
}

const defaultProductPrice: ProductPrice = {
  id_price_product: 0,
  product: defaultProduct,
  price: 0,
  day_week: DayWeek.SUNDAY,
  start_date: new Date()
}

export type { ProductPrice };
export { DayWeek, defaultProductPrice };