import { useState } from "react";
import { NFTTicket } from "../../contexts/DataContext";
import { useAuth } from "../../contexts/AuthContext";
import { useData } from "../../contexts/DataContext";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { VerifyDialog } from "./VerifyDialog";
import { Calendar, MapPin, Users, FileText, Share2 } from "lucide-react";
import { toast } from "sonner";
import { QRCodeSVG } from "qrcode.react";

interface PurchaseDialogProps {
  ticket: NFTTicket;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const PurchaseDialog = ({
  ticket,
  open,
  onOpenChange,
}: PurchaseDialogProps) => {
  const { user } = useAuth();
  const { purchaseTicket, purchasedTickets } = useData();
  const [justPurchased, setJustPurchased] = useState(false);
  const [verifyDialogOpen, setVerifyDialogOpen] = useState(false);

  // Check if user already owns this ticket
  const existingPurchase = purchasedTickets.find(
    (t) => t.id === ticket.id && t.ownerAddress === user?.walletAddress
  );

  const handlePurchase = () => {
    if (!user) {
      toast.error("Please login to purchase tickets");
      return;
    }
    purchaseTicket(ticket.id, user.walletAddress);
    toast.success("Ticket purchased successfully!");
    setJustPurchased(true);
  };

  const handleShare = () => {
    const url = `${window.location.origin}/nft/${ticket.id}`;
    navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard!");
  };

  const handleClose = () => {
    setJustPurchased(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="bg-[#0A0A0A] border-[#00FF80]/30 max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white text-[1.5rem]">
            {ticket.eventTitle}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4">
          {/* Left: Image */}
          <div className="relative rounded-2xl overflow-hidden group">
            <img
              src={`https://source.unsplash.com/1200x800/?${ticket.image}`}
              alt={ticket.eventTitle}
              className="w-full aspect-[4/3] object-cover"
            />
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(to bottom, rgba(10,10,10,0.3), rgba(10,10,10,0.8))`,
              }}
            />
            {ticket.isResale && (
              <Badge className="absolute top-4 right-4 bg-yellow-500 text-black">
                Resale
              </Badge>
            )}
          </div>

          {/* Right: Info */}
          <div className="space-y-4">
            <div>
              <Badge className="mb-3 bg-[#00FF80]/20 text-[#00FF80] border-[#00FF80]/50">
                {ticket.genre}
              </Badge>
              <p className="text-[#00FF80] text-[1.125rem]">
                by {ticket.artistName}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-lg border border-[#00FF80]/20 space-y-3">
              <div className="flex items-start gap-3">
                <Calendar className="text-[#00FF80] mt-1" size={18} />
                <div>
                  <p className="text-gray-400 text-[0.875rem]">Date</p>
                  <p className="text-white text-[0.9375rem]">
                    {new Date(ticket.date).toLocaleDateString("en-US", {
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
                  <p className="text-gray-400 text-[0.875rem]">Venue</p>
                  <p className="text-white text-[0.9375rem]">{ticket.venue}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Users className="text-[#00FF80] mt-1" size={18} />
                <div>
                  <p className="text-gray-400 text-[0.875rem]">Seat Type</p>
                  <p className="text-white text-[0.9375rem]">
                    {ticket.seatType}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <FileText className="text-[#00FF80] mt-1" size={18} />
                <div>
                  <p className="text-gray-400 text-[0.875rem]">
                    Smart Contract
                  </p>
                  <p className="text-white font-mono text-[0.875rem]">
                    {ticket.contractAddress}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-gradient-to-br from-[#00FF80]/20 to-[#00FF80]/5 border border-[#00FF80]/30">
              <p className="text-gray-400 text-[0.875rem] mb-2">Price</p>
              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-white text-[1.75rem]">
                  {ticket.priceETH} ETH
                </span>
                <span className="text-gray-400">${ticket.priceUSD}</span>
              </div>
              <div className="flex items-center justify-between text-[0.875rem]">
                <span className="text-gray-400">Remaining Supply</span>
                <span className="text-white">
                  {ticket.remainingSupply} / {ticket.totalSupply}
                </span>
              </div>
            </div>

            {justPurchased || existingPurchase ? (
              <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-lg border border-[#00FF80]/30 text-center space-y-3">
                <p className="text-[#00FF80]">✅ Ticket Purchased!</p>
                <div className="bg-white p-4 rounded-lg inline-block">
                  <QRCodeSVG
                    value={
                      existingPurchase?.qrCode ||
                      `QR-${ticket.id}-${Date.now()}`
                    }
                    size={180}
                  />
                </div>
                <p className="text-gray-400 text-[0.875rem]">
                  Scan this QR code at the venue
                </p>
                <div className="flex gap-3">
                  <Button
                    onClick={() => {
                      if (existingPurchase) {
                        setVerifyDialogOpen(true);
                      }
                    }}
                    variant="outline"
                    className="flex-1 border-[#00FF80]/30 text-[#00FF80] hover:bg-[#00FF80]/10"
                  >
                    Verify Ticket
                  </Button>
                  <Button
                    onClick={handleClose}
                    className="flex-1 bg-[#00FF80] text-black hover:bg-[#00FF80]/90"
                  >
                    Close
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex gap-3">
                <Button
                  onClick={handlePurchase}
                  disabled={ticket.remainingSupply === 0}
                  className="flex-1 bg-[#00FF80] text-black hover:bg-[#00FF80]/90 shadow-[0_0_20px_rgba(0,255,128,0.3)] disabled:opacity-50"
                >
                  {ticket.remainingSupply === 0
                    ? "Sold Out"
                    : "Purchase NFT Ticket"}
                </Button>
                <Button
                  onClick={handleShare}
                  variant="outline"
                  className="border-[#00FF80]/30 text-[#00FF80] hover:bg-[#00FF80]/10"
                >
                  <Share2 size={18} />
                </Button>
              </div>
            )}

            <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-lg border border-[#00FF80]/10">
              <h4 className="text-white mb-2 text-[0.9375rem]">
                About This Event
              </h4>
              <p className="text-gray-400 text-[0.875rem]">
                {ticket.description}
              </p>
            </div>
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
