import React, { createContext, useContext, useState, ReactNode } from "react";

// --- Interface đã được đơn giản hóa ---
interface MusicPlayerContextType {
  currentSongId: string | null;
  isPlaying: boolean;
  volume: number;
  progress: number;
  // playSong giờ chỉ nhận 1 ID (hoặc null để dừng)
  playSong: (songId: string | null) => void;
  togglePlay: () => void;
  setVolume: (volume: number) => void;
  setProgress: (progress: number) => void;

  isPlayerOpen: boolean; // <--- thêm
  togglePlayer: () => void; // <--- thêm
  openPlayer: () => void; // <--- thêm
  closePlayer: () => void;
}

const MusicPlayerContext = createContext<MusicPlayerContextType | undefined>(
  undefined
);

export const useMusicPlayer = () => {
  const context = useContext(MusicPlayerContext);
  if (!context) {
    throw new Error("useMusicPlayer must be used within MusicPlayerProvider");
  }
  return context;
};

interface MusicPlayerProviderProps {
  children: ReactNode;
}

export const MusicPlayerProvider: React.FC<MusicPlayerProviderProps> = ({
  children,
}) => {
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);

  const togglePlayer = () => setIsPlayerOpen((p) => !p);
  const openPlayer = () => setIsPlayerOpen(true);
  const closePlayer = () => setIsPlayerOpen(false);
  const [currentSongId, setCurrentSongId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolumeState] = useState(70);
  const [progress, setProgressState] = useState(0);

  // --- Hàm playSong đã được đơn giản hóa ---
  const playSong = (songId: string | null) => {
    if (songId) {
      setCurrentSongId(songId);
      setIsPlaying(true);
      setProgressState(0);
    } else {
      // Cho phép gọi playSong(null) để dừng
      setCurrentSongId(null);
      setIsPlaying(false);
    }
  };

  const togglePlay = () => {
    // Chỉ toggle khi có bài hát
    if (currentSongId) {
      setIsPlaying(!isPlaying);
    }
  };

  const setVolume = (vol: number) => {
    setVolumeState(vol);
  };

  const setProgress = (prog: number) => {
    setProgressState(prog);
  };

  return (
    <MusicPlayerContext.Provider
      value={{
        currentSongId,
        isPlaying,
        volume,
        progress,
        playSong,
        togglePlay,
        setVolume,
        setProgress,
        isPlayerOpen,
        togglePlayer,
        openPlayer,
        closePlayer,
      }}
    >
      {children}
    </MusicPlayerContext.Provider>
  );
};
