import api from "@/config/axios";
import { TypeProduct } from "@/models/TypeProduct";

export const getTypeProducts = async (): Promise<TypeProduct[]> => {
  const response = await api.get("/type-products/");
  return response.data.results;
};

export const getTypeProductById = async (id: number): Promise<TypeProduct> => {
  const response = await api.get(`/type-products/${id}/`);
  return response.data.results;
};
