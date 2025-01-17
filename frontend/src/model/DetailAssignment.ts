import { Assignment, defaultAssignment } from "./Assignment";
import { Product } from "./Product";

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
  product: {
    id_product: 0,
    name: "",
    type: null,
    returns_date: 0
  },
  quantity: 0,
  return_amount: 0,
  unit_price: 0
}

export type { DetailAssignment };
export { defaultDetailAssignment };