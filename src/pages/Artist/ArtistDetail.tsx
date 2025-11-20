import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { SongCard } from "../../components/SongCard";
import { AlbumCard } from "../../components/AlbumCard";
import {
  Play,
  UserPlus,
  UserCheck,
  Headphones,
  Users,
  Instagram,
} from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import { useMusicPlayer } from "../../contexts/MusicPlayerContext";
import { useMutation, useQuery } from "@tanstack/react-query";
import artistApi from "@/api/artist";
import { IAlbumCard } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export const ArtistDetail: React.FC = () => {
  const { id } = useParams();
  const [isFollowing, setIsFollowing] = useState(false);
  const { playSong } = useMusicPlayer();

  const { user } = useAuth();
  const muatationFollow = useMutation({
    mutationFn: () => artistApi.followArtist(id || ""),
    onSuccess: () => {
      setIsFollowing(true);
      toast.success("Đã follow");
    },
    onError: (err) => {
      toast.error("Error follow" + err);
    },
  });
  const muatationUnFollow = useMutation({
    mutationFn: () => artistApi.unfollowArtist(id || ""),
    onSuccess: () => {
      setIsFollowing(false);
      toast.success("Đã unfollow");
    },
    onError: (err) => toast.error("Error unfollow " + err),
  });

  const { data, isLoading } = useQuery({
    queryKey: ["artistDetail", id],
    queryFn: async () => {
      if (!id) throw new Error("Artist ID is required");
      const a = await artistApi.getArtistById(id);
      return a;
    },
    enabled: !!id,
  });
  useEffect(() => {
    if (data?.artistJson) {
      setIsFollowing(data.artistJson.isFollow);
    }
  }, [data]);

  if (isLoading) return "";
  if (!data || !data.artistJson) {
    return <div className="text-white p-8">Artist not found</div>;
  }

  const artist = data.artistJson;
  const mountlyView = data.monthlyViews;

  console.log("🚀 ~ ArtistDetail ~ mountlyView:", mountlyView);
  if (!id) toast.warning("Artist doesn't exist");

  const handleFollow = () => {
    muatationFollow.mutate();
  };
  const handleUnfollow = () => {
    muatationUnFollow.mutate();
  };

  const handlePlayTopSongs = () => {
    playSong(artist.topSongs[0]);
  };

  const formatFollowers = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(0)}K`;
    }
    return count.toString();
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <div className="pb-32">
      <div className="relative h-96 mb-8">
        <img
          src={artist.bannerUrl}
          alt={artist.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/50 to-transparent"></div>
        <div className="absolute bottom-8 left-8 flex-row items-center justify-center">
          <img
            src={artist.avatarUrl}
            alt=""
            className="w-32 h-32 rounded-full border-[#00FF80] border-2 shadow-[0_0_25px_rgba(0,255,128,0.6)]"
          />
          <h1 className="text-white mb-1 text-center">{artist.stageName}</h1>
          <p className="text-gray-300 mb-4 text-center">
            {formatFollowers(artist?.followerCount || 0)} followers
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="px-8 mb-8 flex items-center gap-4">
        <button
          onClick={handlePlayTopSongs}
          className="flex items-center gap-2 px-8 py-3 bg-[#00FF80] hover:bg-[#00FF80]/80 text-black rounded-full transition-all duration-300 shadow-[0_0_25px_rgba(0,255,128,0.6)] hover:shadow-[0_0_35px_rgba(0,255,128,0.8)]"
        >
          <Play className="w-5 h-5 ml-0.5" />
          <span>Play</span>
        </button>
        <>
          {id &&
            (user?.user.artistId !== id ? (
              <button
                onClick={!isFollowing ? handleFollow : handleUnfollow}
                className={`flex items-center gap-2 px-6 py-3 border rounded-full transition-all ${
                  isFollowing
                    ? "border-[#00FF80] text-[#00FF80] shadow-[0_0_15px_rgba(0,255,128,0.3)]"
                    : "border-gray-700 text-white hover:border-[#00FF80] hover:text-[#00FF80]"
                }`}
              >
                {isFollowing ? (
                  <UserCheck className="w-5 h-5" />
                ) : (
                  <UserPlus className="w-5 h-5" />
                )}
                <span>{isFollowing ? "Following" : "Follow"}</span>
              </button>
            ) : (
              <></>
            ))}
        </>
      </div>

      {/* Content Tabs */}
      <div className="px-8 flex flex-col gap-3 ">
        <Tabs defaultValue="top-songs" className="w-full">
          <TabsList className="bg-transparent border-b border-gray-800 rounded-none w-full justify-start p-0 h-auto">
            <TabsTrigger
              value="top-songs"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#00FF80] data-[state=active]:text-[#00FF80] data-[state=active]:bg-transparent data-[state=active]:shadow-none px-6 py-3"
            >
              Top bài hát
            </TabsTrigger>
            <TabsTrigger
              value="albums"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#00FF80] data-[state=active]:text-[#00FF80] data-[state=active]:bg-transparent data-[state=active]:shadow-none px-6 py-3"
            >
              Albums
            </TabsTrigger>
            <TabsTrigger
              value="about"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#00FF80] data-[state=active]:text-[#00FF80] data-[state=active]:bg-transparent data-[state=active]:shadow-none px-6 py-3"
            >
              Thông tin
            </TabsTrigger>
          </TabsList>

          <TabsContent value="top-songs" className="mt-6">
            <div className="space-y-1">
              {artist.songs.map((song: any, index: any) => (
                <SongCard key={song.id} song={song} index={index} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="albums" className="mt-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {artist.albums.map((album: IAlbumCard) => (
                <AlbumCard key={album.id} album={album} />
              ))}
            </div>
            {artist.albums.length === 0 && (
              <p className="text-gray-400 text-center py-12">
                Không có album nào
              </p>
            )}
          </TabsContent>

          <TabsContent value="about" className="mt-6 flex flex-col gap-3">
            <div className=" flex-col w-full flex gap-2">
              <h3 className="text-white mb-4">About {artist.name}</h3>
              <p className="text-gray-300 leading-relaxed">{artist.bio}</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-gradient-to-br from-blue-900/20 to-blue-700/10 border-blue-700/30 hover:shadow-[0_0_30px_rgba(59,130,246,0.2)] transition-all">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-400 mb-1">
                          Người nghe hàng tháng
                        </p>
                        <p
                          className="text-3xl text-white"
                          style={{ fontWeight: "bold" }}
                        >
                          {mountlyView?.view
                            ? formatNumber(mountlyView?.view)
                            : 0}
                        </p>
                      </div>
                      <div className="bg-blue-500/20 p-4 rounded-full">
                        <Headphones className="w-8 h-8 text-blue-400" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-900/20 to-[#00FF80]/10 border-[#00FF80]/30 hover:shadow-[0_0_30px_rgba(0,255,128,0.2)] transition-all">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-400 mb-1">Followers</p>
                        <p
                          className="text-3xl text-white"
                          style={{ fontWeight: "bold" }}
                        >
                          {formatFollowers(artist?.followerCount)}
                        </p>
                      </div>
                      <div className="bg-[#00FF80]/20 p-4 rounded-full">
                        <Users className="w-8 h-8 text-[#00FF80]" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div className="flex min-w-fitjustify-between w-full gap-2">
                <Link
                  className="bg-gray-900 border-gray-700  w-1/2 p-2 text-lg rounded-lg flex gap-2 items-center "
                  to="https://gemini.google.com/app/0568c7766602f495"
                >
                  <Instagram className="text-pink-500" />
                  <p className="">Instagram </p>
                </Link>
                <Link
                  className="bg-gray-900 border-gray-700  w-1/2 p-2 text-lg rounded-xl flex gap-2 items-center "
                  to="https://gemini.google.com/app/0568c7766602f495"
                >
                  <Instagram className="text-pink-500" />
                  <p className="">Instagram </p>
                </Link>
                <Link
                  className="bg-gray-900 border-gray-700  w-1/2 p-2 text-lg rounded-xl flex gap-2 items-center "
                  to="https://gemini.google.com/app/0568c7766602f495"
                >
                  <Instagram className="text-pink-500" />
                  <p className="">Instagram </p>
                </Link>
                <Link
                  className="bg-gray-900 border-gray-700  w-1/2 p-2 text-lg rounded-xl flex gap-2 items-center "
                  to="https://gemini.google.com/app/0568c7766602f495"
                >
                  <Instagram className="text-pink-500" />
                  <p className="">Instagram </p>
                </Link>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
