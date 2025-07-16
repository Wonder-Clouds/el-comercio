import api from "@/config/axios";
import { Yape } from "@/models/Yape";

export const getYapes = async (): Promise<Yape[]> => {
  const response = await api.get("/yape/");
  return response.data.results;
};

export const postYapes = async (yape: Yape): Promise<Yape[]> => {
  const response = await api.post("/yape/", yape);
  return response.data;
};
