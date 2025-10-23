import React from "react";
import { AlbumCard } from "../components/AlbumCard";
import albumApi from "@/api/album";
import { useQuery } from "@tanstack/react-query";
import { IAlbumCard } from "@/lib/types";

export const Albums: React.FC = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["albums"],
    queryFn: () => {
      return albumApi.getAlbums({ page: 1, size: 10 });
    },
  });

  if (isLoading) return;
  console.log("🚀 ~ Albums ~ data:", data);
  return (
    <div className="p-8 pb-32">
      <div className="mb-8">
        <h1 className="text-white mb-2">Albums</h1>
        <p className="text-gray-400">
          Khám phá toàn bộ album từ nghệ sĩ yêu thích của bạn
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {data.items.map((album: IAlbumCard) => (
          <AlbumCard key={album.id} album={album} />
        ))}
      </div>
    </div>
  );
};
