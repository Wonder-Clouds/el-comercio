import api from "@/config/axios";

export const Token = async (username: string, password: string) => {
  const res = await api.post('/token/', {
    username,
    password
  });

  return res;
}