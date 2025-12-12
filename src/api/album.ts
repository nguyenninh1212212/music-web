import api from "./axios";

const albumApi = {
  getAlbums: async (params = { page: 1, size: 10 }) => {
    return await api.get("/albums", { params });
  },

  getAlbumById: async (id: string) => {
    return (await api.get(`/albums/${id}`)).data;
  },

  createAlbum: async (formData: FormData) =>
    await api.post("/albums/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
  addSongToAlbum: async (albumId: string, songId: string) =>
    await api.post(`/albums/${albumId}/add/song`, null, { params: { songId } }),

  deleteAlbum: async (id: string) => await api.delete(`/albums/${id}`),

  removeSongFromAlbum: async (albumId: string, songId: string) =>
    await api.post(`/${albumId}/song`, null, { params: { songId } }),
  addFavoriteAlbum: async (id: string) =>
    await api.post(`/albums/farvorite/${id}`),

  removeFavoriteAlbum: async (id: string) =>
    await api.delete(`/albums/farvorite/${id}`),
};

export default albumApi;
