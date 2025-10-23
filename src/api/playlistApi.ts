import api from "./axios";

const playlistApi = {
  createPlaylist: async (name) => (await api.post("/playlists", { name })).data,

  addSongToPlaylist: async (playlistId, songId) =>
    (await api.post(`/playlists/${playlistId}/songs/${songId}`)).data,

  getUserPlaylists: async () => {
    return await api.get("/playlists/playlist");
  },

  getPlaylistById: async (playlistId) =>
    (await api.get(`/playlists/${playlistId}`)).data,

  deletePlaylist: async (playlistId) =>
    (await api.delete(`/playlists/${playlistId}`)).data,

  removeSongFromPlaylist: async (playlistId, songId) =>
    (await api.delete(`/playlists/${playlistId}/songs?songId=${songId}`)).data,
};

export default playlistApi;
