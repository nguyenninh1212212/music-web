import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import ResaleMarketplaceABI from "@/abi/ResaleMarketplace.json";
import EventTicketABI from "@/abi/EventTicket.json";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { listResellTicket } from "@/api/nft";
import { ethers } from "ethers";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

export default function DialogButton({
  oldPrice,
  title,
  userTicketId,
  contractAddress,
  tokenId,
  resaleMarketplaceAddress,
}: {
  oldPrice?: string;
  title: string;
  userTicketId: string;
  contractAddress: string;
  tokenId: string;
  resaleMarketplaceAddress: string;
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [price, setPrice] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isApproving, setIsApproving] = useState(false);
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const resellMutation = useMutation({
    mutationFn: async (data: { price: string; sellerId: string }) =>
      await listResellTicket(userTicketId, data.price),
    onSuccess: () => {
      toast.success("Đã đăng bán vé thành công!");
      queryClient.invalidateQueries({ queryKey: ["my-ticket"] });
      setIsDialogOpen(false);
      setPrice("");
      setError("");
    },
    onError: (err: any) => {
      const errorMsg = err?.response?.data?.message || "Không thể bán lại";
      setError(errorMsg);
      toast.error(errorMsg);
    },
  });

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === "" || /^[0-9]*\.?[0-9]*$/.test(val)) {
      setPrice(val);
      setError("");
    }

    if (parseFloat(val) <= 0) {
      setError("Giá phải lớn hơn 0");
    }
  };

  const handleResell = async () => {
    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum <= 0) {
      setError("Vui lòng nhập giá hợp lệ (> 0)");
      return;
    }

    if (!window.ethereum) {
      setError("Bạn cần cài Metamask!");
      toast.error("Vui lòng cài đặt Metamask");
      return;
    }

    try {
      setIsApproving(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();

      // ✅ Lấy địa chỉ từ MetaMask
      const userAddress = await signer.getAddress();

      if (!userAddress || userAddress === ethers.ZeroAddress) {
        throw new Error("Không thể lấy địa chỉ ví từ MetaMask");
      }

      console.log("🔍 Connected wallet:", userAddress);

      // ✅ Optional: Warning nếu khác với DB
      const dbWalletAddress = user?.user?.walletAddress;
      if (
        dbWalletAddress &&
        dbWalletAddress.toLowerCase() !== userAddress.toLowerCase()
      ) {
        console.warn("⚠️ Wallet mismatch:", {
          db: dbWalletAddress,
          metamask: userAddress,
        });
      }

      // ✅ Validate inputs
      if (!contractAddress) {
        throw new Error("Địa chỉ contract không hợp lệ");
      }

      if (!tokenId) {
        throw new Error("Token ID không hợp lệ");
      }

      if (!resaleMarketplaceAddress) {
        throw new Error("Địa chỉ marketplace không hợp lệ");
      }

      const eventTicketContract = new ethers.Contract(
        contractAddress,
        EventTicketABI.abi,
        signer
      );

      // ✅ Kiểm tra owner thực tế trên blockchain
      let actualOwner;
      try {
        actualOwner = await eventTicketContract.ownerOf(tokenId);
        console.log("🔍 NFT owner:", actualOwner);
        console.log("🔍 User address:", userAddress);
      } catch (err) {
        throw new Error("NFT không tồn tại hoặc đã bị burn");
      }

      // ✅ Kiểm tra user có phải owner không
      if (actualOwner.toLowerCase() !== userAddress.toLowerCase()) {
        throw new Error(
          `Bạn không phải chủ sở hữu vé này!\n` +
            `Owner: ${actualOwner.slice(0, 6)}...${actualOwner.slice(-4)}\n` +
            `You: ${userAddress.slice(0, 6)}...${userAddress.slice(-4)}`
        );
      }

      // ✅ Kiểm tra vé có đang được list không
      const resaleContract = new ethers.Contract(
        resaleMarketplaceAddress,
        ResaleMarketplaceABI.abi,
        signer
      );

      const listing = await resaleContract.listings(contractAddress, tokenId);
      console.log("🔍 Current listing:", {
        seller: listing.seller,
        price: listing.price?.toString(),
        active: listing.active,
      });

      if (listing.active) {
        throw new Error(
          "Vé đang được bán trên marketplace. Vui lòng hủy listing trước."
        );
      }

      toast.info("Đang yêu cầu approve...");

      // ✅ Kiểm tra đã approve chưa
      const approvedAddress = await eventTicketContract.getApproved(tokenId);
      console.log("🔍 Approved to:", approvedAddress);

      if (
        approvedAddress.toLowerCase() !== resaleMarketplaceAddress.toLowerCase()
      ) {
        const approveTx = await eventTicketContract.approve(
          resaleMarketplaceAddress,
          tokenId
        );
        toast.info("Đang chờ approve transaction...");
        const approveReceipt = await approveTx.wait();

        if (!approveReceipt || approveReceipt.status === 0) {
          throw new Error("Approve thất bại");
        }

        toast.success("Approve thành công!");
      } else {
        toast.info("Đã được approve trước đó");
      }

      setIsApproving(false);

      // ✅ List ticket
      toast.info("Đang đăng bán vé...");

      let priceInWei;
      try {
        priceInWei = ethers.parseEther(price.trim());
      } catch (parseError) {
        throw new Error("Giá không hợp lệ. Vui lòng nhập số (ví dụ: 0.1)");
      }

      console.log("📝 Listing params:", {
        contractAddress,
        tokenId,
        price: priceInWei.toString(),
        priceETH: price,
      });

      const listTx = await resaleContract.listTicket(
        contractAddress,
        tokenId,
        priceInWei
      );

      toast.info("Đang chờ xác nhận...");
      const listReceipt = await listTx.wait();

      if (!listReceipt || listReceipt.status === 0) {
        throw new Error("List ticket thất bại");
      }

      toast.success("Đăng bán thành công trên blockchain!");

      // ✅ Gọi backend để lưu thông tin
      await resellMutation.mutateAsync({
        price,
        sellerId: userAddress,
      });
    } catch (err: any) {
      setIsApproving(false);

      let errorMessage = "Không thể bán lại vé";

      if (err.code === 4001) {
        errorMessage = "Bạn đã từ chối giao dịch";
      } else if (err.code === "INVALID_ARGUMENT") {
        errorMessage = "Tham số không hợp lệ: " + err.message;
      } else if (err.code === "CALL_EXCEPTION") {
        errorMessage = "Contract call thất bại. Vui lòng kiểm tra lại.";
      } else if (err.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const isLoading = isApproving || resellMutation.isPending;

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="flex-1 border-[#00FF80]/30 text-[#00FF80] hover:bg-[#00FF80]/10"
        >
          Bán lại
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-[#1a1a1a] border-[#00FF80]/30 text-white max-w-md w-full rounded-lg shadow-lg shadow-[#00FF80]/20 p-4">
        <DialogHeader>
          <DialogTitle className="text-[#00FF80]">
            Bán lại vé: {title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="price" className="text-gray-300">
              Nhập giá bán lại (ETH)
            </Label>
            <Input
              id="price"
              type="text"
              placeholder="0.1"
              value={price}
              onChange={handlePriceChange}
              className="bg-black/50 border-[#00FF80]/30 text-white placeholder:text-gray-500 focus:border-[#00FF80] focus:ring-[#00FF80]/20 font-mono"
              disabled={isLoading}
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>

          {oldPrice && (
            <div className="p-3 bg-black/30 rounded-lg border border-[#00FF80]/20">
              <p className="text-xs text-gray-400 mb-1">Giá gốc:</p>
              <p className="text-sm text-[#00FF80] font-mono">{oldPrice} ETH</p>
            </div>
          )}

          <div className="p-3 bg-black/30 rounded-lg border border-[#00FF80]/20 space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">Token ID:</span>
              <span className="text-white font-mono">{tokenId}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">Contract:</span>
              <span className="text-white font-mono">
                {contractAddress.slice(0, 6)}...{contractAddress.slice(-4)}
              </span>
            </div>
          </div>

          <div className="text-xs text-gray-400 space-y-1">
            <p>⚠️ Bạn cần thực hiện 2 giao dịch:</p>
            <p>1. Approve Marketplace chuyển NFT</p>
            <p>2. List ticket lên Marketplace</p>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={() => setIsDialogOpen(false)}
            className="border-[#00FF80]/30 text-gray-300 hover:bg-[#00FF80]/10"
            disabled={isLoading}
          >
            Hủy
          </Button>
          <Button
            onClick={handleResell}
            className="bg-[#00FF80] hover:bg-[#00FF80]/90 text-black shadow-lg shadow-[#00FF80]/20"
            disabled={isLoading || !price.trim()}
          >
            {isApproving
              ? "Đang approve..."
              : resellMutation.isPending
              ? "Đang lưu..."
              : "Bán"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
