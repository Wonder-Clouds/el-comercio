import api from "@/config/axios";
import PaginatedResponse from "@/models/PaginatedResponse";
import { Product } from "@/models/Product";

export const getProducts = async (page: number, pageSize: number): Promise<PaginatedResponse<Product>> => {
  const response = await api.get('/products', {
    params: {
      page,
      page_size: pageSize
    }
  });
  return response.data;
}