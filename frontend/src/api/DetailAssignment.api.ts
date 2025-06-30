import api from "@/config/axios";
import {
  DetailAssignment,
  PostDetailAssignment,
} from "@/models/DetailAssignment";
import PaginatedResponse from "@/models/PaginatedResponse";

export const getDetailAssignments = async (
  page: number,
  pageSize: number
): Promise<PaginatedResponse<DetailAssignment>> => {
  const response = await api.get("/detail-assignments", {
    params: {
      page,
      page_size: pageSize,
    },
  });
  return response.data;
};

export const postDetailAssignments = async (data: PostDetailAssignment) => {
  const response = await api.post("/detail-assignments/", data);
  return response.data;
};

export const refreshReturnedAmount = async (detailAssignmentId: number) => {
  const response = await api.patch(
    `/detail-assignments/${detailAssignmentId}/`,
    {
      returned_amount: 0,
    }
  );
  return response.data;
};
