"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { Label } from "@radix-ui/react-label";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import userApi from "@/api/auth";
import { toast } from "sonner";
import axiosClient from "@/api/axios";

export default function DialogButton() {
  const { user, setUser } = useAuth(); // ✅ Thêm setUser
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [nameWallet, setNameWallet] = useState<string>("");

  const addWallet = useMutation({
    mutationFn: async (walletAddress: string) =>
      await userApi.addWallet(walletAddress),
    onSuccess: async () => {
      // ✅ Refresh user data
      const rs = await axiosClient.get("/user/refresh");
      const updatedUser = rs.data;
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      toast.success("Thêm ví thành công");
      setIsDialogOpen(false);
      setNameWallet("");
    },
    onError: (error: any) => {
      console.error("Failed to add wallet", error);
      toast.error(error?.response?.data?.message || "Không thể thêm ví");
    },
  });

  const handleAddWallet = () => {
    if (nameWallet.trim()) {
      // ✅ Validate địa chỉ ví Ethereum
      if (!/^0x[a-fA-F0-9]{40}$/.test(nameWallet.trim())) {
        toast.error("Địa chỉ ví không hợp lệ");
        return;
      }
      addWallet.mutate(nameWallet.trim());
    } else {
      toast.error("Vui lòng nhập địa chỉ ví");
    }
  };

  const wallet = user?.user?.walletAddress;
  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button
          variant="default"
          className="bg-[#00FF80] hover:bg-[#00FF80]/90 max-w-[130px] overflow-hidden whitespace-nowrap text-ellipsis transition-all"
          title={wallet || "Thêm ví MetaMask"} // ✅ Tooltip hiển thị full address
        >
          {!wallet
            ? "+ Nhập ví"
            : `${wallet.slice(0, 6)}...${wallet.slice(-4)}`}
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-[#1a1a1a] border-[#00FF80]/30 text-white max-w-md w-full rounded-lg shadow-lg shadow-[#00FF80]/20 p-4">
        <DialogHeader>
          <DialogTitle className="text-[#00FF80]">
            {wallet ? "Cập nhật ví MetaMask" : "Thêm ví MetaMask"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="wallet" className="text-gray-300">
              Địa chỉ ví
            </Label>
            <Input
              id="wallet"
              placeholder="0x..."
              value={nameWallet}
              onChange={(e) => setNameWallet(e.target.value)}
              className="bg-black/50 border-[#00FF80]/30 text-white placeholder:text-gray-500 focus:border-[#00FF80] focus:ring-[#00FF80]/20 font-mono"
              disabled={addWallet.isPending}
            />
            <p className="text-xs text-gray-500">
              Nhập địa chỉ ví Ethereum (0x...)
            </p>
          </div>

          {/* ✅ Hiển thị ví hiện tại nếu có */}
          {wallet && (
            <div className="p-3 bg-black/30 rounded-lg border border-[#00FF80]/20">
              <p className="text-xs text-gray-400 mb-1">Ví hiện tại:</p>
              <p className="text-sm text-[#00FF80] font-mono break-all">
                {wallet}
              </p>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={() => setIsDialogOpen(false)}
            className="border-[#00FF80]/30 text-gray-300 hover:bg-[#00FF80]/10"
            disabled={addWallet.isPending}
          >
            Hủy
          </Button>
          <Button
            onClick={handleAddWallet}
            className="bg-[#00FF80] hover:bg-[#00FF80]/90 text-black shadow-lg shadow-[#00FF80]/20"
            disabled={addWallet.isPending || !nameWallet.trim()}
          >
            {addWallet.isPending
              ? "Đang xử lý..."
              : wallet
              ? "Cập nhật"
              : "Thêm"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
