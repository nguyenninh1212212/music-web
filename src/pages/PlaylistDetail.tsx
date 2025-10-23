import React from 'react';
import { useParams } from 'react-router-dom';
import { mockPlaylists } from '../lib/mockData';
import { SongCard } from '../components/SongCard';
import { Play, Clock } from 'lucide-react';
import { useMusicPlayer } from '../contexts/MusicPlayerContext';

export const PlaylistDetail: React.FC = () => {
  const { id } = useParams();
  const playlist = mockPlaylists.find(p => p.id === id);
  const { playSong, setQueue } = useMusicPlayer();

  if (!playlist) {
    return <div className="p-8 text-white">Playlist not found</div>;
  }

  const handlePlayAll = () => {
    setQueue(playlist.songs);
    playSong(playlist.songs[0]);
  };

  const totalDuration = playlist.songs.reduce((acc, song) => acc + song.duration, 0);
  const hours = Math.floor(totalDuration / 3600);
  const minutes = Math.floor((totalDuration % 3600) / 60);

  return (
    <div className="pb-32">
      {/* Header */}
      <div className="bg-gradient-to-b from-gray-800/50 to-transparent p-8 mb-8">
        <div className="flex items-end gap-6">
          <img 
            src={playlist.coverImage} 
            alt={playlist.title}
            className="w-60 h-60 rounded-lg shadow-2xl"
          />
          <div className="flex-1">
            <p className="text-gray-400 mb-2">Playlist</p>
            <h1 className="text-white mb-4">{playlist.title}</h1>
            {playlist.description && (
              <p className="text-gray-300 mb-4">{playlist.description}</p>
            )}
            <div className="flex items-center gap-2 text-gray-400">
              <span>{playlist.songCount} songs</span>
              <span>•</span>
              <span>{hours > 0 ? `${hours} hr ` : ''}{minutes} min</span>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="px-8 mb-6">
        <button 
          onClick={handlePlayAll}
          className="flex items-center gap-2 px-8 py-3 bg-[#00FF80] hover:bg-[#00FF80]/80 text-black rounded-full transition-all duration-300 shadow-[0_0_25px_rgba(0,255,128,0.6)] hover:shadow-[0_0_35px_rgba(0,255,128,0.8)]"
        >
          <Play className="w-5 h-5 ml-0.5" />
          <span>Play All</span>
        </button>
      </div>

      {/* Track List */}
      <div className="px-8">
        <div className="flex items-center gap-4 px-2 pb-2 border-b border-gray-800 mb-2 text-gray-400 text-sm">
          <span className="w-6 text-center">#</span>
          <span className="w-12"></span>
          <span className="flex-1">Title</span>
          <Clock className="w-4 h-4 mr-12" />
        </div>
        <div className="space-y-1">
          {playlist.songs.map((song, index) => (
            <SongCard key={song.id} song={song} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
};
