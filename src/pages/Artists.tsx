import React from "react";
import artistApi from "@/api/artist";
import { IArtistCard } from "@/lib/types";
import { ArtistCard } from "@/components/ArtistCard";
import { useQueryPagination } from "@/components/useQueryPagination";
import PaginationControls from "@/components/PaginationControls";
export const Artists: React.FC = () => {
  const fetchArtists = async (params: { page: number; size: number }) => {
    return await artistApi.getArtists(params);
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
  } = useQueryPagination<IArtistCard>(["artists"], fetchArtists, PAGE_SIZE);

  if (isLoading) return;
  return (
    <div className="p-8 pb-32">
      <div className="mb-8">
        <h1 className="text-white mb-2">Nghệ sĩ</h1>
        <p className="text-gray-400">
          Khám phá và theo dõi nghệ sĩ yêu thích của bạn
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
        {data?.map((artist: IArtistCard) => (
          <ArtistCard key={artist.id} artist={artist} />
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
