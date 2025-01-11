import { Product } from "./Product";

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
  end_date: Date;
}

export type { ProductPrice };
export { DayWeek };