import api from "./axios"; // Giả định 'api' là axios instance đã cấu hình

const adminApi = {
  getTotal: async () => {
    return (await api.get("/admin")).data;
  },
};

export default adminApi;
