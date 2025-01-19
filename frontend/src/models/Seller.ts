interface Seller {
  id_seller?: number;
  name: string;
  last_name: string;
  dni: string;
  status: boolean;
  number_seller: string;
}

const defaultSeller = {
  id_seller: 0,
  name: "",
  last_name: "",
  dni: "",
  status: false,
  number_seller: "",
}

export type { Seller }
export { defaultSeller } 