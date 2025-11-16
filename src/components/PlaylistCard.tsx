import React, { useState } from "react";
import { Playlist } from "../lib/types";
import { Play, Music, X } from "lucide-react"; // 1. Thêm icon X
import { useNavigate } from "react-router-dom";
import { getImageClass } from "@/util/help";

// 2. Import các component cần thiết
import { useMutation, useQueryClient } from "@tanstack/react-query";
import playlistApi from "@/api/playlistApi"; // Giả sử bạn có file này
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

interface PlaylistCardProps {
  playlist: Playlist;
}

export const PlaylistCard: React.FC<PlaylistCardProps> = ({ playlist }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // State để kiểm soát việc đóng/mở dialog
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  const { id, name, songCount, songs = [] } = playlist;
  const songCovers = songs.slice(0, 4);
  const count = songCovers.length;

  const deletePlaylistMutation = useMutation({
    mutationFn: (playlistId: string) => {
      return playlistApi.deletePlaylist(playlistId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["playList"] });
      setIsAlertOpen(false); // Đóng dialog
    },
    onError: (error) => {
      console.error("Xóa playlist thất bại", error);
      setIsAlertOpen(false); // Đóng dialog
    },
  });

  // Hàm xử lý khi người dùng xác nhận xóa
  const handleConfirmDelete = (e: React.MouseEvent) => {
    e.stopPropagation(); // Ngăn card điều hướng
    deletePlaylistMutation.mutate(id);
  };

  return (
    // 4. Bọc toàn bộ card bằng AlertDialog
    <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
      <div
        onClick={() => navigate(`/playlist/${id}`)}
        // Thêm 'relative' để định vị nút X
        className="group relative bg-gray-900/30 p-4 rounded-lg hover:bg-gray-800/50 transition-all duration-300 cursor-pointer"
      >
        {/* 5. Nút Xóa (AlertDialogTrigger) */}
        <AlertDialogTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/50 text-gray-300 hover:bg-black/80 hover:text-white
                       opacity-0 group-hover:opacity-100 transition-opacity z-10"
            onClick={(e) => {
              e.stopPropagation(); // Ngăn card điều hướng
            }}
          >
            <X className="w-4 h-4" />
          </Button>
        </AlertDialogTrigger>

        {/* --- Nội dung card như cũ --- */}
        <div className="relative mb-4 aspect-square w-full rounded-md overflow-hidden bg-gray-800 flex items-center justify-center">
          {count === 0 ? (
            <Music className="w-1/2 h-1/2 text-gray-600" />
          ) : (
            songCovers.map((song, index) => (
              <img
                key={song.id}
                src={song.coverImage}
                className={getImageClass(index, count)}
              />
            ))
          )}

          <button
            className="absolute bottom-2 right-2 w-12 h-12 rounded-full bg-[#00FF80] flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 shadow-[0_0_20px_rgba(0,255,128,0.6)]"
            onClick={(e) => {
              e.stopPropagation();
              // Xử lý logic play
            }}
          >
            <Play className="w-5 h-5 text-black ml-0.5" />
          </button>
        </div>

        <h3 className="text-white truncate mb-1">{name}</h3>
        <p className="text-gray-400 text-sm">{songCount} Bài hát</p>
      </div>

      {/* 6. Nội dung Dialog xác nhận */}
      <AlertDialogContent
        className="bg-[#1a1a1a] border-[#00FF80]/30 text-white"
        onClick={(e: any) => e.stopPropagation()} // Ngăn dialog đóng khi click ra ngoài (nếu cần)
      >
        <AlertDialogHeader>
          <AlertDialogTitle>Xác nhận xóa playlist?</AlertDialogTitle>
          <AlertDialogDescription className="text-gray-400">
            Bạn có chắc chắn muốn xóa playlist "{name}" không? Hành động này
            không thể hoàn tác.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white"
            disabled={deletePlaylistMutation.isPending}
          >
            Hủy
          </AlertDialogCancel>
          <AlertDialogAction
            className="bg-red-600 hover:bg-red-700 text-white"
            onClick={handleConfirmDelete}
            disabled={deletePlaylistMutation.isPending}
          >
            {deletePlaylistMutation.isPending ? "Đang xóa..." : "Xóa"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
