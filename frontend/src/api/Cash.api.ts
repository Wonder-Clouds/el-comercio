import api from "@/config/axios";
import { Cash, TypesCash } from "@/models/Cash";

export const getCash = async (
  type: TypesCash,
  date_from: string,
  date_to: string
): Promise<Cash[]> => {
  const response = await api.get("/cash/", {
    params: {
      type_product: type,
      date_from,
      date_to,
    },
  });
  return response.data.results;
};

export const postCash = async (cash: Cash): Promise<Cash[]> => {
  const response = await api.post("/cash/", cash);
  return response.data;
};

export const patchCash = async (cash: Cash): Promise<Cash> => {
  const response = await api.patch(`/cash/${cash.id}/`, cash);
  return response.data;
};
