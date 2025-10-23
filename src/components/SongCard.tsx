import React from "react";
import { ISongCard } from "../lib/types";
import { Play, Heart } from "lucide-react";
import { useMusicPlayer } from "../contexts/MusicPlayerContext";
import { useNavigate } from "react-router-dom";

interface ISongCardProp {
  song: ISongCard;
  index: number;
}

export const SongCard: React.FC<ISongCardProp> = ({ index, song }) => {
  console.log("🚀 ~ SongCard ~ song:", song);
  const { playSong } = useMusicPlayer();
  const navigate = useNavigate();

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="group flex items-center gap-4 p-2 rounded-lg hover:bg-gray-800/50 transition-all duration-200">
      {index !== undefined && (
        <span className="text-gray-400 w-6 text-center group-hover:hidden">
          {index + 1}
        </span>
      )}
      <button
        // --- THAY ĐỔI CHÍNH Ở ĐÂY ---
        // Chỉ truyền 'song.id' thay vì một object lớn
        onClick={() => playSong(song.id)}
        // -------------------------
        className={`${
          index !== undefined ? "hidden group-hover:block" : ""
        } w-6 h-6 rounded-full bg-[#00FF80] hover:bg-[#00FF80]/80 flex items-center justify-center transition-all shadow-[0_0_15px_rgba(0,255,128,0.5)] p-1`}
      >
        <Play className="w-4 h-4 text-black " />
      </button>

      <img
        src={song.coverImage}
        alt={song.title}
        className="w-12 h-12 rounded object-cover cursor-pointer"
        onClick={() => navigate(`/music/${song.id}`)}
      />

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

      <button className="text-gray-400 hover:text-[#00FF80] transition-colors opacity-0 group-hover:opacity-100">
        <Heart className="w-5 h-5" />
      </button>

      <span className="text-gray-400 text-sm w-16 text-right">
        {formatDuration(song.duration)}
      </span>
    </div>
  );
};
