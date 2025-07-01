import api from "@/config/axios";
import { Finance } from "@/models/Finance";
import PaginatedResponse from "@/models/PaginatedResponse";

export const getFinances = async (
  page: number,
  pageSize: number,
  type_operation?: string | null,
  date_finance?: string | null
): Promise<PaginatedResponse<Finance>> => {
  const response = await api.get("/finance", {
    params: {
      page,
      page_size: pageSize,
      type_operation,
      date_finance,
    },
  });

  return response.data;
};

export const createFinance = async (finance: Finance): Promise<Finance> => {
  const response = await api.post("/finance/", finance);
  return response.data;
};
