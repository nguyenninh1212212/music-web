import { useMutation } from "@tanstack/react-query";
import { logPurchase } from "@/api/nft";
import { toast } from "sonner";

interface LogPurchasePayload {
  eventId: string;
  tokenId: string;
  txHash: string;
}

/**
 * Hook này gói hàm logPurchase (POST /nft/log-purchase)
 * để dùng trong React component qua React Query
 */
export const useLogPurchase = () => {
  return useMutation({
    mutationFn: (payload: LogPurchasePayload) => logPurchase(payload),
    onError: () => {
      toast.error("Faile Buy");
    },
  });
};
