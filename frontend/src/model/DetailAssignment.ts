import { Assignment } from "./Assignment";
import { Product } from "./Product";

interface DetailAssignment {
  id_detail_asignment: number;
  assigment: Assignment;
  product: Product;
  quantity: number;
  return_amount: number;
  unit_price: number;
}

export default DetailAssignment;