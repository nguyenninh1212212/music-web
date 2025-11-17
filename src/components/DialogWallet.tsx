"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import { toast } from "sonner";
import { ethers } from "ethers";

export default function DialogWallet() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [nameWallet, setNameWallet] = useState<string>("");

  const getWallet = async () => {
    if (!window.ethereum) {
      toast.error("Vui lòng cài đặt MetaMask để tiếp tục!");
      return;
    }
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      setNameWallet(signer.address);
    } catch (error) {
      console.log(error);
    }
  };

  getWallet();

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button
          variant="default"
          className="bg-[#00FF80] hover:bg-[#00FF80]/90 max-w-[130px] overflow-hidden whitespace-nowrap text-ellipsis transition-all"
          title={"Vui lòng đăng nhập MetaMask"} // ✅ Tooltip hiển thị full address
        >
          {!nameWallet
            ? "Vui lòng đăng nhập MetaMask"
            : `${nameWallet.slice(0, 6)}...${nameWallet.slice(-4)}`}
        </Button>
      </DialogTrigger>
    </Dialog>
  );
}
