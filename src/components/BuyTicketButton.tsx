import React, { useState } from "react";
import { ethers, Interface, Log } from "ethers";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, CheckCircle2, ShoppingCart } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { logPurchase } from "@/api/nft";
import EventTicketABI from "@/abi/EventTicket.json";
import { useAuth } from "@/contexts/AuthContext";

interface BuyTicketButtonProps {
  eventId: string;
  contractAddress: string;
  price: string;
}

interface INftLogPurchase {
  eventId: string;
  tokenId: string;
  txHash: string;
  userId: string;
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
  const { user } = useAuth();

  const mutation = useMutation({
    mutationFn: (payload: INftLogPurchase) => {
      return logPurchase(payload);
    },
    onSuccess: () => {
      toast.success("Lưu thông tin vé thành công");
    },
    onError: (err) => {
      toast.error("Lưu thông tin vé thất bại: " + err);
    },
  });

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
        continue;
      }
    }
    return null;
  };

  const handleBuyTicket = async () => {
    if (!window.ethereum) {
      toast.error("Vui lòng cài đặt MetaMask để tiếp tục!");
      return;
    }

    setIsLoading(true);
    setLoadingMessage("Đang khởi tạo...");

    try {
      // ✅ 1. Initialize provider và request connection
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();

      // ✅ 2. Lấy địa chỉ ví từ MetaMask (KHÔNG dùng từ DB)
      const userAddress = await signer.getAddress();

      if (!userAddress || userAddress === ethers.ZeroAddress) {
        throw new Error("Không thể lấy địa chỉ ví từ MetaMask");
      }

      console.log("🔍 Connected wallet:", userAddress);

      // ✅ 3. Optional: Check với DB (chỉ warning nếu khác)
      const dbWalletAddress = user?.user?.walletAddress;
      if (
        dbWalletAddress &&
        dbWalletAddress.toLowerCase() !== userAddress.toLowerCase()
      ) {
        toast.warning(
          `Ví MetaMask khác với ví trong hệ thống!\n` +
            `Tiếp tục với ví: ${userAddress.slice(0, 6)}...${userAddress.slice(
              -4
            )}`
        );
      }

      // ✅ 4. Validate price
      if (!price || price === "0") {
        throw new Error("Giá vé không hợp lệ");
      }

      let priceWei: bigint;
      try {
        priceWei = ethers.parseEther(price);
      } catch (error) {
        throw new Error("Không thể chuyển đổi giá vé");
      }

      // ✅ 5. Check balance
      setLoadingMessage("Đang kiểm tra số dư...");
      const balance = await provider.getBalance(userAddress);

      console.log("💰 Balance:", ethers.formatEther(balance), "ETH");
      console.log("💸 Price:", ethers.formatEther(priceWei), "ETH");

      if (balance < priceWei) {
        throw new Error(
          `Số dư không đủ!\n` +
            `Cần: ${ethers.formatEther(priceWei)} ETH\n` +
            `Có: ${ethers.formatEther(balance)} ETH`
        );
      }

      // ✅ 6. Validate contract
      if (!contractAddress) {
        throw new Error("Địa chỉ contract không hợp lệ");
      }

      const code = await provider.getCode(contractAddress);
      if (code === "0x") {
        throw new Error("Contract chưa được deploy tại địa chỉ này");
      }

      // ✅ 7. Create contract instance
      const contract = new ethers.Contract(
        contractAddress,
        EventTicketABI.abi,
        signer
      );

      // ✅ 8. Request transaction
      setLoadingMessage("Đang chờ xác nhận từ MetaMask...");
      const tx = await contract.mintTicket({ value: priceWei });
      const currentTxHash = tx.hash;
      setTxHash(currentTxHash);

      toast.info(`Giao dịch đã được gửi: ${currentTxHash.slice(0, 10)}...`);

      // ✅ 9. Wait for confirmation
      setLoadingMessage("Đang xử lý giao dịch trên blockchain...");
      const receipt = await tx.wait();

      if (!receipt || receipt.status === 0) {
        throw new Error("Giao dịch thất bại hoặc bị revert");
      }

      // ✅ 10. Parse token ID
      const mintedTokenId = parseTokenIdFromReceipt(receipt.logs);
      if (!mintedTokenId) {
        throw new Error("Không thể lấy Token ID từ biên lai giao dịch");
      }

      setTokenId(mintedTokenId);
      console.log("✅ Token ID:", mintedTokenId);

      // ✅ 11. Log to backend
      setLoadingMessage("Đang lưu thông tin vé...");
      try {
        await mutation.mutateAsync({
          eventId,
          tokenId: mintedTokenId,
          txHash: currentTxHash,
          userId: userAddress, // Dùng userId hoặc wallet address
        });

        toast.success(
          <div className="flex flex-col gap-1">
            <p className="font-semibold">Mua vé thành công! 🎉</p>
            <p className="text-sm">Token ID: #{mintedTokenId}</p>
            <p className="text-xs text-gray-400">
              {userAddress.slice(0, 6)}...{userAddress.slice(-4)}
            </p>
          </div>,
          { duration: 5000 }
        );
      } catch (dbError: any) {
        console.error("Database error:", dbError);
        toast.warning(
          `Vé đã mint thành công (Token #${mintedTokenId}) nhưng có lỗi khi lưu vào DB. ` +
            `Vui lòng liên hệ support với TxHash: ${currentTxHash}`
        );
      }
    } catch (error: any) {
      console.error("❌ Purchase error:", error);

      let errorMessage = "Đã xảy ra lỗi khi mua vé";

      if (error.code === 4001) {
        errorMessage = "Bạn đã từ chối giao dịch";
      } else if (error.code === "INSUFFICIENT_FUNDS") {
        errorMessage = "Số dư không đủ để thực hiện giao dịch";
      } else if (error.code === "INVALID_ARGUMENT") {
        errorMessage =
          "Tham số không hợp lệ: " + (error.argument || error.message);
      } else if (error.code === "CALL_EXCEPTION") {
        errorMessage =
          "Contract call thất bại. Có thể vé đã hết hoặc event đã kết thúc.";
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast.error(errorMessage, { duration: 5000 });
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
            value={`ticket-${contractAddress}-${tokenId}`}
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
      disabled={isLoading || !user}
      className="w-full bg-gradient-to-r from-[#00FF80] to-[#00CC66] text-black font-semibold hover:from-[#00FF80]/90 hover:to-[#00CC66]/90 shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      size="lg"
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin" />
          {loadingMessage}
        </span>
      ) : !user ? (
        "Vui lòng đăng nhập"
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
