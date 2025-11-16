// src/pages/Favourites.tsx

import React from "react";
// import { mockSongs } from "../lib/mockData"; // <-- Bỏ mock data
import { SongCard } from "../components/SongCard";
import { useQuery } from "@tanstack/react-query";
import songApi from "@/api/songs";
import { useAuth } from "@/contexts/AuthContext";
import { ISongCard } from "@/lib/types"; // <-- Import kiểu 'Song' của bạn

export const Favourites: React.FC = () => {
  const { isAuthenticated } = useAuth();
  console.log("🚀 ~ Favourites ~ isAuthenticated:", isAuthenticated);

  const { data: favouriteSongs, isLoading } = useQuery({
    queryKey: ["songs", isAuthenticated],
    queryFn: async () => {
      const response = await songApi.getFavoriteSongs();
      return response.data;
    },
    enabled: isAuthenticated,
    gcTime: 0, 
  });

  if (isLoading) return <p></p>;

  const songs = favouriteSongs.items || [];
  console.log("🚀 ~ Favourites ~ songs:", songs);

  return (
    <div className="pb-32">
      {/* Header */}
      <div className="bg-gradient-to-b from-purple-900/30 to-transparent p-8 mb-8">
        <div className="flex items-end gap-6">
          {/* ... */}
          <div className="flex-1">
            <p className="text-gray-400 mb-2">Playlist</p>
            <h1 className="text-white mb-4">Liked Songs</h1>
            {/* Dùng độ dài mảng thật */}
            <p className="text-gray-300">{songs.length} liked songs</p>
          </div>
        </div>
      </div>

      {/* Track List */}
      <div className="px-8">
        {songs.length > 0 ? ( // <-- Dùng mảng thật
          <>
            <div className="flex items-center gap-4 px-2 pb-2 border-b border-gray-800 mb-2 text-gray-400 text-sm">
              {/* ... */}
            </div>
            <div className="space-y-1">
              {/* Map trên mảng thật */}
              {songs.map((song: ISongCard, index: number) => (
                <div key={song.id} className="group relative">
                  <SongCard song={song} index={index} />
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            {/* ... */}
            <h2 className="text-white mb-2">No liked songs yet</h2>
            {/* ... */}
          </div>
        )}
      </div>
    </div>
  );
};
