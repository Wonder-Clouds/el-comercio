import api from "@/config/axios";

export const Token = async (username: string, password: string) => {
  const res = await api.post('/token/', {
    username,
    password
  });

  return res;
}

export const RefreshToken = async (refresh: string) => {
  const res = await api.post('/token/refresh/', {
    refresh
  });

  return res;
}