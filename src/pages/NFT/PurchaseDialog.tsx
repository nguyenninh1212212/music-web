import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { VerifyDialog } from "./VerifyDialog";
import { Calendar, MapPin, FileText, Share2 } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { ipfsToHttp } from "@/util/help";
import BuyTicketButton from "@/components/BuyTicketButton";

interface PurchaseDialogProps {
  ticket: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  existingPurchase?: {
    qrCode: string;
    tokenId: string;
  };
}

export const PurchaseDialog = ({
  ticket,
  open,
  onOpenChange,
  existingPurchase,
}: PurchaseDialogProps) => {
  const { user } = useAuth();
  const [verifyDialogOpen, setVerifyDialogOpen] = useState(false);

  const handleClose = () => {
    setVerifyDialogOpen(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="bg-[#0A0A0A] border-[#00FF80]/30 max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white text-[1.5rem]">
            {ticket.title}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-6 pt-4">
          {/* Hình ảnh */}
          <div className="relative rounded-2xl overflow-hidden group">
            <img
              src={ipfsToHttp(ticket.coverImage)}
              alt={ticket.title}
              className="w-full aspect-[4/3] object-cover"
            />
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(to bottom, rgba(10,10,10,0.3), rgba(10,10,10,0.8))`,
              }}
            />
            {ticket.status === "active" && (
              <Badge className="absolute top-4 right-4 bg-yellow-500 text-black">
                Bán Lại
              </Badge>
            )}
          </div>

          {/* Thông tin */}
          <div className="space-y-4">
            <p className="text-[#00FF80] text-[1.125rem]">
              bởi{" "}
              {ticket.artistId === user?.user.artistId
                ? "Bạn"
                : ticket.artistId}
            </p>

            <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-lg border border-[#00FF80]/20 space-y-3">
              <div className="flex items-start gap-3">
                <Calendar className="text-[#00FF80] mt-1" size={18} />
                <div>
                  <p className="text-gray-400 text-[0.875rem]">Ngày</p>
                  <p className="text-white text-[0.9375rem]">
                    {new Date(ticket.date).toLocaleDateString("vi-VN", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="text-[#00FF80] mt-1" size={18} />
                <div>
                  <p className="text-gray-400 text-[0.875rem]">Địa điểm</p>
                  <p className="text-white text-[0.9375rem]">
                    {ticket.location}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <FileText className="text-[#00FF80] mt-1" size={18} />
                <div>
                  <p className="text-gray-400 text-[0.875rem]">
                    Hợp đồng thông minh
                  </p>
                  <p className="text-white font-mono text-[0.875rem] break-words">
                    {ticket.contractAddress}
                  </p>
                </div>
              </div>
            </div>

            {/* Mua vé / QR Code */}
            {existingPurchase ? (
              <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-lg border border-[#00FF80]/30 text-center space-y-3">
                <p className="text-[#00FF80]">✅ Vé đã được mua!</p>
                <div className="bg-white p-4 rounded-lg inline-block">
                  <QRCodeSVG value={existingPurchase.qrCode} size={180} />
                </div>
                <p className="text-gray-400 text-[0.875rem]">
                  Quét mã QR này tại sự kiện
                </p>
                <div className="flex gap-3">
                  <Button
                    onClick={() => setVerifyDialogOpen(true)}
                    variant="outline"
                    className="flex-1 border-[#00FF80]/30 text-[#00FF80] hover:bg-[#00FF80]/10"
                  >
                    Xác Thực Vé
                  </Button>
                  <Button
                    onClick={handleClose}
                    className="flex-1 bg-[#00FF80] text-black hover:bg-[#00FF80]/90"
                  >
                    Đóng
                  </Button>
                </div>
              </div>
            ) : (
              <BuyTicketButton
                eventId={ticket.eventId}
                contractAddress={ticket.contractAddress}
                price={ticket.price}
              />
            )}
          </div>
        </div>
      </DialogContent>

      {existingPurchase && (
        <VerifyDialog
          qrCode={existingPurchase.qrCode}
          open={verifyDialogOpen}
          onOpenChange={setVerifyDialogOpen}
        />
      )}
    </Dialog>
  );
};
