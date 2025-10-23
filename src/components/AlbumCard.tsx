import React from "react";
import { IAlbumCard } from "../lib/types";
import { Play } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface AlbumCardProps {
  album: IAlbumCard;
}

export const AlbumCard: React.FC<AlbumCardProps> = ({ album }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/album/${album.id}`)}
      className="group bg-gray-900/30 p-4 rounded-lg hover:bg-gray-800/50 transition-all duration-300 cursor-pointer"
    >
      <div className="relative mb-4">
        <img
          src={album.coverUrl}
          alt={album.title}
          className="w-full aspect-square object-cover rounded-lg shadow-lg"
        />
        <button
          className="absolute bottom-2 right-2 w-12 h-12 rounded-full bg-[#00FF80] flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 shadow-[0_0_20px_rgba(0,255,128,0.6)]"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <Play className="w-5 h-5 text-black ml-0.5" />
        </button>
      </div>
      <h3 className="text-white truncate mb-1">{album.title}</h3>
      <p className="text-gray-400 text-sm truncate">
        {album.artist?.stageName}
      </p>
    </div>
  );
};
