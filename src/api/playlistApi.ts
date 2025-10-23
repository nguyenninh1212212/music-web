import api from "./axios";

const playlistApi = {
  createPlaylist: async (name: string) =>
    (await api.post("/playlists", { name })).data,

  addSongToPlaylist: async (playlistId: string, songId: string) =>
    (await api.post(`/playlists/${playlistId}/songs/${songId}`)).data,

  getUserPlaylists: async () => {
    return (await api.get("/playlists/playlist")).data;
  },

  getPlaylistById: async (playlistId: string) =>
    (await api.get(`/playlists/${playlistId}`)).data,

  deletePlaylist: async (playlistId: string) =>
    (await api.delete(`/playlists/${playlistId}`)).data,

  removeSongFromPlaylist: async (playlistId: string, songId: string) =>
    (await api.delete(`/playlists/${playlistId}/songs?songId=${songId}`)).data,
};

export default playlistApi;
