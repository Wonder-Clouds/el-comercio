import axios from "axios";
import Seller from "@/model/Seller.ts";
import PaginatedResponse from "@/model/PaginatedResponse";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL + '/sellers',
});

export const getSellers = async (page: number, pageSize: number): Promise<PaginatedResponse<Seller>> => {

    if(page <= 0) {
        throw new Error("Invalid page number");
    }

    const response = await api.get('/', {
        params: {
            page,
            page_size: pageSize
        }
    });
    return response.data;


}
