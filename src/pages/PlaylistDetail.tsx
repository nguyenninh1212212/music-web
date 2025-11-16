import React from "react";
import { useParams } from "react-router-dom";
import { SongCard } from "../components/SongCard";
import { Play, Clock, Music } from "lucide-react";
import { useMusicPlayer } from "../contexts/MusicPlayerContext";
import { useQuery } from "@tanstack/react-query";
import playlistApi from "@/api/playlistApi";
import { getImageClass } from "@/util/help"; // Giả sử hàm này đã đúng
import { ISongCard, SongSummary } from "@/lib/types";

export const PlaylistDetail: React.FC = () => {
  const { id } = useParams();
  const { playSong } = useMusicPlayer();

  const { data, isLoading } = useQuery({
    queryKey: ["playlist", id],
    queryFn: async () => {
      return playlistApi.getPlaylistById(id as string);
    },
  });

  // SỬA 1: Di chuyển logic xử lý data xuống SAU khi kiểm tra loading
  if (isLoading) {
    return <div className="p-8 text-white">Đang tải playlist...</div>;
  }

  if (!data) {
    return <div className="p-8 text-white">Không tìm thấy playlist</div>;
  }

  // --- Logic xử lý data chỉ chạy khi data đã tồn tại ---
  const songCovers = data.songs.slice(0, 4);
  const count = songCovers.length;

  const handlePlayAll = () => {
    if (data.songs && data.songs.length > 0) {
      playSong(data.songs[0].id);
    }
  };

  const totalDuration = data.songs.reduce(
    (acc: number, song: ISongCard) => acc + (song.duration || 0),
    0
  );
  const hours = Math.floor(totalDuration / 3600);
  const minutes = Math.floor((totalDuration % 3600) / 60);

  return (
    <div className="pb-32">
      {/* Header */}
      <div className="bg-gradient-to-b from-gray-800/50 to-transparent p-8 mb-8">
        <div className="flex items-end gap-6">
          {/* SỬA 2: Xóa <img> data.coverImage bị trùng lặp */}

          {/* SỬA 3: Sửa lại container cho adaptive grid */}
          <div className="relative w-60 h-60 rounded-lg shadow-2xl overflow-hidden bg-gray-800 flex items-center justify-center flex-shrink-0">
            {count === 0 ? (
              <Music className="w-1/2 h-1/2 text-gray-600" />
            ) : (
              songCovers.map((song: SongSummary, index: number) => (
                <img
                  key={song.id}
                  src={song.coverImage}
                  alt={song.title} // Thêm alt text
                  className={getImageClass(index, count)}
                />
              ))
            )}
          </div>

          <div className="flex-1">
            <p className="text-gray-400 mb-2">Playlist</p>
            <h1 className="text-white text-4xl font-bold mb-4">{data.title}</h1>
            {data.description && (
              <p className="text-gray-300 mb-4">{data.description}</p>
            )}
            <div className="flex items-center gap-2 text-gray-400">
              {/* Sửa: Lấy tổng số bài hát từ data.songs.length */}
              <span>{data.songs.length} songs</span>
              <span>•</span>
              <span>
                {hours > 0 ? `${hours} hr ` : ""}
                {minutes} min
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="px-8 mb-6">
        <button
          onClick={handlePlayAll}
          className="flex items-center gap-2 px-8 py-3 bg-[#00FF80] hover:bg-[#00FF80]/80 text-black rounded-full transition-all duration-300 shadow-[0_0_25px_rgba(0,255,128,0.6)] hover:shadow-[0_0_35px_rgba(0,255,128,0.8)]"
        >
          <Play className="w-5 h-5 ml-0.5" />
          <span>Play All</span>
        </button>
      </div>

      {/* Track List */}
      <div className="px-8">
        <div className="flex items-center gap-4 px-2 pb-2 border-b border-gray-800 mb-2 text-gray-400 text-sm">
          <span className="w-6 text-center">#</span>
          <span className="w-12"></span>
          <span className="flex-1">Title</span>
          <Clock className="w-4 h-4 mr-12" />
        </div>
        <div className="space-y-1">
          {data.songs.map((song: ISongCard, index: number) => (
            <SongCard key={song.id} song={song} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
};
