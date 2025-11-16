import { useState } from "react";
import { NFTTicket } from "../contexts/DataContext";
import { Calendar, MapPin, Coins } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { PurchaseDialog } from "../pages/NFT/PurchaseDialog";
import { IEventTicket } from "@/lib/types";
import { ipfsToHttp } from "@/util/help";

interface TicketCardProps {
  ticket: IEventTicket;
}

export const TicketCard = ({ ticket }: TicketCardProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  return (
    <>
      <div
        className="group relative rounded-2xl bg-white/5 backdrop-blur-lg border border-[#00FF80]/20 overflow-hidden hover:shadow-[0_0_25px_rgba(0,255,128,0.4)] transition-all duration-300 hover:scale-[1.02] cursor-pointer"
        onClick={() => setDialogOpen(true)}
      >
        <div className="aspect-[16/9] overflow-hidden relative">
          <img
            src={ipfsToHttp(ticket?.coverImage)}
            alt={ticket?.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          {ticket.status == "active" && (
            <Badge className="absolute top-3 right-3 bg-yellow-500/90 text-black border-0">
              Resale
            </Badge>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        </div>

        <div className="p-5 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h3 className="text-white truncate group-hover:text-[#00FF80] transition-colors duration-300">
                {ticket.title}
              </h3>
              <p className="text-[#00FF80] text-[0.875rem] mt-1">
                {ticket.stageName}
              </p>
            </div>
          </div>

          <div className="space-y-2 text-[0.875rem]">
            <div className="flex items-center gap-2 text-gray-400">
              <Calendar size={14} className="text-[#00FF80]" />
              <span>
                {new Date(ticket.date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <MapPin size={14} className="text-[#00FF80]" />
              <span className="truncate">{ticket.location}</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-[#00FF80]/20">
            <div>
              <div className="flex items-center gap-2">
                <Coins size={18} className="text-[#00FF80]" />
                <span className="text-white">{ticket.price} ETH</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[0.75rem] text-gray-400">Remaining</p>
              <p className="text-white">
                {ticket.mintedCount}/{ticket.maxSupply}
              </p>
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              onClick={(e) => {
                e.stopPropagation();
                setDialogOpen(true);
              }}
              disabled={ticket.maxSupply - ticket.mintedCount === 0}
              className="flex-1 bg-[#00FF80] text-black hover:bg-[#00FF80]/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {ticket.maxSupply === 0 ? "Sold Out" : "Buy Ticket"}
            </Button>
            <Button
              onClick={(e) => {
                e.stopPropagation();
                setDialogOpen(true);
              }}
              variant="outline"
              className="border-[#00FF80]/30 text-[#00FF80] hover:bg-[#00FF80]/10"
            >
              Details
            </Button>
          </div>
        </div>
      </div>

      <PurchaseDialog
        ticket={ticket}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </>
  );
};
