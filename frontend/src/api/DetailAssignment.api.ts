import api from "@/config/axios";
import { DetailAssignment } from "@/models/DetailAssignment";
import PaginatedResponse from "@/models/PaginatedResponse";

export const getDetailAssignments = async (page: number, pageSize: number): Promise<PaginatedResponse<DetailAssignment>> => {
  const response = await api.get('/detail-assignments', {
    params: {
      page,
      page_size: pageSize
    }
  });
  return response.data;
}