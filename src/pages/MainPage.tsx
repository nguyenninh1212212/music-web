import React from "react";
import { ArtistCard } from "../components/ArtistCard";
import { AudioWaveform } from "lucide-react";
import { useMusicPlayer } from "../contexts/MusicPlayerContext";
import { Link } from "react-router-dom";
import { getHome } from "../api/home";
import { useQuery } from "@tanstack/react-query";
import { IAlbumCard, IArtistCard } from "@/lib/types";
import { AlbumCard } from "@/components/AlbumCard";
import Loading from "@/components/Loading";

export const MainPage: React.FC = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const res = await getHome();
      return res;
    },
  });
  console.log("🚀 ~ MainPage ~ data:", data);
  if (isLoading) return <Loading />;
  if (error) return;
  console.log("🚀 ~ MainPage ~ error:", error);

  return (
    <div className="p-5 pb-32">
      {/* Hero Banner */}
      <div className="relative h-80 rounded-2xl overflow-hidden mb-12 bg-gradient-to-br from-purple-900/50 via-pink-900/50 to-[#00FF80]/30">
        <img
          src="https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1200"
          alt="Hero"
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent"></div>
        <div className="absolute bottom-8 left-8">
          <h1 className="text-white mb-4">Bài hát thịnh hành</h1>
          <p className="text-gray-300 mb-6">
            Khám phá những bản nhạc hot nhất hiện nay
          </p>
          <Link to={"/music/trend"}>
            <button className="flex items-center gap-2 px-8 py-3 bg-[#00FF80] hover:bg-[#00FF80]/80 text-black rounded-full transition-all duration-300 shadow-[0_0_25px_rgba(0,255,128,0.6)] hover:shadow-[0_0_35px_rgba(0,255,128,0.8)]">
              <span>Khám phá </span>
              <AudioWaveform className="w-5 h-5 ml-0.5" />
            </button>
          </Link>
        </div>
      </div>

      {/* Nghệ sĩ nổi bật */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-white">Nghệ sĩ nổi bật</h2>
          <Link
            className="text-gray-400 hover:text-[#00FF80] transition-colors"
            to={"/artists"}
          >
            See all
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
          {data.artists.map((artist: IArtistCard) => (
            <ArtistCard key={artist.id} artist={artist} />
          ))}
        </div>
      </section>

      {/* Danh sách phát phổ biến */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-white">Danh sách phát phổ biến</h2>
          <Link
            className="text-gray-400 hover:text-[#00FF80] transition-colors"
            to={"/albums"}
          >
            See all
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {data.albums.map((album: IAlbumCard) => (
            <AlbumCard key={album.id} album={album} />
          ))}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"></div>
      </section>
    </div>
  );
};
