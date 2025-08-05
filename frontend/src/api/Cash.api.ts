import api from "@/config/axios";
import { Cash, TypesCash } from "@/models/Cash";

export const getCash = async (type: TypesCash): Promise<Cash[]> => {
  const response = await api.get("/cash/", {
    params: {
      type_product: type,
    },
  });
  return response.data.results;
};

export const postCash = async (cash: Cash): Promise<Cash[]> => {
  const response = await api.post("/cash/", cash);
  return response.data;
};
