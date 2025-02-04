import api from "@/config/axios";
import PaginatedResponse from "@/models/PaginatedResponse";
import { Seller } from "@/models/Seller";

interface SellersFilters {
  search?: string;
  name?: string;
  last_name?: string;
  dni?: string;
  number_seller?: string;
}

export const getSellers = async (
  page: number,
  pageSize: number,
  filters?: SellersFilters
): Promise<PaginatedResponse<Seller>> => {
  if (page <= 0) {
    throw new Error("Invalid page number");
  }
  
  const response = await api.get('/sellers', {
    params: {
      page,
      page_size: pageSize,
      ...filters
    }
  });
  return response.data;
};

export const createSeller = async (seller: Seller): Promise<Seller> => {
  try {
    const response = await api.post('/sellers/', seller);
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw error;
  }
}

export const getSellerById = async (id: number): Promise<Seller> => {
  const response = await api.get(`/sellers/${id}`);
  return response.data;
}

export const updateSeller = async (seller: Seller): Promise<Seller> => {
  const response = await api.patch(`/sellers/${seller.id}/`, seller);
  return response.data;
}

export const deleteSeller = async (id: number): Promise<void> => {
  await api.delete(`/sellers/${id}/`);
}
