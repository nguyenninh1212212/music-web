import api from "./axios";

const searchApi = {
  getSearch: async (search: string) =>
    (await api.get("/search/", { params: { search } })).data,
  getAudioSearch: async (audioFile: FormData) =>
    await api.post("/search/audio", audioFile, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
  getAutocomplete: async (q: string) =>
    (await api.get("/search/autocomplete", { params: { q } })).data,
};

export default searchApi;
