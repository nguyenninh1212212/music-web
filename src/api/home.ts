import api from "./axios";

export const getHome = async () => {
  const res = await api.get("/");
  console.log("🚀 ~ getHome ~ res:", res);
  return res.data;
};
