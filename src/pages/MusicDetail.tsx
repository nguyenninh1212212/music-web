import React, { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
import { useQuery } from "@tanstack/react-query";
import songApi from "@/api/songs";
import Loading from "@/components/Loading";

interface SongType {
  id: string;
  title: string;
  song: string;
  duration: number;
  coverImage: string;
  isFavourite: boolean;
  artist: {
    id: string;
    stageName: string;
  };
  album: {
    title: string;
  };
  ads?: {
    type: "AUDIO";
    mediaUrl: string;
    redirectUrl: string;
    title: string;
  };
  previousSongId?: string | null;
  nextSongId?: string | null;
}

export const MusicDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [currentSongId, setCurrentSongId] = useState<string | null>(id || null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(70);
  const [progress, setProgress] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isAdPlaying, setIsAdPlaying] = useState(false);
  const [currentAudioSrc, setCurrentAudioSrc] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const { data: song, isLoading } = useQuery<SongType>({
    queryKey: ["song", currentSongId],
    queryFn: () =>
      currentSongId
        ? songApi.getSongById(currentSongId)
        : Promise.resolve(null),
    enabled: !!currentSongId,
  });

  // Khi song load xong
  useEffect(() => {
    if (!song) return;
    setIsLiked(song.isFavourite);
    setIsAdPlaying(false);
    setCurrentAudioSrc(song.song);
    setProgress(0);
    setIsPlaying(true);
  }, [song]);

  // Play/pause & volume
  useEffect(() => {
    if (!audioRef.current || !currentAudioSrc) return;
    const audio = audioRef.current;
    audio.src = currentAudioSrc;
    audio.volume = volume / 100;
    if (isPlaying) audio.play().catch(() => {});
    else audio.pause();
  }, [currentAudioSrc, isPlaying, volume]);

  // Cập nhật progress
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setProgress(audio.currentTime);
    };

    const handleEnded = () => {
      if (isAdPlaying) {
        // Quảng cáo xong -> phát bài tiếp theo
        setIsAdPlaying(false);
        if (song?.nextSongId) {
          setCurrentSongId(song.nextSongId);
        } else {
          setCurrentSongId(null);
          setIsPlaying(false);
        }
      } else if (song?.ads) {
        // Bài hát kết thúc -> phát quảng cáo
        setIsAdPlaying(true);
        setCurrentAudioSrc(song.ads.mediaUrl);
        setIsPlaying(true);
      } else if (isRepeat) {
        audio.play().catch(() => {});
      } else if (song?.nextSongId) {
        // Phát bài tiếp theo
        setCurrentSongId(song.nextSongId);
      } else {
        setCurrentSongId(null);
        setIsPlaying(false);
      }
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [song, isAdPlaying, isRepeat]);

  const handleSeek = (value: number) => {
    if (isAdPlaying) return;
    if (audioRef.current && audioRef.current.duration) {
      audioRef.current.currentTime = value;
      setProgress(value);
    }
  };

  if (isLoading) return <Loading />;
  if (!song) return <div className="p-8 text-white">Song not found</div>;

  const duration = audioRef.current?.duration || song.duration || 0;

  return (
    <div className="min-h-screen pb-32 relative overflow-hidden">
      <audio ref={audioRef} preload="auto" />

      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center blur-3xl opacity-20"
        style={{ backgroundImage: `url(${song.coverImage})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A]/50 via-[#0A0A0A]/80 to-[#0A0A0A]" />

      <div className="relative z-10 max-w-6xl mx-auto p-8">
        <div className="grid md:grid-cols-2 gap-12 mb-12">
          {/* Album */}
          <div className="flex flex-col items-center">
            <img
              src={song.coverImage}
              alt={song.title}
              className="w-full max-w-lg aspect-square object-cover rounded-2xl shadow-2xl ring-2 ring-[#00FF80]/30 mb-8"
            />
            <div className="text-center">
              <h1 className="text-white mb-2">{song.title}</h1>
              <button
                onClick={() => navigate(`/artist/${song.artist.id}`)}
                className="text-gray-300 hover:text-[#00FF80] transition-colors mb-2"
              >
                {song.artist.stageName}
              </button>
              <p className="text-gray-400">{song.album.title}</p>
            </div>
          </div>

          {/* Lyrics */}
          <div className="flex flex-col">
            <h2 className="text-white mb-6">Lyrics</h2>
            <div className="bg-gray-900/30 rounded-2xl p-8 border border-gray-800 flex-1 overflow-y-auto max-h-[600px]">
              <div className="space-y-4">{/* Render lyrics */}</div>
            </div>
          </div>
        </div>

        {/* Player Controls */}
        <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-8 border border-gray-800">
          {/* Progress */}
          <div className="mb-4">
            <Slider
              value={[progress]}
              max={duration}
              step={0.1}
              onValueChange={(v: any) => handleSeek(v[0])}
            />
            <div className="flex justify-between text-sm text-gray-400 mt-1">
              <span>
                {Math.floor(progress / 60)}:
                {String(Math.floor(progress % 60)).padStart(2, "0")}
              </span>
              <span>
                {Math.floor(duration / 60)}:
                {String(Math.floor(duration % 60)).padStart(2, "0")}
              </span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-6 mb-4">
            <button
              onClick={() =>
                currentSongId &&
                song.previousSongId &&
                setCurrentSongId(song.previousSongId)
              }
              disabled={!song.previousSongId || isAdPlaying}
              className="text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <SkipBack className="w-5 h-5" />
            </button>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-12 h-12 rounded-full bg-[#00FF80] flex items-center justify-center shadow-[0_0_20px_rgba(0,255,128,0.5)]"
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 text-black" />
              ) : (
                <Play className="w-5 h-5 text-black" />
              )}
            </button>
            <button
              onClick={() =>
                currentSongId &&
                song.nextSongId &&
                setCurrentSongId(song.nextSongId)
              }
              disabled={!song.nextSongId || isAdPlaying}
              className="text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <SkipForward className="w-5 h-5" />
            </button>
            <button
              onClick={() => setIsRepeat(!isRepeat)}
              className={
                isRepeat ? "text-[#00FF80]" : "text-gray-400 hover:text-white"
              }
            >
              <Repeat className="w-5 h-5" />
            </button>
            <button
              onClick={() => setIsShuffle(!isShuffle)}
              className={
                isShuffle ? "text-[#00FF80]" : "text-gray-400 hover:text-white"
              }
            >
              <Shuffle className="w-5 h-5" />
            </button>
          </div>

          {/* Like & Volume */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setIsLiked(!isLiked)}
              className={
                isLiked ? "text-[#00FF80]" : "text-gray-400 hover:text-white"
              }
            >
              <Heart className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 w-48">
              <Volume2 className="w-5 h-5 text-gray-400" />
              <Slider
                value={[volume]}
                max={100}
                step={1}
                onValueChange={(v: any) => setVolume(v[0])}
              />
            </div>
          </div>

          {/* Ads Link */}
          {song.ads && !isAdPlaying && (
            <div className="mt-4 text-green-400">
              <a
                href={song.ads.redirectUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                {song.ads.title}
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
