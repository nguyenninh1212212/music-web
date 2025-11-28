import { Calendar, MapPin, Coins, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ipfsToHttp } from "@/util/help";
import { IResellTicket } from "@/lib/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { buyResellTicket } from "@/api/nft";
import { toast } from "sonner";
import { useState } from "react";
import { ethers } from "ethers";
import ResaleMarketplaceABI from "@/abi/ResaleMarketplace.json";
import { useAuth } from "@/contexts/AuthContext";

interface ResellTicketCardProps {
  ticket: IResellTicket;
  resaleMarketplaceAddress: string;
}

export const ResellTicketCard = ({
  ticket,
  resaleMarketplaceAddress,
}: ResellTicketCardProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ resellTicketId }: { resellTicketId: string }) => {
      return buyResellTicket(resellTicketId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["nft-resell"] });

      toast.success("Mua vé thành công!");
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Không thể mua vé");
    },
  });

  const handleBuyResell = async () => {
    if (!window.ethereum) {
      toast.error("Vui lòng cài đặt MetaMask!");
      return;
    }

    if (!user) {
      toast.error("Vui lòng đăng nhập!");
      return;
    }

    setIsLoading(true);
    setLoadingMessage("Đang khởi tạo...");

    try {
      // 1. Initialize provider
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const buyerAddress = await signer.getAddress();

      if (!buyerAddress || buyerAddress === ethers.ZeroAddress) {
        throw new Error("Không thể lấy địa chỉ ví từ MetaMask");
      }

      console.log("🔍 Buyer address:", buyerAddress);

      // 2. Validate inputs
      if (!resaleMarketplaceAddress) {
        throw new Error("Địa chỉ marketplace không hợp lệ");
      }

      if (!ticket.event.contractAddress) {
        throw new Error("Địa chỉ contract không hợp lệ");
      }

      if (!ticket.tokenId) {
        throw new Error("Token ID không hợp lệ");
      }

      if (!ticket.price) {
        throw new Error("Giá vé không hợp lệ");
      }

      // 3. Parse price
      let priceWei: bigint;
      try {
        priceWei = ethers.parseEther(ticket.price);
      } catch (error) {
        throw new Error("Không thể chuyển đổi giá vé");
      }

      // 4. Check buyer balance
      setLoadingMessage("Đang kiểm tra số dư...");
      const balance = await provider.getBalance(buyerAddress);

      console.log("💰 Balance:", ethers.formatEther(balance), "ETH");
      console.log("💸 Price:", ethers.formatEther(priceWei), "ETH");

      if (balance < priceWei) {
        throw new Error(
          `Số dư không đủ!\n` +
            `Cần: ${ethers.formatEther(priceWei)} ETH\n` +
            `Có: ${ethers.formatEther(balance)} ETH`
        );
      }

      // 5. Check if buyer is not the seller
      if (ticket.sellerId.toLowerCase() === buyerAddress.toLowerCase()) {
        throw new Error("Bạn không thể mua vé của chính mình!");
      }

      // 6. Create marketplace contract instance
      const marketplaceContract = new ethers.Contract(
        resaleMarketplaceAddress,
        ResaleMarketplaceABI.abi,
        signer
      );

      // 7. Check listing still active
      setLoadingMessage("Đang kiểm tra listing...");
      const listing = await marketplaceContract.listings(
        ticket.event.contractAddress,
        ticket.tokenId
      );

      if (!listing.active) {
        throw new Error("Vé này không còn được bán nữa");
      }

      console.log("📋 Listing info:", {
        seller: listing.seller,
        price: listing.price.toString(),
        active: listing.active,
      });

      // 8. Buy resale ticket
      setLoadingMessage("Đang chờ xác nhận từ MetaMask...");

      console.log("🛒 Buying params:", {
        contractAddress: ticket.event.contractAddress,
        tokenId: ticket.tokenId,
        price: priceWei.toString(),
        priceETH: ticket.price,
      });

      const tx = await marketplaceContract.buyResale(
        ticket.event.contractAddress,
        ticket.tokenId,
        { value: priceWei }
      );

      toast.info(`Giao dịch đã được gửi: ${tx.hash.slice(0, 10)}...`);

      // 9. Wait for confirmation
      setLoadingMessage("Đang xử lý giao dịch trên blockchain...");
      const receipt = await tx.wait();

      if (!receipt || receipt.status === 0) {
        throw new Error("Giao dịch thất bại hoặc bị revert");
      }

      console.log("✅ Transaction confirmed:", receipt.hash);

      // 10. Update backend
      setLoadingMessage("Đang cập nhật thông tin...");
      await mutation.mutateAsync({
        resellTicketId: ticket.resellTicketId,
      });

      toast.success(
        <div className="flex flex-col gap-1">
          <p className="font-semibold">Mua vé thành công! 🎉</p>
          <p className="text-sm">{ticket.event.title}</p>
          <p className="text-xs text-gray-400">Token ID: {ticket.tokenId}</p>
        </div>,
        { duration: 5000 }
      );
    } catch (error: any) {
      console.error("❌ Buy resell error:", error);

      let errorMessage = "Không thể mua vé";

      if (error.code === 4001) {
        errorMessage = "Bạn đã từ chối giao dịch";
      } else if (error.code === "INSUFFICIENT_FUNDS") {
        errorMessage = "Số dư không đủ để mua vé";
      } else if (error.code === "INVALID_ARGUMENT") {
        errorMessage = "Tham số không hợp lệ: " + error.message;
      } else if (error.code === "CALL_EXCEPTION") {
        errorMessage =
          "Giao dịch thất bại. Vé có thể đã được bán hoặc listing đã hủy.";
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast.error(errorMessage, { duration: 5000 });
    } finally {
      setIsLoading(false);
      setLoadingMessage("");
    }
  };

  return (
    <>
      <div className="group relative rounded-2xl bg-white/5 backdrop-blur-lg border border-[#00FF80]/20 overflow-hidden hover:shadow-[0_0_25px_rgba(0,255,128,0.4)] transition-all duration-300 hover:scale-[1.02] cursor-pointer">
        <div className="aspect-[16/9] overflow-hidden relative">
          <img
            src={ipfsToHttp(ticket.event.coverImage)}
            alt={ticket.event.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <Badge className="absolute top-3 right-3 bg-green-500/90 text-black border-0 font-semibold">
            🔄 Bán lại
          </Badge>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        </div>

        <div className="p-5 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h3 className="text-white truncate group-hover:text-[#00FF80] transition-colors duration-300">
                {ticket.event.title}
              </h3>
              <p className="text-[#00FF80] text-[0.875rem] mt-1">
                {ticket.stageName || "General Admission"}
              </p>
            </div>
          </div>

          <div className="space-y-2 text-[0.875rem]">
            <div className="flex items-center gap-2 text-gray-400">
              <Calendar size={14} className="text-[#00FF80]" />
              <span>
                {new Date(ticket.event.date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <MapPin size={14} className="text-[#00FF80]" />
              <span className="truncate">{ticket.event.location}</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-[#00FF80]/20">
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <Coins size={18} className="text-[#00FF80]" />
                <span className="text-white font-semibold">
                  {ticket.price} ETH
                </span>
              </div>
              <p className="text-xs text-gray-400">
                Giá gốc: {ticket.event.price} ETH
              </p>
              <p className="text-xs text-gray-400">
                Người bán lại: {ticket.sellerId.slice(0, 6)}...
                {ticket.sellerId.slice(-4)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[0.75rem] text-gray-400">Token ID</p>
              <p className="text-white font-mono">#{ticket.tokenId}</p>
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              onClick={(e) => {
                e.stopPropagation();
                handleBuyResell();
              }}
              disabled={isLoading}
              className="flex-1 bg-[#00FF80] text-black hover:bg-[#00FF80]/90 font-semibold shadow-lg disabled:opacity-50"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {loadingMessage}
                </span>
              ) : (
                "Buy Resell"
              )}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
