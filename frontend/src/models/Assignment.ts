import { DetailAssignment } from "./DetailAssignment";
import { Item } from "./Product";
import { defaultSeller, Seller } from "./Seller";
interface Assignment {
  id: number;
  seller: Seller;
  date_assignment: Date;
  detail_assignments?: DetailAssignment[];
  products?: Item[];
}

interface PostAssignment {
  id: number;
  seller: Seller;
  date_assignment: Date;
  detail_assignments?: DetailAssignment[];
  products?: number[];
}

const defaultAssignment: Assignment = {
  id: 0,
  seller: defaultSeller,
  date_assignment: new Date(),
  detail_assignments: [],
  products: [],
};

export type { Assignment, PostAssignment };
export { defaultAssignment };
