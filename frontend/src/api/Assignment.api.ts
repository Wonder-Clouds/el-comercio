import api from "@/config/axios";
import { Assignment } from "@/models/Assignment";
import PaginatedResponse from "@/models/PaginatedResponse";

export const getAssignments = async (page: number, pageSize: number, startDate: string): Promise<PaginatedResponse<Assignment>> => {
  const response = await api.get('/assignments', {
    params: {
      page,
      page_size: pageSize,
      ...(startDate && { start_date: startDate }),
    }
  });
  return response.data;
}