import api from "@/config/axios";
import { Assignment } from "@/models/Assignment";
import PaginatedResponse from "@/models/PaginatedResponse";

export const getAssignments = async (
  page: number,
  pageSize: number,
  startDate: string,
  endDate?: string
): Promise<PaginatedResponse<Assignment>> => {
  const response = await api.get("/assignments", {
    params: {
      page,
      page_size: pageSize,
      ...(startDate && { start_date: startDate }),
      ...(endDate && { end_date: endDate }),
    },
  });
  return {
    count: response.data.count,
    next: response.data.next,
    previous: response.data.previous,
    results: response.data.results,
  };
};

export const postAllAssignments = async (items: number[]) => {
  const response = await api.post("/assignments/create-assignments/", {
    products: items,
  });
  return response.data;
};
