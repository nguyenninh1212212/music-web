// src/pages/Favourites.tsx

import React from "react";
// import { mockSongs } from "../lib/mockData"; // <-- Bỏ mock data
import { SongCard } from "../components/SongCard";
import { Heart, Clock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import songApi from "@/api/songs";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { useAuth } from "@/contexts/AuthContext";
import { Song } from "@/lib/types"; // <-- Import kiểu 'Song' của bạn

export const Favourites: React.FC = () => {
  const { isAuthenticated } = useAuth();
  console.log("🚀 ~ Favourites ~ isAuthenticated:", isAuthenticated);

  const { data: favouriteSongs, isLoading } = useQuery<Song[]>({
    queryKey: ["favorite", isAuthenticated],
    queryFn: async () => {
      const response = await songApi.getFavoriteSongs();
      return response.data;
    },
    enabled: isAuthenticated,
  });

  if (isLoading) return <LoadingSpinner />;

  const songs = favouriteSongs || [];

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
              {songs.map((song, index) => (
                <div key={song.id} className="group relative">
                  <SongCard song={song} index={index} />
                  <button
                    className="absolute right-16 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-all"
                    onClick={() => {
                      // TODO: Xử lý remove song
                    }}
                  >
                    <Heart className="w-5 h-5" fill="currentColor" />
                  </button>
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
