import Seller from "./Seller";

enum AssignmentStatus {
  PENDING = "PENDING",
  RETURNED = "RETURNED",
  PAID = "PAID"
}

interface Assignment {
  id_assignment: number;
  seller: Seller;
  date_assignment: Date;
  status: AssignmentStatus;
}

export type { Assignment };
export { AssignmentStatus };