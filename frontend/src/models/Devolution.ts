import { DetailAssignment } from "./DetailAssignment";

interface Devolution {
  id_devolution: number;
  detail_assignment: DetailAssignment;
  devolution_date: Date;
  quantity: number;
}

type DevolutionQuantity = Pick<Devolution, "quantity">;

export type { Devolution, DevolutionQuantity };