import { defaultSeller, Seller } from "./Seller";

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

const defaultAssignment: Assignment = {
  id_assignment: 0,
  seller: defaultSeller,
  date_assignment: new Date(),
  status: AssignmentStatus.PENDING
}

export type { Assignment };
export { AssignmentStatus, defaultAssignment };