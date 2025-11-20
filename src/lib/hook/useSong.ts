import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import songApi from "@/api/songs";
import { ICreateSong } from "../types";

export const useSong = () => {
  // CREATE
  const createSong = useMutation({
    mutationFn: async (payload: FormData) => songApi.createSong(payload),
    onSuccess: () => {
      toast.success("Tạo bài hát thành công!");
    },
    onError: () => {
      toast.error("Tạo bài hát thất bại!");
    },
  });

  createSong

  // UPDATE
  const updateSong = useMutation({
    mutationFn: async ({
      songId,
      payload,
    }: {
      songId: string;
      payload: ICreateSong;
    }) => songApi.updateSong(songId, payload),
    onSuccess: () => {
      toast.success("Cập nhật bài hát thành công!");
    },
    onError: () => {
      toast.error("Cập nhật bài hát thất bại!");
    },
  });

  // REMOVE
  const removeSong = useMutation({
    mutationFn: async (songId: string) => songApi.removeSong(songId),
    onSuccess: () => {
      toast.success("Xóa bài hát thành công!");
    },
    onError: () => {
      toast.error("Xóa bài hát thất bại!");
    },
  });

  // RESTORE (nếu cần)
  const restoreSong = useMutation({
    mutationFn: async (songId: string) => songApi.restoreSong(songId),
    onSuccess: () => {
      toast.success("Khôi phục bài hát thành công!");
    },
    onError: () => {
      toast.error("Khôi phục bài hát thất bại!");
    },
  });

  return {
    createSong,
    updateSong,
    removeSong,
    restoreSong,
  };
};
