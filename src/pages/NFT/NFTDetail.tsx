import { useParams, useNavigate } from "react-router-dom";
import { useData } from "../../contexts/DataContext";
import { useAuth } from "../../contexts/AuthContext";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { VerifyDialog } from "./VerifyDialog";
import {
  Calendar,
  MapPin,
  Users,
  FileText,
  Share2,
  ArrowLeft,
} from "lucide-react";
import { toast } from "sonner";
import { QRCodeSVG } from "qrcode.react";
import { useState } from "react";

export const NFTDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getTicketById, getPurchasedTicketById, purchaseTicket } = useData();
  const { user } = useAuth();
  const [showQR, setShowQR] = useState(false);
  const [verifyDialogOpen, setVerifyDialogOpen] = useState(false);

  const ticket = getTicketById(id || "");
  const purchasedTicket = getPurchasedTicketById(id || "");

  if (!ticket) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <p className="text-gray-400">Ticket not found</p>
      </div>
    );
  }

  const handlePurchase = () => {
    if (!user) {
      toast.error("Please login to purchase tickets");
      return;
    }
    purchaseTicket(ticket.id, user.walletAddress);
    toast.success("Ticket purchased successfully!");
    setShowQR(true);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard!");
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <div className="container mx-auto px-4 py-8">
        <Button
          onClick={() => navigate(-1)}
          variant="ghost"
          className="mb-6 text-gray-400 hover:text-white"
        >
          <ArrowLeft size={18} className="mr-2" />
          Back
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
          <div className="space-y-6">
            <div>
              <Badge className="mb-3 bg-[#00FF80]/20 text-[#00FF80] border-[#00FF80]/50">
                {ticket.genre}
              </Badge>
              <h1 className="text-white mb-2">{ticket.eventTitle}</h1>
              <p className="text-[#00FF80] text-[1.25rem]">
                by {ticket.artistName}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-lg border border-[#00FF80]/20 space-y-4">
              <div className="flex items-start gap-3">
                <Calendar className="text-[#00FF80] mt-1" size={20} />
                <div>
                  <p className="text-gray-400 text-[0.875rem]">Date</p>
                  <p className="text-white">
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
                <MapPin className="text-[#00FF80] mt-1" size={20} />
                <div>
                  <p className="text-gray-400 text-[0.875rem]">Venue</p>
                  <p className="text-white">{ticket.venue}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Users className="text-[#00FF80] mt-1" size={20} />
                <div>
                  <p className="text-gray-400 text-[0.875rem]">Seat Type</p>
                  <p className="text-white">{ticket.seatType}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <FileText className="text-[#00FF80] mt-1" size={20} />
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

            <div className="p-6 rounded-2xl bg-gradient-to-br from-[#00FF80]/20 to-[#00FF80]/5 border border-[#00FF80]/30">
              <p className="text-gray-400 text-[0.875rem] mb-2">Price</p>
              <div className="flex items-baseline gap-3 mb-3">
                <span className="text-white text-[2rem]">
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

            {showQR || purchasedTicket ? (
              <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-lg border border-[#00FF80]/30 text-center space-y-4">
                <p className="text-[#00FF80]">✅ Ticket Purchased!</p>
                <div className="bg-white p-4 rounded-lg inline-block">
                  <QRCodeSVG
                    value={
                      purchasedTicket?.qrCode || `QR-${ticket.id}-${Date.now()}`
                    }
                    size={200}
                  />
                </div>
                <p className="text-gray-400 text-[0.875rem]">
                  Scan this QR code at the venue
                </p>
                <Button
                  onClick={() => setVerifyDialogOpen(true)}
                  variant="outline"
                  className="w-full border-[#00FF80]/30 text-[#00FF80]"
                >
                  Verify Ticket
                </Button>
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

            <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-lg border border-[#00FF80]/10">
              <h3 className="text-white mb-2">About This Event</h3>
              <p className="text-gray-400">{ticket.description}</p>
            </div>
          </div>
        </div>

        {purchasedTicket && (
          <VerifyDialog
            qrCode={purchasedTicket.qrCode}
            open={verifyDialogOpen}
            onOpenChange={setVerifyDialogOpen}
          />
        )}
      </div>
    </div>
  );
};
