import { IArtistCreate } from "@/lib/types";
import api from "./axios"; // Giả định 'api' là axios instance đã cấu hình

const artistApi = {
  createArtist: async (formData: IArtistCreate) =>
    await api.post("/artists", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),

  getArtists: async (params = { page: 1, size: 10 }) => {
    return (await api.get("/artists", { params })).data;
  },

  getMyArtistProfile: async () => {
    return await api.get("/artists/me");
  },

  updateArtistProfile: async (formData: IArtistCreate) =>
    await api.put("/artists/me", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),

  getMyFollowers: async (params = { page: 1, size: 10 }) => {
    return (await api.get("/artists/myFollowers", { params })).data;
  },

  getFollowingArtists: async (params = { page: 1, size: 10 }) => {
    return (await api.get("/artists/follows", { params })).data;
  },

  getArtistById: async (id: string) => {
    return (await api.get(`/artists/${id}`)).data;
  },

  followArtist: async (artistId: string) => {
    await api.post(`/artists/follow/${artistId}`);
  },

  unfollowArtist: async (artistId: string) =>
    await api.delete(`/artists/unfollow/${artistId}`),
};

export default artistApi;
