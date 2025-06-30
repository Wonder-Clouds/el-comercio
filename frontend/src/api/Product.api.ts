import api from "@/config/axios";
import PaginatedResponse from "@/models/PaginatedResponse";
import { Item, ProductType } from "@/models/Product";

export const getProducts = async (
  page: number,
  pageSize: number,
  productType: ProductType = ProductType.PRODUCT,
  productName?: string
): Promise<PaginatedResponse<Item>> => {
  const response = await api.get('/products/', {
    params: {
      page,
      page_size: pageSize,
      product_type: productType,
      ...(productName && { product_name: productName }),
    },
  });
  return response.data;
};

export const getNewspapers = async (
  page: number,
  pageSize: number,
  productType: ProductType = ProductType.NEWSPAPER,
  productName?: string
): Promise<PaginatedResponse<Item>> => {
  const response = await api.get('/products/', {
    params: {
      page,
      page_size: pageSize,
      product_type: productType,
      ...(productName && { product_name: productName }),
    },
  });
  return response.data;
};


export const getProductsByDate = async (date: string, type: ProductType) => {
  const response = await api.get(`/products/by-date/`, {
    params: { date, type },
  });
  return response.data;
};

export const createItem = async (item: Item): Promise<Item> => {
  const response = await api.post('/products/', item);
  return response.data;
};

export const updateItem = async (
  product: Item
): Promise<Item> => {
  const response = await api.patch(`/products/${product.id}/`, product);
  return response.data;
};


export const deleteProduct = async (productId: number): Promise<void> => {
  await api.delete(`/products/${productId}/`);
};
