import api from "@/config/axios";
import Devolution from "@/models/Devolution";
import PaginatedResponse from "@/models/PaginatedResponse";

export const getDevolution = async (page: number, pageSize: number): Promise<PaginatedResponse<Devolution>> => {
  
  const response = await api.get('/devolutions', {
    params: {
      page,
      page_size: pageSize
    }
  });

  return response.data;
}
