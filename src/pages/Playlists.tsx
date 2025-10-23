import React from "react";
import { PlaylistCard } from "../components/PlaylistCard";
import { useQuery } from "@tanstack/react-query";
import playlistApi from "@/api/playlistApi";

export const Playlists: React.FC = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["playList"],
    queryFn: () => {
      return playlistApi.getUserPlaylists();
    },
    gcTime: 4,
  });
  if (isLoading) return;

  return (
    <div className="p-8 pb-32">
      <div className="mb-8">
        <h1 className="text-white mb-2">Danh sách phát của bạn</h1>
        <p className="text-gray-400">Bộ sưu tập nhạc yêu thích của bạn </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {data?.map((playlist) => (
          <PlaylistCard key={playlist.id} playlist={playlist} />
        ))}
      </div>
    </div>
  );
};
