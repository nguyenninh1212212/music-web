import React, { useState } from "react";
import { ethers, Interface, Log } from "ethers";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, CheckCircle2, ShoppingCart } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { logPurchase } from "@/api/nft";

// Import your ABI and hook
import EventTicketABI from "../abi/EventTicket.json";
// import { useLogPurchase } from "../lib/hook/useLogPurchase";

interface BuyTicketButtonProps {
  eventId: string;
  contractAddress: string;
  price: string;
  ownerAddress?: string;
}

interface INftLogPurchase {
  eventId: string;
  tokenId: string;
  txHash: string;
}
const BuyTicketButton: React.FC<BuyTicketButtonProps> = ({
  eventId,
  contractAddress,
  price,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [tokenId, setTokenId] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);
  const mutation = useMutation({
    mutationFn: (payload: INftLogPurchase) => {
      return logPurchase(payload);
    },
    onSuccess: () => {
      toast.success("Log purchase to offchain success");
    },
    onError: (err) => {
      toast.success("Log purchase fail : " + err);
    },
  });

  // Uncomment when using real hook
  // const logPurchaseMutation = useLogPurchase();

  const parseTokenIdFromReceipt = (logs: readonly Log[]): string | null => {
    const transferEventInterface = new Interface([
      "event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)",
    ]);

    for (const log of logs) {
      try {
        const parsedLog = transferEventInterface.parseLog(log);
        if (parsedLog?.name === "Transfer") {
          return parsedLog.args.tokenId.toString();
        }
      } catch {
        // Continue to next log if parsing fails
      }
    }
    return null;
  };

  const handleBuyTicket = async () => {
    // Validate MetaMask
    if (!window.ethereum) {
      toast.error("Vui lòng cài đặt MetaMask để tiếp tục!");
      return;
    }

    setIsLoading(true);
    setLoadingMessage("Đang khởi tạo...");

    try {
      // Initialize provider and signer
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const userAddress = await signer.getAddress();

      // Validate price format
      let priceWei: bigint;
      try {
        priceWei = ethers.parseEther(price);
      } catch (error) {
        throw new Error("Giá vé không hợp lệ");
      }

      // Check user balance
      setLoadingMessage("Đang kiểm tra số dư...");
      const balance = await provider.getBalance(userAddress);
      if (balance < priceWei) {
        throw new Error("Số dư không đủ để mua vé");
      }

      // Create contract instance
      // Replace with actual ABI
      const contract = new ethers.Contract(
        contractAddress,
        EventTicketABI.abi, // EventTicketABI.abi
        signer
      );

      // Request transaction
      setLoadingMessage("Đang chờ xác nhận từ MetaMask...");
      const tx = await contract.mintTicket({ value: priceWei });
      const currentTxHash = tx.hash;
      setTxHash(currentTxHash);

      toast.info(`Giao dịch đã được gửi: ${currentTxHash.slice(0, 10)}...`);

      setLoadingMessage("Đang xử lý giao dịch trên blockchain...");
      const receipt = await tx.wait();

      if (!receipt) {
        throw new Error("Giao dịch thất bại");
      }

      if (receipt.status === 0) {
        throw new Error("Giao dịch bị revert");
      }

      // Parse token ID from logs
      const mintedTokenId = parseTokenIdFromReceipt(receipt.logs);
      if (!mintedTokenId) {
        throw new Error("Không thể lấy Token ID từ biên lai giao dịch");
      }

      setTokenId(mintedTokenId);

      // Log purchase to backend
      setLoadingMessage("Đang lưu thông tin vé...");
      try {
        // Uncomment when using real mutation
        mutation.mutate({
          eventId,
          tokenId: mintedTokenId,
          txHash: currentTxHash,
        });
        // Simulated async call
        await new Promise((resolve) => setTimeout(resolve, 500));

        toast.success(
          <div className="flex flex-col gap-1">
            <p className="font-semibold">Mua vé thành công! 🎉</p>
            <p className="text-sm">Token ID: {mintedTokenId}</p>
          </div>
        );
      } catch (dbError: any) {
        // Token minted but DB save failed - still show success
        console.error("Database error:", dbError);
        toast.warning(
          "Vé đã được mint nhưng có lỗi khi lưu vào hệ thống. Vui lòng liên hệ support."
        );
      }
    } catch (error: any) {
      console.error("Purchase error:", error);

      // Handle specific error types
      let errorMessage = "Đã xảy ra lỗi khi mua vé";

      if (error.code === 4001) {
        errorMessage = "Bạn đã từ chối giao dịch";
      } else if (error.code === "INSUFFICIENT_FUNDS") {
        errorMessage = "Số dư không đủ";
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
      setLoadingMessage("");
    }
  };

  // Show QR code after successful purchase
  if (tokenId) {
    return (
      <div className="p-6 rounded-2xl bg-gradient-to-br from-[#00FF80]/10 to-[#00FF80]/5 backdrop-blur-lg border border-[#00FF80]/30 text-center space-y-4">
        <div className="flex items-center justify-center gap-2">
          <CheckCircle2 className="w-6 h-6 text-[#00FF80]" />
          <p className="text-[#00FF80] text-xl font-bold">Mua vé thành công!</p>
        </div>

        <div className="bg-white p-4 rounded-xl inline-block shadow-lg">
          <QRCodeSVG
            value={`ticket-${eventId}-${tokenId}`}
            size={200}
            level="H"
            includeMargin
          />
        </div>

        <div className="space-y-2">
          <p className="text-gray-300 text-sm font-medium">
            Token ID: <span className="text-[#00FF80]">#{tokenId}</span>
          </p>
          <p className="text-gray-400 text-xs">
            Quét mã QR này tại cổng vào sự kiện
          </p>
          {txHash && (
            <a
              href={`https://etherscan.io/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#00FF80]/70 hover:text-[#00FF80] text-xs underline inline-block mt-2"
            >
              Xem giao dịch trên Etherscan
            </a>
          )}
        </div>
      </div>
    );
  }

  return (
    <Button
      onClick={handleBuyTicket}
      disabled={isLoading}
      className="w-full bg-gradient-to-r from-[#00FF80] to-[#00CC66] text-black font-semibold hover:from-[#00FF80]/90 hover:to-[#00CC66]/90 shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      size="lg"
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin" />
          {loadingMessage}
        </span>
      ) : (
        <span className="flex items-center gap-2">
          <ShoppingCart className="w-4 h-4" />
          Mua vé - {price} ETH
        </span>
      )}
    </Button>
  );
};

export default BuyTicketButton;
