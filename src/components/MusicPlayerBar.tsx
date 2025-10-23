import React, { useEffect, useRef, useState } from "react";
import { useMusicPlayer } from "../contexts/MusicPlayerContext";
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  Heart,
} from "lucide-react";
import { Slider } from "./ui/slider";
import songApi from "@/api/songs";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { ISongBar } from "@/lib/types";

type SongApiResponse = ISongBar & {
  previousSongId: string | null;
  nextSongId: string | null;
  ads: string | null;
  isVipOnly: boolean;
  isFavourite: boolean;
  artist: {
    id: string;
    stageName: string;
    avatarUrl: string;
  };
};

export const MusicPlayerBar: React.FC = () => {
  const {
    currentSongId,
    isPlaying,
    volume,
    togglePlay,
    setVolume,
    setProgress,
    playSong,
  } = useMusicPlayer();

  const [localProgress, setLocalProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // === STATE MỚI ĐỂ QUẢN LÝ QUẢNG CÁO ===
  const [isAdPlaying, setIsAdPlaying] = useState(false);
  const [currentAudioSrc, setCurrentAudioSrc] = useState("");

  const { data: currentSongData, isLoading } = useQuery<SongApiResponse>({
    queryKey: ["song", currentSongId],
    queryFn: () => {
      if (!currentSongId) return Promise.resolve(null);
      return songApi.getSongById(currentSongId);
    },
    select: (response: any) => response.data || response,
    enabled: !!currentSongId,
    placeholderData: keepPreviousData,
    staleTime: Infinity,
    gcTime: Infinity,
  });

  useEffect(() => {
    if (currentSongData?.song) {
      setIsAdPlaying(false);
      setCurrentAudioSrc(currentSongData.song);
    }
  }, [currentSongData]);

  // 2. useEffect: Xử lý audio SRC và TRẠNG THÁI (isPlaying)
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (currentAudioSrc && audio.src !== currentAudioSrc) {
      audio.src = currentAudioSrc;
    }

    if (isPlaying) {
      audio.play().catch((e) => console.error("Audio play error:", e));
    } else {
      audio.pause();
    }
  }, [currentAudioSrc, isPlaying]);

  // 3. useEffect: Xử lý Volume (Không đổi)
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  // 4. useEffect: Xử lý PROGRESS và LOGIC KẾT THÚC (handleEnded)
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      if (audio.duration > 0) {
        const percent = (audio.currentTime / audio.duration) * 100;
        setLocalProgress(percent || 0);
        setProgress(percent || 0);
      }
    };

    // --- LOGIC QUẢNG CÁO VÀ CHUYỂN BÀI ---
    const handleEnded = () => {
      if (isAdPlaying) {
        setIsAdPlaying(false);
        if (currentSongData?.nextSongId) {
          playSong(currentSongData.nextSongId);
        } else {
          playSong(null);
        }
      } else {
        if (currentSongData?.ads) {
          setIsAdPlaying(true);
          setCurrentAudioSrc(currentSongData.ads);
        } else {
          if (currentSongData?.nextSongId) {
            playSong(currentSongData.nextSongId);
          } else {
            playSong(null);
          }
        }
      }
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);
    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [setProgress, playSong, currentSongData, isAdPlaying]);

  // Xử lý Seek (chặn khi đang quảng cáo)
  const handleSeek = (value: number) => {
    if (isAdPlaying) return; // Không cho phép tua quảng cáo

    if (!audioRef.current || !audioRef.current.duration) return;
    const newTime = (audioRef.current.duration * value) / 100;
    audioRef.current.currentTime = newTime;
    setLocalProgress(value);
    setProgress(value);
  };

  if (!currentSongId) return null;

  if (isLoading || !currentSongData) {
    // (UI Loading không đổi)
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-[#0A0A0A] border-t border-gray-800 px-4 py-3 z-50 opacity-50">
        <div className="max-w-screen-2xl mx-auto h-14 flex items-center">
          <p className="text-white">Đang tải...</p>
        </div>
      </div>
    );
  }

  // Lấy thời lượng thực tế từ thẻ audio (sẽ đúng cho cả nhạc và ad)
  const audioDuration = audioRef.current?.duration || 0;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#0A0A0A] border-t border-gray-800 px-4 py-3 z-50">
      <audio ref={audioRef} preload="auto" />

      <div className="max-w-screen-2xl mx-auto flex items-center gap-4">
        {/* Song Info (Hiển thị thông tin ad) */}
        <div className="flex items-center gap-3 w-80">
          {isAdPlaying ? (
            <div className="w-14 h-14 rounded-lg bg-gray-700 flex items-center justify-center">
              <span className="text-xs">Ad</span>
            </div>
          ) : (
            <img
              src={currentSongData.coverImage}
              alt={currentSongData.title}
              className="w-14 h-14 rounded-lg object-cover"
            />
          )}

          <div className="flex-1 min-w-0">
            {isAdPlaying ? (
              <p className="text-white truncate font-bold">
                Đang phát quảng cáo...
              </p>
            ) : (
              <>
                <p className="text-white truncate">{currentSongData.title}</p>
                <p className="text-gray-400 text-sm truncate">
                  {currentSongData.artist?.stageName}
                </p>
              </>
            )}
          </div>
          <button
            disabled={isAdPlaying} // Vô hiệu hóa nút tim khi có ad
            className="text-gray-400 hover:text-[#00FF80] transition-colors disabled:opacity-30"
          >
            <Heart className="w-5 h-5" />
          </button>
        </div>

        {/* Player Controls (Vô hiệu hóa khi có ad) */}
        <div className="flex-1 flex flex-col items-center gap-2">
          <div className="flex items-center gap-4">
            <button
              onClick={() => playSong(currentSongData.previousSongId)}
              disabled={!currentSongData.previousSongId || isAdPlaying} // Vô hiệu hóa
              className="text-gray-400 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <SkipBack className="w-5 h-5" />
            </button>
            <button
              onClick={togglePlay} // Nút Play/Pause không bị vô hiệu hóa
              className="w-10 h-10 rounded-full bg-[#00FF80] hover:bg-[#00FF80]/80 flex items-center justify-center transition-all duration-200 shadow-[0_0_20px_rgba(0,255,128,0.5)] hover:shadow-[0_0_30px_rgba(0,255,128,0.7)]"
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 text-black" />
              ) : (
                <Play className="w-5 h-5 text-black ml-0.5" />
              )}
            </button>
            <button
              onClick={() => playSong(currentSongData.nextSongId)}
              disabled={!currentSongData.nextSongId || isAdPlaying} // Vô hiệu hóa
              className="text-gray-400 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <SkipForward className="w-5 h-5" />
            </button>
          </div>

          {/* Progress Bar (Vô hiệu hóa seek khi có ad) */}
          <div className="w-full flex items-center gap-2">
            <span className="text-xs text-gray-400 w-10 text-right">
              {Math.floor((audioRef.current?.currentTime || 0) / 60)}:
              {String(
                Math.floor((audioRef.current?.currentTime || 0) % 60)
              ).padStart(2, "0")}
            </span>
            <Slider
              value={[localProgress]}
              onValueChange={(value: any) => handleSeek(value[0])}
              max={100}
              step={0.1}
              disabled={isAdPlaying} // Vô hiệu hóa
              className="flex-1" // shadcn/ui sẽ tự đổi màu khi disabled
            />
            <span className="text-xs text-gray-400 w-10">
              {/* Sử dụng thời lượng từ audio element để nó đúng cho cả ad và nhạc */}
              {audioDuration
                ? Math.floor(audioDuration / 60) +
                  ":" +
                  String(Math.floor(audioDuration % 60)).padStart(2, "0")
                : "0:00"}
            </span>
          </div>
        </div>

        {/* Volume Control (Không đổi) */}
        <div className="flex items-center gap-2 w-40">
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
  );
};
