import React from "react";
import { IArtistCard } from "../lib/types";
import { Play } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ArtistCardProps {
  artist: IArtistCard;
}

export const ArtistCard: React.FC<ArtistCardProps> = ({ artist }) => {
  console.log("🚀 ~ ArtistCard ~ artist:", artist);
  const navigate = useNavigate();

  const formatFollowers = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(0)}K`;
    }
    return count.toString();
  };

  return (
    <div
      onClick={() => navigate(`/artist/${artist.id}`)}
      className="group bg-gray-900/30 p-4 rounded-lg hover:bg-gray-800/50 transition-all duration-300 cursor-pointer"
    >
      <div className="relative mb-4">
        <img
          src={artist.avatarUrl}
          alt={artist.stageName}
          className="w-full aspect-square object-cover rounded-full shadow-lg ring-2 ring-transparent group-hover:ring-[#00FF80] group-hover:shadow-[0_0_30px_rgba(0,255,128,0.4)] transition-all duration-300"
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
      <h3 className="text-white truncate mb-1 text-center">
        {artist.stageName}
      </h3>
      <p className="text-gray-400 text-sm text-center">
        {formatFollowers(artist.followerCount)} Người theo dõi
      </p>
    </div>
  );
};
