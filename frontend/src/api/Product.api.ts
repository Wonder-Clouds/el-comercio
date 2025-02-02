import api from "@/config/axios";
import PaginatedResponse from "@/models/PaginatedResponse";
import { Product } from "@/models/Product";

export const getProducts = async (
  page: number,
  pageSize: number,
  productType?: string,
  productName?: string
): Promise<PaginatedResponse<Product>> => {
  const response = await api.get('/products', {
    params: {
      page,
      page_size: pageSize,
      ...(productType && { product_type: productType }),
      ...(productName && { product_name: productName })
    }
  });
  return response.data;
};