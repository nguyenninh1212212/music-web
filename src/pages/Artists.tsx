import React from "react";
import artistApi from "@/api/artist";
import { useQuery } from "@tanstack/react-query";
import { IArtistCard } from "@/lib/types";
import { ArtistCard } from "@/components/ArtistCard";
export const Artists: React.FC = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["artist"],
    queryFn: () => {
      return artistApi.getArtists({ page: 1, size: 10 });
    },
  });
  if (isLoading) return;
  console.log("🚀 ~ Artists ~ data:", data);

  return (
    <div className="p-8 pb-32">
      <div className="mb-8">
        <h1 className="text-white mb-2">Nghệ sĩ</h1>
        <p className="text-gray-400">
          Khám phá và theo dõi nghệ sĩ yêu thích của bạn
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
        {data.items.map((artist: IArtistCard) => (
          <ArtistCard key={artist.id} artist={artist} />
        ))}
      </div>
    </div>
  );
};
