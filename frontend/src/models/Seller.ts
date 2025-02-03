export interface Seller {
  id?: number;
  number_seller: string;
  name: string;
  last_name: string;
  dni: string;
  status: boolean;
}

export const defaultSeller: Seller = {
  number_seller: "",
  name: "",
  last_name: "",
  dni: "",
  status: true,
}