import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { SongCard } from "../components/SongCard";
import { Play, Heart, Clock, Shuffle } from "lucide-react";
import { useMusicPlayer } from "../contexts/MusicPlayerContext";
import { useQuery } from "@tanstack/react-query";
import albumApi from "@/api/album";
// Giả định bạn có các kiểu dữ liệu này từ file types.ts
import { Album, ISongCard } from "@/lib/types";

type AlbumDetailResponse = Omit<Album, "songs"> & {
  songs: ISongCard[];
  artist: {
    id: string;
    stageName: string;
  };
};

export const AlbumDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { playSong } = useMusicPlayer();

  const {
    data: album,
    isLoading,
    isError,
  } = useQuery<AlbumDetailResponse>({
    queryKey: ["album", id],
    queryFn: () => albumApi.getAlbumById(id as string),
    enabled: !!id,
    select: (response: any) => response.data || response,
  });
  console.log("🚀 ~ AlbumDetail ~ album:", album);

  if (isLoading) {
    return <div className="p-8 text-white">Đang tải Album...</div>;
  }

  if (isError || !album) {
    return <div className="p-8 text-white">Không tìm thấy Album</div>;
  }

  const handlePlayAll = () => {
    if (album.songs.length === 0) return;
    playSong(album.songs[0].id);
  };

  const handleShuffle = () => {
    if (album.songs.length === 0) return;
    const randomSong =
      album.songs[Math.floor(Math.random() * album.songs.length)];
    playSong(randomSong.id);
  };

  return (
    <div className="pb-32">
      {/* Header (sử dụng dữ liệu từ 'album') */}
      <div className="bg-gradient-to-b from-gray-800/50 to-transparent p-8 mb-8">
        <div className="flex items-end gap-6">
          <img
            src={album.coverUrl}
            alt={album.title}
            className="w-60 h-60 rounded-lg shadow-[0_0_25px_rgba(0,255,128,0.6)]"
          />
          <div className="flex-1">
            <p className="text-gray-400 mb-2">Album</p>
            <h1 className="text-white mb-4">{album.title}</h1>
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate(`/artist/${album.artistId}`)}
                className="text-[#00FF80] hover:underline"
              >
                {album.artist.stageName}
              </button>
              <span className="text-gray-400">•</span>
              <span className="text-gray-400">
                {album.releaseDate
                  ? new Date(album.releaseDate).getFullYear()
                  : "N/A"}
              </span>
              <span className="text-gray-400">•</span>
              <span className="text-gray-400">
                {album.songs.length} Bài hát
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="px-8 mb-6 flex items-center gap-4">
        <button
          onClick={handlePlayAll}
          className="flex items-center gap-2 px-8 py-3 bg-[#00FF80] hover:bg-[#00FF80]/80 text-black rounded-full transition-all duration-300 shadow-[0_0_25px_rgba(0,255,128,0.6)] hover:shadow-[0_0_35px_rgba(0,255,128,0.8)]"
        >
          <Play className="w-5 h-5 ml-0.5" />
          <span>Play</span>
        </button>
        <button
          onClick={handleShuffle}
          className="p-3 border border-gray-700 rounded-full text-gray-400 hover:text-white hover:border-[#00FF80] transition-all"
        >
          <Shuffle className="w-5 h-5" />
        </button>
        <button className="p-3 border border-gray-700 rounded-full text-gray-400 hover:text-[#00FF80] hover:border-[#00FF80] transition-all">
          <Heart className="w-5 h-5" />
        </button>
      </div>

      {/* Track List */}
      <div className="px-8">
        <div className="flex items-center gap-4 px-2 pb-2 border-b border-gray-800 mb-2 text-gray-400 text-sm">
          <span className="w-6 text-center">#</span>
          <span className="flex-1">Title</span>
          <Clock className="w-4 h-4 mr-12" />
        </div>
        <div className="space-y-1">
          {album.songs.length > 0 ? (
            album.songs.map((song, index) => (
              <SongCard key={song.id} song={song} index={index} />
            ))
          ) : (
            <p className="text-white text-center">Không có bài hát nào</p>
          )}
        </div>
      </div>
    </div>
  );
};
