interface Seller {
  id_seller?: number;
  number_seller: string;
  name: string;
  last_name: string;
  dni: string;
  status: boolean;
}

const defaultSeller = {
  id_seller: 0,
  number_seller: "",
  name: "",
  last_name: "",
  dni: "",
  status: false,
}

export type { Seller }
export { defaultSeller } 