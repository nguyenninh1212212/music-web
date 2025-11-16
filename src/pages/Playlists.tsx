import React, { useState } from "react";
import { PlaylistCard } from "../components/PlaylistCard";
// Sửa lỗi logic: Import thêm useMutation
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import playlistApi from "@/api/playlistApi";
import { DialogHeader } from "@/components/ui/dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@radix-ui/react-dialog"; // Đảm bảo import Dialog từ đây
import { Button } from "@/components/ui/button";
import { Music, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Playlists: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newPlaylist, setNewPlaylist] = useState<string>("");

  const queryClient = useQueryClient();

  const { data: playlistsData, isLoading } = useQuery({
    queryKey: ["playList"],
    queryFn: () => playlistApi.getUserPlaylists(),
  });

  const createPlaylistMutation = useMutation({
    mutationFn: (playlistData: string) => {
      return playlistApi.createPlaylist(playlistData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["playList"] });
      setIsDialogOpen(false);
      setNewPlaylist("");
    },
    onError: (error) => {
      console.error("Failed to create playlist", error);
    },
  });

  const handleCreatePlaylist = () => {
    if (newPlaylist.trim()) {
      createPlaylistMutation.mutate(newPlaylist);
    }
  };

  if (isLoading) {
    return <div className="p-8 text-white">Đang tải...</div>;
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <>
        <header className="border-b border-[#00FF80]/20 bg-black/40 backdrop-blur-lg sticky top-0 z-50">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3"></div>

              <DialogTrigger asChild>
                <Button className="bg-[#00FF80] hover:bg-[#00FF80]/90 text-black gap-2 shadow-lg shadow-[#00FF80]/20 border border-[#00FF80]/50">
                  <Plus className="w-4 h-4" />
                  Tạo Playlist
                </Button>
              </DialogTrigger>
            </div>
          </div>
        </header>

        <DialogContent className="bg-[#1a1a1a] border-[#00FF80]/30 text-white max-w-md w-full fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg shadow-lg shadow-[#00FF80]/20 p-4  z-10">
          <DialogHeader>
            <DialogTitle className="text-[#00FF80]">
              Tạo Playlist Mới
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Tạo một playlist mới để lưu trữ các bài hát yêu thích của bạn
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-300">
                Tên Playlist
              </Label>
              <Input
                id="name"
                placeholder="Nhập tên playlist..."
                value={newPlaylist}
                onChange={(e) => setNewPlaylist(e.target.value)}
                className="bg-black/50 border-[#00FF80]/30 text-white placeholder:text-gray-500 focus:border-[#00FF80] focus:ring-[#00FF80]/20"
                disabled={createPlaylistMutation.isPending}
              />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white"
              disabled={createPlaylistMutation.isPending}
            >
              Hủy
            </Button>
            <Button
              onClick={handleCreatePlaylist}
              className="bg-[#00FF80] hover:bg-[#00FF80]/90 text-black shadow-lg shadow-[#00FF80]/20"
              disabled={createPlaylistMutation.isPending}
            >
              {createPlaylistMutation.isPending
                ? "Đang tạo..."
                : "Tạo Playlist"}
            </Button>
          </div>
        </DialogContent>

        <div className="p-8 pb-32">
          <div className="mb-8">
            <h1 className="text-white mb-2">Danh sách phát của bạn</h1>
            <p className="text-gray-400">Bộ sưu tập nhạc yêu thích của bạn </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {/* SỬA: Map qua playlistsData */}
            {playlistsData?.map(
              (
                playlist: any // Dùng any hoặc interface Playlist
              ) => (
                <PlaylistCard key={playlist.id} playlist={playlist} />
              )
            )}
          </div>
        </div>
      </>
    </Dialog>
  );
};
