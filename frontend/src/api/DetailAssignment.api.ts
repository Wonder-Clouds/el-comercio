import api from "@/config/axios";
import { DetailAssignment, PostDetailAssignment } from "@/models/DetailAssignment";
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

export const postDetailAssignments = async (data: PostDetailAssignment) => { 
  const response = await api.post('/detail-assignments/', data);
  return response.data;
}