// HistoryMusic.jsx

import React from "react";
import PaginationControls from "@/components/PaginationControls";
import { useQueryPagination } from "@/components/useQueryPagination";
import songApi from "@/api/songs";
import Loading from "@/components/Loading";
import { ISongCard } from "@/lib/types";
import { SongCard } from "@/components/SongCard";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";

export const HistoryMusic: React.FC = () => {
  // Fetch history songs, trả về { id, title } cho mỗi bài
  const { data, isLoading } = useQuery({
    queryFn: () => songApi.getHistory(),
    queryKey: ["History"],
    gcTime: 5,
  });

  const datas = data ? data?.data : [];
  console.log("🚀 ~ HistoryMusic ~ datas:", datas);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-black via-slate-900 to-emerald-950">
      <div className="flex-grow">
        <main className="px-4 sm:px-6 lg:px-8">
          <div className="max-w-screen-2xl mx-auto space-y-10">
            {datas.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 mt-9">
                {datas.map((song: any, index: any) => (
                  <SongCard index={index} song={song} />
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-center py-10">
                Bạn chưa nghe bài hát nào.
              </p>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};
