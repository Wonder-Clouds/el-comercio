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

export const createProduct = async (product: Product): Promise<Product> => {
  const response = await api.post('/products', product);
  return response.data;
}

export const updateProduct = async (product: Product): Promise<Product> => {
  const response = await api.put(`/products/${product.id}`, product);
  return response.data;
}

export const deleteProduct = async (productId: number): Promise<void> => {
  await api.delete(`/products/${productId}`);
}