import api from "@/config/axios";
import {
  MonthlyEarningsResponse,
  SalesBySellersResponse,
} from "@/models/Report";

export const getSalesBySeller = async (
  startDate: string,
  endDate: string
): Promise<SalesBySellersResponse> => {
  const response = await api.get("/reports/sales-by-seller/", {
    params: {
      start_date: startDate,
      end_date: endDate,
    },
  });

  return response.data;
};

export const getMonthlyEarnings = async (
  startDate: string,
  endDate: string
): Promise<MonthlyEarningsResponse> => {
  const response = await api.get("/reports/monthly-earnings/", {
    params: {
      start_date: startDate,
      end_date: endDate,
    },
  });

  return response.data;
};

export const getTopProducts = async (startDate: string, endDate: string) => {
  const response = await api.get("/reports/top-products/", {
    params: {
      start_date: startDate,
      end_date: endDate,
    },
  });

  return response.data;
};

export const getTopNewsPapers = async (startDate: string, endDate: string) => {
  const response = await api.get("/reports/top-newspapers/", {
    params: {
      start_date: startDate,
      end_date: endDate,
    },
  });

  return response.data;
};

export const getProfits = async (startDate: string, endDate: string) => {
  const response = await api.get("/reports/profits/", {
    params: {
      start_date: startDate,
      end_date: endDate,
    },
  });

  return response.data;
};

export const getReturnsAndEfficiency = async (
  startDate: string,
  endDate: string
) => {
  const response = await api.get("/reports/returns-and-efficiency/", {
    params: {
      start_date: startDate,
      end_date: endDate,
    },
  });

  return response.data;
};
