import { DetailAssignment } from "./DetailAssignment";
import { defaultSeller, Seller } from "./Seller";

enum AssignmentStatus {
  PENDING = "PENDING",
  RETURNED = "RETURNED",
  PAID = "PAID"
}

interface Assignment {
  id: number;
  seller: Seller;
  date_assignment: Date;
  status: AssignmentStatus;
  detail_assignments?: DetailAssignment[];
}

const defaultAssignment: Assignment = {
  id: 0,
  seller: defaultSeller,
  date_assignment: new Date(),
  status: AssignmentStatus.PENDING,
  detail_assignments: []
}

export type { Assignment };
export { AssignmentStatus, defaultAssignment };