import artistApi from "@/api/artist";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export const useArtist = () => {
  // CREATE
  const registerArtist = useMutation({
    mutationFn: async (payload: FormData) => artistApi.createArtist(payload),
    onSuccess: () => {
      toast.success("Tạo nghe si thành công!");
    },
    onError: () => {
      toast.error("Tạo nghe si thất bại!");
    },
  });

  // UPDATE
  const updateArtist = useMutation({
    mutationFn: async (payload: FormData) =>
      artistApi.updateArtistProfile(payload),
    onSuccess: () => {
      toast.success("Cập profile hát thành công!");
    },
    onError: () => {
      toast.error("Cập nhật profile thất bại!");
    },
  });

  return {
    updateArtist,
    registerArtist,
  };
};
