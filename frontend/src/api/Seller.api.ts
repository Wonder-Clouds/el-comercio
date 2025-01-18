import api from "@/config/axios";
import PaginatedResponse from "@/models/PaginatedResponse";
import { Seller } from "@/models/Seller";

export const getSellers = async (page: number, pageSize: number): Promise<PaginatedResponse<Seller>> => {
  
  const response = await api.get('/sellers', {
    params: {
      page,
      page_size: pageSize
    }
  });

  return response.data;
}
