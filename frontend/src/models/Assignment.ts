import { DetailAssignment } from "./DetailAssignment";
import { defaultSeller, Seller } from "./Seller";
interface Assignment {
  id: number;
  seller: Seller;
  date_assignment: Date;
  detail_assignments?: DetailAssignment[];
}

const defaultAssignment: Assignment = {
  id: 0,
  seller: defaultSeller,
  date_assignment: new Date(),
  detail_assignments: []
}

export type { Assignment };
export { defaultAssignment };