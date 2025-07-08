export interface Yape {
  id: number;
  name: string;
  amount: number;
  date_yape: string;
  operation_code: string;
}

export const defaultYape: Yape = {
  id: 0,
  name: "",
  amount: 0,
  date_yape: "",
  operation_code: "",
};
