import api from "@/config/axios";
import { Cash } from "@/models/Cash";

export const getCash = async (): Promise<Cash[]> => {
  const response = await api.get("/cash/");
  return response.data.results;
};

export const postCash = async (cash: Cash): Promise<Cash[]> => {
  const response = await api.post("/cash/", cash);
  return response.data;
};
