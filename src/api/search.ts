import api from "./axios";

const searchApi = {
  getSearch: async (search: string) =>
    (await api.get("/search/", { params: { search } })).data,
};

export default searchApi;
