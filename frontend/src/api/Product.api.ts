import api from "@/config/axios";
import PaginatedResponse from "@/models/PaginatedResponse";
import { Item, ItemType } from "@/models/Product";

export const getProducts = async (
  page: number,
  pageSize: number,
  itemType: ItemType = ItemType.PRODUCT,
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
  itemType: ItemType = ItemType.NEWSPAPER,
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

export const getProductsByDate = async (date: string, type: ItemType) => {
  const response = await api.get(`/products/by-date/`, {
    params: { date, type },
  });
  return response.data;
};

export const createItem = async (item: Item): Promise<Item> => {
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
