import api from "@/config/axios";
import PaginatedResponse from "@/models/PaginatedResponse";
import { Item, ItemCreateData } from "@/models/Product";
import { Types } from "@/models/TypeProduct";

export const getProducts = async (
  page: number,
  pageSize: number,
  itemType: Types = Types.PRODUCT,
  productName?: string
): Promise<PaginatedResponse<Item>> => {
  const response = await api.get("/products/", {
    params: {
      page,
      page_size: pageSize,
      product_type: itemType,
      ...(productName && { product_name: productName }),
    },
  });
  return response.data;
};

export const getNewspapers = async (
  page: number,
  pageSize: number,
  itemType: Types = Types.NEWSPAPER,
  productName?: string
): Promise<PaginatedResponse<Item>> => {
  const response = await api.get("/products/", {
    params: {
      page,
      page_size: pageSize,
      product_type: itemType,
      ...(productName && { product_name: productName }),
    },
  });
  return response.data;
};

export const getProductsByDate = async (date: string, product_type: Types) => {
  const response = await api.get(`/products/by-date/`, {
    params: { date, product_type },
  });
  return response.data;
};

export const createItem = async (item: ItemCreateData): Promise<Item> => {
  const response = await api.post("/products/", item);
  return response.data;
};

export const updateItem = async (product: Item): Promise<Item> => {
  const response = await api.patch(`/products/${product.id}/`, product);
  return response.data;
};

export const deleteProduct = async (productId: number): Promise<void> => {
  await api.delete(`/products/${productId}/`);
};
