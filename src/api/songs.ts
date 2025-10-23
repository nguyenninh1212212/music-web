import { ICreateSong } from "@/lib/types";
import api from "./axios";

const songApi = {
  getSongs: async (params = { page: 1, size: 10 }) =>
    (await api.get("/songs", { params })).data,

  // SỬA ĐỔI: Thêm .data để hàm này trả về đúng dữ liệu bài hát
  getSongById: async (id?: string) => (await api.get(`/songs/${id}`)).data,

  createSong: async (formData: ICreateSong) =>
    await api.post("/songs", formData),

  updateSong: async (id: string, formData: ICreateSong) =>
    await api.patch(`/songs/${id}`, formData),

  removeSong: async (songId: string) =>
    await api.post("/songs/remove", { songId }),

  restoreSong: async (id: string) => await api.post("/songs/restore", { id }),

  deleteSongPermanently: async (id: string) => await api.delete(`/songs/${id}`),

  addSongToFavorites: async (songId: string) =>
    await api.post(`/songs/favorite/${songId}`),

  getFavoriteSongs: async (params = { page: 1, size: 10 }) =>
    await api.get("/songs/favorite", { params }),

  removeSongFromFavorites: async (songId: string) =>
    await api.delete("/songs/favorite", { data: { songId } }),
};

export default songApi;
