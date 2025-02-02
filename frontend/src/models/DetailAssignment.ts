import { Assignment, defaultAssignment } from "./Assignment";
import { defaultProduct, Product } from "./Product";

interface DetailAssignment {
  id: number;
  assignment: Assignment;
  product: Product;
  quantity: number;
  returned_amount: number;
  unit_price: number;
}

const defaultDetailAssignment: DetailAssignment = {
  id: 0,
  assignment: defaultAssignment,
  product: defaultProduct,
  quantity: 0,
  returned_amount: 0,
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