import { useNavigate } from "react-router-dom";
import { useData } from "../../contexts/DataContext";
import { useAuth } from "../../contexts/AuthContext";
import { Button } from "../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import { Calendar, MapPin, QrCode, DollarSign } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

export const MyTickets = () => {
  const navigate = useNavigate();
  const { purchasedTickets } = useData();
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-gray-400">Please login to view your tickets</p>
          <Button
            onClick={() => navigate("/nft")}
            className="bg-[#00FF80] text-black"
          >
            Go to Marketplace
          </Button>
        </div>
      </div>
    );
  }

  const userTickets = purchasedTickets.filter(
    (t) => t.ownerAddress === user.walletAddress
  );

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-white mb-2">🛒 My NFT Tickets</h1>
          <p className="text-gray-400">
            {userTickets.length}{" "}
            {userTickets.length === 1 ? "ticket" : "tickets"} in your wallet
          </p>
        </div>

        {userTickets.length === 0 ? (
          <div className="text-center py-16 rounded-2xl bg-white/5 backdrop-blur-lg border border-[#00FF80]/20">
            <p className="text-gray-400 mb-4">
              You haven't purchased any tickets yet
            </p>
            <Button
              onClick={() => navigate("/nft")}
              className="bg-[#00FF80] text-black hover:bg-[#00FF80]/90"
            >
              Browse Marketplace
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userTickets.map((ticket) => (
              <div
                key={ticket.purchaseId}
                className="rounded-2xl bg-white/5 backdrop-blur-lg border border-[#00FF80]/20 overflow-hidden hover:shadow-[0_0_25px_rgba(0,255,128,0.4)] transition-all duration-300"
              >
                <div className="aspect-[16/9] overflow-hidden relative">
                  <img
                    src={
                      "https://artlogic-res.cloudinary.com/w_1200,c_limit,f_auto,fl_lossy,q_auto/ws-artlogicwebsite0889/usr/images/news/main_image/6/nft-bored-ape-yacht-club.png"
                    }
                    alt={""}
                    className="w-full aspect-square object-cover rounded-lg shadow-lg"
                  />
                  dsa
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  {ticket.isListed && (
                    <div className="absolute top-3 right-3 bg-yellow-500 text-black px-3 py-1 rounded-full text-[0.75rem]">
                      Listed for Sale
                    </div>
                  )}
                </div>

                <div className="p-5 space-y-4">
                  <div>
                    <h3 className="text-white mb-1">{ticket.eventTitle}</h3>
                    <p className="text-[#00FF80] text-[0.875rem]">
                      {ticket.artistName}
                    </p>
                  </div>

                  <div className="space-y-2 text-[0.875rem]">
                    <div className="flex items-center gap-2 text-gray-400">
                      <Calendar size={14} className="text-[#00FF80]" />
                      <span>{new Date(ticket.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <MapPin size={14} className="text-[#00FF80]" />
                      <span className="truncate">{ticket.venue}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="flex-1 bg-[#00FF80] text-black hover:bg-[#00FF80]/90">
                          <QrCode size={16} className="mr-2" />
                          View QR
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-[#0A0A0A] border-[#00FF80]/30 max-w-md">
                        <DialogHeader>
                          <DialogTitle className="text-white">
                            {ticket.eventTitle}
                          </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 pt-4">
                          <div className="bg-white p-6 rounded-lg flex justify-center">
                            <QRCodeSVG value={ticket.qrCode} size={250} />
                          </div>
                          <div className="text-center space-y-2">
                            <p className="text-gray-400 text-[0.875rem]">
                              Scan this code at the venue entrance
                            </p>
                            <p className="text-[#00FF80] text-[0.875rem] font-mono">
                              {ticket.qrCode}
                            </p>
                          </div>
                          <Button
                            onClick={() =>
                              navigate(`/nft/verify/${ticket.qrCode}`)
                            }
                            variant="outline"
                            className="w-full border-[#00FF80]/30 text-[#00FF80]"
                          >
                            Verify This Ticket
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>

                    {!ticket.isListed && !ticket.isUsed && (
                      <Button
                        onClick={() => navigate(`/resell/${ticket.purchaseId}`)}
                        variant="outline"
                        className="flex-1 border-[#00FF80]/30 text-[#00FF80] hover:bg-[#00FF80]/10"
                      >
                        <DollarSign size={16} className="mr-2" />
                        Resell
                      </Button>
                    )}
                  </div>

                  <div className="pt-3 border-t border-[#00FF80]/20 text-[0.75rem] text-gray-400">
                    Purchased:{" "}
                    {new Date(ticket.purchaseDate).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
