export interface Seller {
  id: number;
  number_seller: string;
  name: string;
  last_name: string;
  dni: string;
  phone?: string;
  status: boolean;
}

export const defaultSeller: Seller = {
  id: 0,
  number_seller: "",
  name: "",
  last_name: "",
  dni: "",
  phone: "",
  status: true,
}