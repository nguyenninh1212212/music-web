import React from "react";
import { AlbumCard } from "../components/AlbumCard";
import albumApi from "@/api/album";
import { useQuery } from "@tanstack/react-query";
import { IAlbumCard } from "@/lib/types";
import { useQueryPagination } from "@/components/useQueryPagination";
import PaginationControls from "@/components/PaginationControls";

export const Albums: React.FC = () => {
  const fetchAlbums = async (params: { page: number; size: number }) => {
    return await albumApi.getAlbums(params);
  };

  const PAGE_SIZE = 10;

  const {
    data,
    isLoading,
    isPreviousData,
    currentPage,
    totalPages,
    totalItems,
    pageSize,
    goToNextPage,
    goToPrevPage,
  } = useQueryPagination<IAlbumCard>(["albums"], fetchAlbums, PAGE_SIZE);

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
        {data &&
          data?.map((album: IAlbumCard) => (
            <AlbumCard key={album.id} album={album} />
          ))}
      </div>
      {totalPages > -1 && (
        <footer className="w-full mt-auto py-4 px-4 sm:px-6 lg:px-8 bg-gray-900/70 border-t border-gray-700/50">
          <div className="max-w-screen-2xl mx-auto">
            <PaginationControls
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalItems}
              pageSize={pageSize}
              isPreviousData={isPreviousData}
              onPrev={goToPrevPage}
              onNext={goToNextPage}
            />
          </div>
        </footer>
      )}
    </div>
  );
};
