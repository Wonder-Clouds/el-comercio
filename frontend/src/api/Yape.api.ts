import api from "@/config/axios";
import { Yape } from "@/models/Yape";

export const getYapes = async (
  date_yape_from: string,
  date_yape_to: string
): Promise<Yape[]> => {
  const response = await api.get("/yape/", {
    params: {
      date_yape_from,
      date_yape_to,
    },
  });
  return response.data.results;
};

export const postYapes = async (yape: Yape): Promise<Yape[]> => {
  const response = await api.post("/yape/", yape);
  return response.data;
};
