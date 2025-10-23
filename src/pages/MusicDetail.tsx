import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { mockSongs } from "../lib/mockData";
import { useMusicPlayer } from "../contexts/MusicPlayerContext";
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Heart,
  Repeat,
  Shuffle,
  Volume2,
} from "lucide-react";
import { Slider } from "../components/ui/slider";

export const MusicDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const song = mockSongs.find((s) => s.id === id);
  const { isPlaying, togglePlay, volume, setVolume } = useMusicPlayer();
  const [isLiked, setIsLiked] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);

  if (!song) {
    return <div className="p-8 text-white">Song not found</div>;
  }

  const mockLyrics = [
    "In the neon glow of midnight",
    "Dancing shadows come alive",
    "Electric dreams and city lights",
    "This is where we thrive",
    "",
    "Feel the rhythm in your soul",
    "Let the music take control",
    "We're alive, we're electrified",
    "Together we will shine",
    "",
    "Through the darkness, through the night",
    "We'll be dancing in the light",
    "Hearts are beating, souls ignite",
    "This feeling is so right",
  ];

  return (
    <div className="min-h-screen pb-32 relative overflow-hidden">
      {/* Blurred Background */}
      <div
        className="absolute inset-0 bg-cover bg-center blur-3xl opacity-20"
        style={{ backgroundImage: `url(${song.coverImage})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A]/50 via-[#0A0A0A]/80 to-[#0A0A0A]" />

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto p-8">
        <div className="grid md:grid-cols-2 gap-12 mb-12">
          {/* Album Art */}
          <div className="flex flex-col items-center">
            <img
              src={song.coverImage}
              alt={song.title}
              className="w-full max-w-lg aspect-square object-cover rounded-2xl shadow-2xl ring-2 ring-[#00FF80]/30 mb-8"
            />

            {/* Song Info */}
            <div className="text-center">
              <h1 className="text-white mb-2">{song.title}</h1>
              <button
                onClick={() => navigate(`/artist/${song.artistId}`)}
                className="text-gray-300 hover:text-[#00FF80] transition-colors mb-4"
              >
                {song.artist}
              </button>
              <p className="text-gray-400">{song.album}</p>
            </div>
          </div>

          {/* Lyrics */}
          <div className="flex flex-col">
            <h2 className="text-white mb-6">Lyrics</h2>
            <div className="bg-gray-900/30 rounded-2xl p-8 border border-gray-800 flex-1 overflow-y-auto max-h-[600px]">
              <div className="space-y-4">
                {mockLyrics.map((line, index) => (
                  <p
                    key={index}
                    className={`${
                      line === "" ? "h-4" : "text-gray-300 leading-relaxed"
                    }`}
                  >
                    {line}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Player Controls */}
        <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-8 border border-gray-800">
          {/* Progress Bar */}
          <div className="mb-8">
            <Slider value={[33]} max={100} step={0.1} className="w-full" />
            <div className="flex justify-between text-sm text-gray-400 mt-2">
              <span>1:23</span>
              <span>
                {Math.floor(song.duration / 60)}:
                {(song.duration % 60).toString().padStart(2, "0")}
              </span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-6 mb-8">
            <button
              onClick={() => setIsShuffle(!isShuffle)}
              className={`transition-colors ${
                isShuffle ? "text-[#00FF80]" : "text-gray-400 hover:text-white"
              }`}
            >
              <Shuffle className="w-5 h-5" />
            </button>

            <button className="text-gray-400 hover:text-white transition-colors">
              <SkipBack className="w-6 h-6" />
            </button>

            <button
              onClick={togglePlay}
              className="w-16 h-16 rounded-full bg-[#00FF80] hover:bg-[#00FF80]/80 flex items-center justify-center transition-all duration-200 shadow-[0_0_30px_rgba(0,255,128,0.6)] hover:shadow-[0_0_40px_rgba(0,255,128,0.8)]"
            >
              {isPlaying ? (
                <Pause className="w-7 h-7 text-black" />
              ) : (
                <Play className="w-7 h-7 text-black ml-1" />
              )}
            </button>

            <button className="text-gray-400 hover:text-white transition-colors">
              <SkipForward className="w-6 h-6" />
            </button>

            <button
              onClick={() => setIsRepeat(!isRepeat)}
              className={`transition-colors ${
                isRepeat ? "text-[#00FF80]" : "text-gray-400 hover:text-white"
              }`}
            >
              <Repeat className="w-5 h-5" />
            </button>
          </div>

          {/* Additional Controls */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setIsLiked(!isLiked)}
              className={`transition-colors ${
                isLiked ? "text-[#00FF80]" : "text-gray-400 hover:text-white"
              }`}
            >
              <Heart
                className="w-6 h-6"
                fill={isLiked ? "currentColor" : "none"}
              />
            </button>

            <div className="flex items-center gap-3 w-48">
              <Volume2 className="w-5 h-5 text-gray-400" />
              <Slider
                value={[volume]}
                onValueChange={(value: any) => setVolume(value[0])}
                max={100}
                step={1}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
