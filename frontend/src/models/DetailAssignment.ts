import { Assignment, defaultAssignment } from "./Assignment";
import { defaultProduct, Product } from "./Product";

interface DetailAssignment {
  id_detail_asignment: number;
  assignment: Assignment;
  product: Product;
  quantity: number;
  return_amount: number;
  unit_price: number;
}

const defaultDetailAssignment: DetailAssignment = {
  id_detail_asignment: 0,
  assignment: defaultAssignment,
  product: defaultProduct,
  quantity: 0,
  return_amount: 0,
  unit_price: 0
}

interface PostDetailAssignment {
  product_id: number;
  assignment_id: number;
  quantity: number;
  returned_amount?: number;
  unit_price?: string;
}

export type { DetailAssignment, PostDetailAssignment };
export { defaultDetailAssignment };