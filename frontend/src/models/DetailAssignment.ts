import { Assignment, defaultAssignment } from "./Assignment";
import { defaultItem, Item } from "./Product";

enum AssignmentStatus {
  PENDING = "PENDING",
  FINISHED = "FINISHED"
}

interface DetailAssignment {
  id: number;
  assignment: Assignment;
  product: Item;
  quantity: number;
  returned_amount: number;
  return_date: string;
  unit_price: number;
  status: AssignmentStatus;
  date_assignment: string;
}

const defaultDetailAssignment: DetailAssignment = {
  id: 0,
  assignment: defaultAssignment,
  product: defaultItem,
  quantity: 0,
  returned_amount: 0,
  return_date: "",
  unit_price: 0,
  status: AssignmentStatus.PENDING,
  date_assignment: ""
}

interface PostDetailAssignment {
  product_id: number;
  assignment_id: number;
  quantity: number;
  returned_amount?: number;
  unit_price?: string;
}

export type { DetailAssignment, PostDetailAssignment };
export { defaultDetailAssignment, AssignmentStatus };