import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Button } from "../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import {
  Calendar,
  MapPin,
  QrCode,
  DollarSign,
  TicketPercent,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useQuery } from "@tanstack/react-query";
import { getMyTickets } from "@/api/nft";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { AppCrash } from "./error/AppCrash";
import { IEventTicket, IMyTicket } from "@/lib/types";
import { ipfsToHttp } from "@/util/help";
import DialogResell from "@/components/DialogResell";
import { ethers } from "ethers";
import ResaleMarketplaceABI from "@/abi/ResaleMarketplace.json";

export const MyTickets = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { user } = useAuth();

  const { data, isLoading, error } = useQuery({
    queryKey: ["my-ticket"],
    queryFn: () => {
      return getMyTickets(1, 10);
    },
    enabled: isAuthenticated,
    gcTime: 0,
  });

  if (isLoading) return <LoadingSpinner />;
  if (error) return <AppCrash />;

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

  const userTickets = data.tickets;

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-white mb-2">🛒 Vé của tôi</h1>
          <p className="text-gray-400">
            {userTickets.length}{" "}
            {userTickets.length === 1 ? "ticket" : "tickets"} trong ví bạn
          </p>
        </div>

        {userTickets.length === 0 ? (
          <div className="text-center py-16 rounded-2xl bg-white/5 backdrop-blur-lg border border-[#00FF80]/20">
            <p className="text-gray-400 mb-4">Bạn chưa mua vé nào</p>
            <Button
              onClick={() => navigate("/nft")}
              className="bg-[#00FF80] text-black hover:bg-[#00FF80]/90"
            >
              Đến chợ
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userTickets.map((ticket: IMyTicket) => (
              <div
                key={ticket.event.eventId}
                className="rounded-2xl bg-white/5 backdrop-blur-lg border border-[#00FF80]/20 overflow-hidden hover:shadow-[0_0_25px_rgba(0,255,128,0.4)] transition-all duration-300"
              >
                <div className="aspect-[16/9] relative overflow-hidden">
                  {ticket.isResell == true && (
                    <div className="absolute -top-2 -right-2  p-3 ">
                      <TicketPercent className="text-xl bg-red-500 text-white w-16 h-10 rounded-lg shadow-lg border-2 " />
                    </div>
                  )}
                  <img
                    src={ipfsToHttp(ticket.event.coverImage)}
                    alt={""}
                    className="w-full aspect-square object-cover rounded-lg shadow-lg"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                </div>

                <div className="p-5 space-y-4">
                  <div>
                    <h3 className="text-white mb-1">{ticket.event.title}</h3>
                    <p className="text-[#00FF80] text-[0.875rem]">
                      {ticket.stageName}
                    </p>
                  </div>

                  <div className="space-y-2 text-[0.875rem]">
                    <div className="flex items-center gap-2 text-gray-400">
                      <Calendar size={14} className="text-[#00FF80]" />
                      <span>
                        {new Date(ticket.event.date).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <MapPin size={14} className="text-[#00FF80]" />
                      <span className="truncate">{ticket.event.location}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="flex-1 bg-[#00FF80] text-black hover:bg-[#00FF80]/90">
                          <QrCode size={16} className="mr-2" />
                          Xem QR
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-[#0A0A0A] border-[#00FF80]/30 max-w-md">
                        <DialogHeader>
                          <DialogTitle className="text-white">
                            {ticket.event.title}
                          </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 pt-4">
                          <div className="bg-white p-6 rounded-lg flex justify-center">
                            <QRCodeSVG
                              value={`ticket-${ticket.event.contractAddress}-${ticket.tokenId}`}
                              size={250}
                            />
                          </div>
                          <div className="text-center space-y-2">
                            <p className="text-gray-400 text-[0.875rem]">
                              Quét mã
                            </p>
                            <p className="text-[#00FF80] text-[0.875rem] font-mono">
                              {ticket.event.baseUri}
                            </p>
                          </div>
                          <Button
                            onClick={() =>
                              navigate(`/nft/verify/${ticket.event.baseUri}`)
                            }
                            variant="outline"
                            className="w-full border-[#00FF80]/30 text-[#00FF80]"
                          >
                            Xác minh
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>

                    {!ticket.isResell && (
                      <DialogResell
                        contractAddress={ticket.event.contractAddress}
                        title={ticket.event.title}
                        userTicketId={ticket.userTicketId}
                        oldPrice={ticket.event.price}
                        resaleMarketplaceAddress={
                          import.meta.env.VITE_RESALE_CONTRACT_ADDRESS
                        }
                        tokenId={ticket.tokenId}
                      />
                    )}
                  </div>

                  <div className="pt-3 border-t border-[#00FF80]/20 text-[0.75rem] text-gray-400">
                    Mua vào ngày:{" "}
                    {new Date(ticket.event.createdAt).toLocaleDateString()}
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
