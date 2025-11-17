import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useData } from "../../contexts/DataContext";
import { useAuth } from "../../contexts/AuthContext";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Calendar, MapPin, DollarSign, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export const ResellTicket = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getPurchasedTicketById, listForResale } = useData();
  const { user } = useAuth();
  const [newPrice, setNewPrice] = useState("");

  const ticket = getPurchasedTicketById(id || "");

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-gray-400">Please login to resell tickets</p>
          <Button
            onClick={() => navigate("/nft-marketplace")}
            className="bg-[#00FF80] text-black"
          >
            Go to Marketplace
          </Button>
        </div>
      </div>
    );
  }

  if (!ticket || ticket.ownerAddress !== user?.user.walletAddress) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-gray-400">
            Ticket not found or you don't own this ticket
          </p>
          <Button
            onClick={() => navigate("/my-tickets")}
            className="bg-[#00FF80] text-black"
          >
            My Tickets
          </Button>
        </div>
      </div>
    );
  }

  if (ticket.isListed) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-gray-400">
            This ticket is already listed for sale
          </p>
          <Button
            onClick={() => navigate("/my-tickets")}
            className="bg-[#00FF80] text-black"
          >
            My Tickets
          </Button>
        </div>
      </div>
    );
  }

  const handleResell = () => {
    const price = parseFloat(newPrice);
    if (!price || price <= 0) {
      toast.error("Please enter a valid price");
      return;
    }

    listForResale(ticket.purchaseId, price);
    toast.success("Ticket listed for resale!");
    navigate("/my-tickets");
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <div className="container mx-auto px-4 py-8">
        <Button
          onClick={() => navigate("/nft/my-ticket")}
          variant="ghost"
          className="mb-6 text-gray-400 hover:text-white"
        >
          <ArrowLeft size={18} className="mr-2" />
          Back to My Tickets
        </Button>

        <div className="max-w-4xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-white mb-2">💱 Resell NFT Ticket</h1>
            <p className="text-gray-400">List your ticket on the marketplace</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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

              <div className="p-6 space-y-4">
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
                  <p className="text-gray-400 text-[0.875rem] mb-1">
                    Original Purchase Price
                  </p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-white text-[1.5rem]">
                      {ticket.priceETH} ETH
                    </span>
                    <span className="text-gray-400">${ticket.priceUSD}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Resale Form */}
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-lg border border-[#00FF80]/20">
                <h3 className="text-white mb-4">Set Resale Price</h3>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="price" className="text-gray-300">
                      New Price (ETH)
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
                    <h4 className="text-[#00FF80] text-[0.875rem] mb-2">
                      Pricing Tips
                    </h4>
                    <ul className="text-gray-300 text-[0.875rem] space-y-1 list-disc list-inside">
                      <li>Consider current market demand</li>
                      <li>Factor in original purchase price</li>
                      <li>Check similar event listings</li>
                      <li>Be competitive but fair</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-lg border border-[#00FF80]/20">
                <h4 className="text-white mb-3">Important Information</h4>
                <div className="space-y-2 text-[0.875rem] text-gray-400">
                  <p>
                    • Once listed, your ticket will appear on the marketplace
                  </p>
                  <p>• You won't be able to use the ticket after listing</p>
                  <p>• The sale will be executed via smart contract</p>
                  <p>• You'll receive payment in ETH to your wallet</p>
                </div>
              </div>

              <Button
                onClick={handleResell}
                disabled={!newPrice || parseFloat(newPrice) <= 0}
                className="w-full bg-[#00FF80] text-black hover:bg-[#00FF80]/90 shadow-[0_0_20px_rgba(0,255,128,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                List Ticket for Resale
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
