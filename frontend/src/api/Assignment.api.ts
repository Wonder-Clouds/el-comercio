import api from "@/config/axios";
import { Assignment } from "@/models/Assignment";
import PaginatedResponse from "@/models/PaginatedResponse";

export const getAssignments = async (page: number, pageSize: number): Promise<PaginatedResponse<Assignment>> => {
  const response = await api.get('/assignments', {
    params: {
      page,
      page_size: pageSize
    }
  });
  return response.data;
}