import React, { useState } from "react";
import { ISongCard } from "../lib/types";
import { Play, Heart, Plus } from "lucide-react";
import { useMusicPlayer } from "../contexts/MusicPlayerContext";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import songApi from "@/api/songs";
import playlistApi from "@/api/playlistApi";
import { toast } from "sonner";

interface ISongCardProp {
  song: ISongCard;
  index: number;
}

export const SongCard: React.FC<ISongCardProp> = ({ index, song }) => {
  const { playSong } = useMusicPlayer();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showPlaylist, setShowPlaylist] = useState(false);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Lấy danh sách playlist của user
  const { data: playlists } = useQuery({
    queryKey: ["playlist"],
    queryFn: () => playlistApi.getUserPlaylists(),
  });

  // Thêm bài hát vào playlist
  const handleAddToPlaylist = useMutation({
    mutationFn: async (playlistId: string) => {
      await playlistApi.addSongToPlaylist(playlistId, song.id);
    },
    onSuccess: () => {
      toast.success("Added to playlist!");
      setShowPlaylist(false);
      queryClient.invalidateQueries({ queryKey: ["playlist"] });
    },
    onError: () => {
      toast.warning("Nhạc đã sẵn có trong danh sách phát");
    },
  });

  // Xóa bài hát khỏi playlist
  const handleRemoveFromPlaylist = useMutation({
    mutationFn: async (playlistId: string) => {
      await playlistApi.removeSongFromPlaylist(playlistId, song.id);
    },
    onSuccess: () => {
      toast.success("Xóa khỏi danh sách phát thành công!");
      setShowPlaylist(false);
      queryClient.invalidateQueries({ queryKey: ["playlist"] });
    },
    onError: () => {
      toast.error("Failed");
    },
  });

  // Thêm/xóa favorite (giữ nguyên)
  const handleAddToFavorite = useMutation({
    mutationFn: async () => {
      await songApi.addSongToFavorites(song.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["songs"] });
      toast.success("Song added to favorites!");
    },
    onError: () => {
      toast.error("Failed to add song to favorites.");
    },
  });

  const handleRemoveFromFavorite = useMutation({
    mutationFn: async () => {
      await songApi.removeSongFromFavorites(song.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["songs"] });
      toast.success("Song removed from favorites!");
    },
    onError: () => {
      toast.error("Failed to remove song from favorites.");
    },
  });

  // Kiểm tra bài hát có trong playlist không
  const isInPlaylist = (pl: any) => pl.songs.some((s: any) => s.id === song.id);

  return (
    <div className="group flex items-center gap-4 p-2 rounded-lg hover:bg-gray-800/50 transition-all duration-200">
      {index !== undefined && (
        <span className="text-gray-400 w-6 text-center group-hover:hidden">
          {index + 1}
        </span>
      )}

      <button
        onClick={() => playSong(song.id)}
        className={`${
          index !== undefined ? "hidden group-hover:block" : ""
        } w-6 h-6 rounded-full bg-[#00FF80] flex items-center justify-center transition-all shadow-[0_0_15px_rgba(0,255,128,0.5)] p-1`}
      >
        <Play className="w-4 h-4 text-black " />
      </button>

      {song.coverImage && (
        <img
          src={song.coverImage}
          alt={song.title}
          className="w-12 h-12 rounded object-cover cursor-pointer"
          onClick={() => navigate(`/music/${song.id}`)}
        />
      )}

      <div className="flex-1 min-w-0">
        <button
          onClick={() => navigate(`/music/${song.id}`)}
          className="text-white truncate block w-full text-left hover:underline"
        >
          {song.title}
        </button>
        <p className="text-gray-400 text-sm truncate">
          {song.artist?.stageName}
        </p>
      </div>

      {/* Nút Thêm/Xóa Playlist */}
      <div className="relative">
        <button
          className="p-1 hover:bg-gray-700 rounded"
          onClick={() => setShowPlaylist(!showPlaylist)}
        >
          <Plus className="w-5 h-5 text-white" />
        </button>

        {showPlaylist && playlists && playlists.length > 0 && (
          <ul className="absolute right-0 top-full mt-1 bg-gray-900 border border-gray-700 rounded shadow-lg w-48 z-50 p-2 text-white">
            {playlists.map((pl: any) => {
              const inPlaylist = isInPlaylist(pl);
              return (
                <li
                  key={pl.id}
                  className="px-3 py-2 hover:bg-gray-800 cursor-pointer m-1 rounded-lg flex justify-between items-center bg-gray-700"
                >
                  <span>{pl.name}</span>
                  {inPlaylist ? (
                    <button
                      onClick={() => handleRemoveFromPlaylist.mutate(pl.id)}
                      className="text-red-500 text-sm"
                    >
                      Remove
                    </button>
                  ) : (
                    <button
                      onClick={() => handleAddToPlaylist.mutate(pl.id)}
                      className="text-green-500 text-sm"
                    >
                      Add
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Nút Favorite */}
      {song.isFavourite && (
        <button
          className={`${
            !song.isFavourite ? "text-gray-400 hover:text-[#00FF80]" : ""
          } transition-colors opacity-0 group-hover:opacity-100`}
          onClick={
            !song.isFavourite
              ? () => handleAddToFavorite.mutate()
              : () => handleRemoveFromFavorite.mutate()
          }
        >
          {song.isFavourite ? (
            <Heart className="w-5 h-5 fill-[#00FF80]" />
          ) : (
            <Heart className="w-5 h-5" />
          )}
        </button>
      )}

      {song.duration && (
        <span className="text-gray-400 text-sm w-16 text-right">
          {formatDuration(song.duration)}
        </span>
      )}
    </div>
  );
};
