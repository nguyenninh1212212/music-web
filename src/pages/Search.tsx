import React, { useState, useMemo } from "react";
import {
  Search as SearchIcon,
  Music,
  Mic2,
  Disc,
  ListMusic,
} from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { SongCard } from "../components/SongCard";
import { ArtistCard } from "../components/ArtistCard";
import { useQuery } from "@tanstack/react-query";
import searchApi from "@/api/search";
import { IArtistCard, ISongCard } from "@/lib/types";
import AudioSearch from "@/components/AudioSearch";

export const Search: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const { data, isLoading, error } = useQuery({
    queryKey: ["search", searchQuery],
    queryFn: () => searchApi.getSearch(searchQuery),
    enabled: !!searchQuery.trim(), // chỉ fetch khi có input
  });
  console.log("🚀 ~ Search ~ data:", data);

  // --- Dữ liệu hiển thị ---
  const filteredResults = useMemo(() => {
    if (!searchQuery.trim()) {
      return {
        songs: [],
        artists: [],
      };
    }

    return {
      songs: data?.songs || [],
      artists: data?.artists || [],
    };
  }, [data, searchQuery]);

  // --- Tổng kết quả ---
  const totalResults =
    filteredResults.songs.length + filteredResults.artists.length;

  // --- Trạng thái ---
  if (error)
    return (
      <div className="text-red-400 text-center mt-8">
        Lỗi: {(error as Error).message}
      </div>
    );

  return (
    <div className="min-h-screen pb-32 px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-white mb-2">Tìm kiếm</h1>
        <p className="text-gray-400">Tìm bài hát yêu thích, nghệ sĩ</p>
      </div>

      <div className="mb-8">
        <div className="relative max-w-2xl">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm bài hát, nghệ sĩ...."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-900/50 border border-gray-800 rounded-xl pl-12 pr-4 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-[#00FF80] focus:shadow-[0_0_20px_rgba(0,255,128,0.2)] transition-all duration-200"
          />
        </div>
      </div>

      {/* Result */}
      {!searchQuery || isLoading ? (
        <EmptySearchState />
      ) : totalResults === 0 ? (
        <EmptyResultState />
      ) : (
        <SearchTabs
          results={filteredResults}
          total={totalResults}
          query={searchQuery}
        />
      )}
    </div>
  );
};

// --- Component phụ ---
const EmptySearchState = () => (
  <div className="flex flex-col items-center justify-center py-20">
    <div className="w-20 h-20 rounded-full bg-gray-900/50 border border-gray-800 flex items-center justify-center mb-4">
      <SearchIcon className="w-10 h-10 text-gray-600" />
    </div>
    <h2 className="text-white mb-2">Bắt đầu tìm</h2>
    <p className="text-gray-400 text-center max-w-md">
      Nhập tên bài hát, nghệ sĩ
    </p>
  </div>
);

const EmptyResultState = () => (
  <div className="flex flex-col items-center justify-center py-20">
    <div className="w-20 h-20 rounded-full bg-gray-900/50 border border-gray-800 flex items-center justify-center mb-4">
      <SearchIcon className="w-10 h-10 text-gray-600" />
    </div>
    <h2 className="text-white mb-2">Không tìm thấy kết quả</h2>
    <p className="text-gray-400 text-center max-w-md">
      Thử lại với từ khóa khác hoặc kiểm tra chính tả.
    </p>
  </div>
);

const SearchTabs = ({
  results,
  total,
  query,
}: {
  results: any;
  total: number;
  query: string;
}) => (
  <div>
    <div className="mb-6">
      <p className="text-gray-400">
        Tìm thấy {total} kết quả cho "
        <span className="text-white">{query}</span>"
      </p>
    </div>

    <Tabs defaultValue="songs" className="w-full">
      <TabsList className="bg-gray-900/50 border border-gray-800 p-1 mb-8">
        <TabsTrigger value="songs">
          <Music className="w-4 h-4 mr-2" /> Songs ({results.songs.length})
        </TabsTrigger>
        <TabsTrigger value="artists">
          <Mic2 className="w-4 h-4 mr-2" /> Artists ({results.artists.length})
        </TabsTrigger>
      </TabsList>

      {/* Songs */}
      <TabsContent value="songs">
        {results.songs.length === 0 ? (
          <EmptyTab icon={Music} text="Không thấy bài hát" />
        ) : (
          results.songs.map((song: ISongCard, i: number) => (
            <SongCard key={song.id} song={song} index={i} />
          ))
        )}
      </TabsContent>

      {/* Artists */}
      <TabsContent value="artists">
        {results.artists.length === 0 ? (
          <EmptyTab icon={Mic2} text="Không thấy nghệ sĩ" />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {results.artists.map((artist: IArtistCard) => (
              <ArtistCard key={artist.id} artist={artist} />
            ))}
          </div>
        )}
      </TabsContent>
    </Tabs>
  </div>
);

const EmptyTab = ({ icon: Icon, text }: { icon: any; text: string }) => (
  <div className="flex flex-col items-center justify-center py-12">
    <Icon className="w-12 h-12 text-gray-600 mb-3" />
    <p className="text-gray-400">{text}</p>
  </div>
);
