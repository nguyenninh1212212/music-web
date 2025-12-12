import api from "./axios";

export const getHome = async () => {
  const res = await api.get("/");
  return res.data;
};
