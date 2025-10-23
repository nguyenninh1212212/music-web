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
import { AlbumCard } from "../components/AlbumCard";
import { PlaylistCard } from "../components/PlaylistCard";
import {
  mockSongs,
  mockArtists,
  mockAlbums,
  mockPlaylists,
} from "../lib/mockData";

export const Search: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter results based on search query
  const filteredResults = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();

    if (!query) {
      return {
        songs: [],
        artists: [],
        albums: [],
        playlists: [],
      };
    }

    return {
      songs: mockSongs.filter(
        (song) =>
          song.title.toLowerCase().includes(query) ||
          song.artist.toLowerCase().includes(query) ||
          song.album.toLowerCase().includes(query)
      ),
      artists: mockArtists.filter((artist) =>
        artist.name.toLowerCase().includes(query)
      ),
      albums: mockAlbums.filter(
        (album) =>
          album.title.toLowerCase().includes(query) ||
          album.artist.toLowerCase().includes(query)
      ),
      playlists: mockPlaylists.filter((playlist) =>
        playlist.title.toLowerCase().includes(query)
      ),
    };
  }, [searchQuery]);

  const totalResults =
    filteredResults.songs.length +
    filteredResults.artists.length +
    filteredResults.albums.length +
    filteredResults.playlists.length;

  return (
    <div className="min-h-screen pb-32 px-8 py-8">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-white mb-2">Tìm kiếm</h1>
        <p className="text-gray-400">
          Tìm bài hát yêu thich, nghệ sĩ, albums, và playlists
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-8">
        <div className="relative max-w-2xl">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm bài hát, nghệ sĩ, album hoặc danh sách phát...s, artists, albums, or playlists..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-900/50 border border-gray-800 rounded-xl pl-12 pr-4 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-[#00FF80] focus:shadow-[0_0_20px_rgba(0,255,128,0.2)] transition-all duration-200"
          />
        </div>
      </div>

      {/* Results Section */}
      {!searchQuery ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-20 h-20 rounded-full bg-gray-900/50 border border-gray-800 flex items-center justify-center mb-4">
            <SearchIcon className="w-10 h-10 text-gray-600" />
          </div>
          <h2 className="text-white mb-2">Bắt đầu tìm</h2>
          <p className="text-gray-400 text-center max-w-md">
            Nhập tên bài hát, nghệ sĩ, album hoặc danh sách phát để tìm những gì
            bạn đang tìm kiếm
          </p>
        </div>
      ) : totalResults === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-20 h-20 rounded-full bg-gray-900/50 border border-gray-800 flex items-center justify-center mb-4">
            <SearchIcon className="w-10 h-10 text-gray-600" />
          </div>
          <h2 className="text-white mb-2">Không tìm thấy kết quả</h2>
          <p className="text-gray-400 text-center max-w-md">
            Hãy thử tìm kiếm bằng các từ khóa khác nhau hoặc kiểm tra chính tả
            của bạn
          </p>
        </div>
      ) : (
        <div>
          <div className="mb-6">
            <p className="text-gray-400">
              Tìm thấy {totalResults} kết quả{totalResults !== 1 ? "s" : ""} for
              "{searchQuery}"
            </p>
          </div>

          <Tabs defaultValue="songs" className="w-full">
            <TabsList className="bg-gray-900/50 border border-gray-800 p-1 mb-8">
              <TabsTrigger
                value="songs"
                className="data-[state=active]:bg-[#00FF80]/10 data-[state=active]:text-[#00FF80] data-[state=active]:shadow-[0_0_15px_rgba(0,255,128,0.3)]"
              >
                <Music className="w-4 h-4 mr-2" />
                Songs ({filteredResults.songs.length})
              </TabsTrigger>
              <TabsTrigger
                value="artists"
                className="data-[state=active]:bg-[#00FF80]/10 data-[state=active]:text-[#00FF80] data-[state=active]:shadow-[0_0_15px_rgba(0,255,128,0.3)]"
              >
                <Mic2 className="w-4 h-4 mr-2" />
                Artists ({filteredResults.artists.length})
              </TabsTrigger>
              <TabsTrigger
                value="albums"
                className="data-[state=active]:bg-[#00FF80]/10 data-[state=active]:text-[#00FF80] data-[state=active]:shadow-[0_0_15px_rgba(0,255,128,0.3)]"
              >
                <Disc className="w-4 h-4 mr-2" />
                Albums ({filteredResults.albums.length})
              </TabsTrigger>
              <TabsTrigger
                value="playlists"
                className="data-[state=active]:bg-[#00FF80]/10 data-[state=active]:text-[#00FF80] data-[state=active]:shadow-[0_0_15px_rgba(0,255,128,0.3)]"
              >
                <ListMusic className="w-4 h-4 mr-2" />
                Playlists ({filteredResults.playlists.length})
              </TabsTrigger>
            </TabsList>

            {/* Songs Tab */}
            <TabsContent value="songs" className="mt-0">
              {filteredResults.songs.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Music className="w-12 h-12 text-gray-600 mb-3" />
                  <p className="text-gray-400">Không thấy bài hát</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredResults.songs.map((song) => (
                    <SongCard key={song.id} song={song} />
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Artists Tab */}
            <TabsContent value="artists" className="mt-0">
              {filteredResults.artists.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Mic2 className="w-12 h-12 text-gray-600 mb-3" />
                  <p className="text-gray-400">Không thấy nghệ sĩ</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                  {filteredResults.artists.map((artist) => (
                    <ArtistCard key={artist.id} artist={artist} />
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Albums Tab */}
            <TabsContent value="albums" className="mt-0">
              {filteredResults.albums.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Disc className="w-12 h-12 text-gray-600 mb-3" />
                  <p className="text-gray-400">Không thấy album</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                  {filteredResults.albums.map((album) => (
                    <AlbumCard key={album.id} album={album} />
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Playlists Tab */}
            <TabsContent value="playlists" className="mt-0">
              {filteredResults.playlists.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <ListMusic className="w-12 h-12 text-gray-600 mb-3" />
                  <p className="text-gray-400">Không thấy playlist</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                  {filteredResults.playlists.map((playlist) => (
                    <PlaylistCard key={playlist.id} playlist={playlist} />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
};
