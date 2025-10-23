import { useQuery } from "@tanstack/react-query";
import { SongCard } from "../components/SongCard";
import songApi from "../api/songs";
import Loading from "@/components/Loading";
import { ISongCard } from "@/lib/types";

export const TrendMusic: React.FC = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["songs"],
    queryFn: () => {
      return songApi.getSongs({ page: 1, size: 10 });
    },
  });
  console.log("🚀 ~ TrendMusic ~ data:", data);
  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-900 to-emerald-950 pb-32">
      {/* Header */}
      <header className="pt-12 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-screen-2xl mx-auto">
          <h1 className="bg-gradient-to-r from-white via-green-200 to-green-500 bg-clip-text text-transparent">
            🔥 Trending Songs
          </h1>
        </div>
      </header>

      {/* Song Grid */}
      <main className="px-4 sm:px-6 lg:px-8">
        <div className="max-w-screen-2xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {data.items.map((song: ISongCard, index: number) => (
              <SongCard key={song.id} song={song} index={index} />
            ))}
          </div>
        </div>
      </main>

      {/* Music Player */}
    </div>
  );
};
