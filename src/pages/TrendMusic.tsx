// TrendMusic.jsx (ĐÃ CẬP NHẬT để hiển thị Pagination ở cuối cùng)

import React from "react";
// ... (các imports khác)
import PaginationControls from "@/components/PaginationControls";
import { useQueryPagination } from "@/components/useQueryPagination";
import songApi from "@/api/songs";
import Loading from "@/components/Loading";
import { ISongCard } from "@/lib/types";
import { SongCard } from "@/components/SongCard";

export const TrendMusic: React.FC = () => {
  // ... (logic fetchTrendingSongs và useQueryPagination)
  const fetchTrendingSongs = async (params: { page: number; size: number }) => {
    return await songApi.getSongs(params);
  };

  const PAGE_SIZE = 10;

  const {
    data: songs,
    isLoading,
    isPreviousData,
    currentPage,
    totalPages,
    totalItems,
    pageSize,
    goToNextPage,
    goToPrevPage,
  } = useQueryPagination(["songs"], fetchTrendingSongs, PAGE_SIZE);

  if (isLoading && !isPreviousData) {
    return <Loading />;
  }

  const dataToDisplay: ISongCard[] = (songs as ISongCard[]) || [];

  return (
    // Ứng dụng Flexbox cho container chính
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-black via-slate-900 to-emerald-950">
      {/* Vùng Nội dung Chính (Header + Grid) - Sẽ chiếm hết không gian còn lại */}
      <div className="flex-grow">
        {/* Header */}

        {/* Song Grid */}
        <main className="px-4 sm:px-6 lg:px-8">
          <div className="max-w-screen-2xl mx-auto space-y-10">
            <div
              className={`transition-opacity duration-300 ${
                isPreviousData ? "opacity-50" : "opacity-100"
              }`}
            >
              {dataToDisplay.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                  {dataToDisplay.map((song, index) => (
                    <SongCard key={song.id} song={song} index={index} />
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-center py-10">
                  Không tìm thấy bài hát nào.
                </p>
              )}
            </div>
          </div>
        </main>
      </div>{" "}
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
      {/* Music Player (Nếu có) */}
    </div>
  );
};
