import api from "@/config/axios";
import { Devolution, DevolutionQuantity } from "@/models/Devolution";
import PaginatedResponse from "@/models/PaginatedResponse";

export const getDevolution = async (
  page: number,
  pageSize: number
): Promise<PaginatedResponse<Devolution>> => {
  const response = await api.get("/devolutions", {
    params: {
      page,
      page_size: pageSize,
    },
  });

  return response.data;
};

export const postDevolution = async (
  detailAssignmentId: number,
  data: DevolutionQuantity
) => {
  const response = await api.post(
    `/devolutions/${detailAssignmentId}/register-devolution/`,
    data
  );
  return response.data;
};

export const editDevolution = async (
  devolutionId: number,
  data: DevolutionQuantity
) => {
  const response = await api.patch(`/devolutions/${devolutionId}/`, data);
  return response.data;
};

export const deleteDevolution = async (devolutionId: number) => {
  const response = await api.delete(`/devolutions/${devolutionId}/`);
  return response.data;
};
