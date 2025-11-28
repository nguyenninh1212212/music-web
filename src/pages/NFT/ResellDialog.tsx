import { useState } from "react";
import { PurchasedTicket } from "../../contexts/DataContext";
import { useData } from "../../contexts/DataContext";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { Calendar, MapPin, DollarSign } from "lucide-react";
import { toast } from "sonner";

interface ResellDialogProps {
  ticket: PurchasedTicket;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ResellDialog = ({
  ticket,
  open,
  onOpenChange,
}: ResellDialogProps) => {
  const { listForResale } = useData();
  const [newPrice, setNewPrice] = useState("");

  const handleResell = () => {
    const price = parseFloat(newPrice);
    if (!price || price <= 0) {
      toast.error("Please enter a valid price");
      return;
    }

    listForResale(ticket.purchaseId, price);
    toast.success("Ticket listed for resale!");
    setNewPrice("");
    onOpenChange(false);
  };

  const handleClose = () => {
    setNewPrice("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="bg-[#0A0A0A] border-[#00FF80]/30 max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white text-[1.5rem]">
            💱 Bán lại vé nft
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4">
          {/* Left: Ticket Preview */}
          <div className="rounded-2xl bg-white/5 backdrop-blur-lg border border-[#00FF80]/20 overflow-hidden">
            <div className="aspect-[16/9] overflow-hidden relative">
              <img
                src={`https://source.unsplash.com/800x450/?${ticket.image}`}
                alt={ticket.eventTitle}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            </div>

            <div className="p-5 space-y-4">
              <div>
                <h3 className="text-white mb-1">{ticket.eventTitle}</h3>
                <p className="text-[#00FF80]">{ticket.artistName}</p>
              </div>

              <div className="space-y-2 text-[0.875rem]">
                <div className="flex items-center gap-2 text-gray-400">
                  <Calendar size={14} className="text-[#00FF80]" />
                  <span>
                    {new Date(ticket.date).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <MapPin size={14} className="text-[#00FF80]" />
                  <span>{ticket.venue}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-[#00FF80]/20">
                <p className="text-gray-400 text-[0.875rem] mb-1">Giá gốc</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-white text-[1.375rem]">
                    {ticket.priceETH} ETH
                  </span>
                  <span className="text-gray-400">${ticket.priceUSD}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Resale Form */}
          <div className="space-y-5">
            <div className="p-5 rounded-2xl bg-white/5 backdrop-blur-lg border border-[#00FF80]/20">
              <h4 className="text-white mb-4">Set Resale Price</h4>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="price" className="text-gray-300">
                    Giá mới (ETH)
                  </Label>
                  <div className="relative mt-2">
                    <DollarSign
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-[#00FF80]"
                      size={18}
                    />
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={newPrice}
                      onChange={(e) => setNewPrice(e.target.value)}
                      placeholder="0.5"
                      className="pl-10 bg-white/5 border-[#00FF80]/30 text-white"
                    />
                  </div>
                  {newPrice && (
                    <p className="text-gray-400 text-[0.875rem] mt-2">
                      ≈ ${(parseFloat(newPrice) * 2400).toFixed(2)} USD
                    </p>
                  )}
                </div>

                <div className="p-4 rounded-lg bg-[#00FF80]/10 border border-[#00FF80]/30">
                  <h5 className="text-[#00FF80] text-[0.875rem] mb-2">
                    Mẹo Định Giá
                  </h5>
                  <ul className="text-gray-300 text-[0.875rem] space-y-1 list-disc list-inside">
                    <li>Xem xét nhu cầu thị trường hiện tại</li>
                    <li>Tính đến giá mua ban đầu</li>
                    <li>Kiểm tra các sự kiện tương tự</li>
                    <li>Cạnh tranh nhưng công bằng</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white/5 backdrop-blur-lg border border-[#00FF80]/20">
              <h5 className="text-white mb-3">Thông Tin Quan Trọng</h5>
              <div className="space-y-2 text-[0.875rem] text-gray-400">
                <p>
                  • Khi đã đăng bán, vé của bạn sẽ xuất hiện trên thị trường
                </p>
                <p>• Bạn sẽ không thể sử dụng vé sau khi đã đăng bán</p>
                <p>
                  • Việc bán sẽ được thực hiện thông qua hợp đồng thông minh
                </p>
                <p>• Bạn sẽ nhận thanh toán bằng ETH vào ví của mình</p>
              </div>
            </div>

            <Button
              onClick={handleResell}
              disabled={!newPrice || parseFloat(newPrice) <= 0}
              className="w-full bg-[#00FF80] text-black hover:bg-[#00FF80]/90 shadow-[0_0_20px_rgba(0,255,128,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Bán lại vé này
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
