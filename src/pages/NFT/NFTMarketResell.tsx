import { useState } from "react";
import { useData } from "../../contexts/DataContext";
import { TicketCard } from "../../components/TicketCard";
import { Input } from "../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Search, Filter } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getResellTickets } from "@/api/nft";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { AppCrash } from "./error/AppCrash";
import { IEventTicket, IResellTicket } from "@/lib/types";
import { ResellTicketCard } from "@/components/ResellTicketCard";

export const NFTMarketResell = () => {
  const { tickets } = useData();
  const [searchTerm, setSearchTerm] = useState("");
  const [genreFilter, setGenreFilter] = useState("all");
  const [priceFilter, setPriceFilter] = useState("all");

  const { data, isLoading, error } = useQuery({
    queryKey: ["nft-resell"],
    queryFn: async () => {
      return getResellTickets();
    },
  });
  console.log("🚀 ~ NFTMarketResell ~ data:", data);
  if (isLoading) return <LoadingSpinner />;
  if (error) return <AppCrash />;

  const genres = ["all", ...Array.from(new Set(tickets.map((t) => t.genre)))];

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <div className="container mx-auto px-4 py-8">
        {/* Filters */}
        <div className="mb-8 p-6 rounded-2xl bg-white/5 backdrop-blur-lg border border-[#00FF80]/20">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="text-[#00FF80]" size={20} />
            <h3 className="text-white">Filters</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search events, artists, venues..."
                className="pl-10 bg-white/5 border-[#00FF80]/30 text-white placeholder:text-gray-500"
              />
            </div>

            <Select value={genreFilter} onValueChange={setGenreFilter}>
              <SelectTrigger className="bg-white/5 border-[#00FF80]/30 text-white">
                <SelectValue placeholder="Genre" />
              </SelectTrigger>
              <SelectContent className="bg-[#0A0A0A] border-[#00FF80]/30">
                {genres.map((genre) => (
                  <SelectItem
                    key={genre}
                    value={genre}
                    className="text-white hover:bg-[#00FF80]/20"
                  >
                    {genre.charAt(0).toUpperCase() + genre.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={priceFilter} onValueChange={setPriceFilter}>
              <SelectTrigger className="bg-white/5 border-[#00FF80]/30 text-white">
                <SelectValue placeholder="Price Range" />
              </SelectTrigger>
              <SelectContent className="bg-[#0A0A0A] border-[#00FF80]/30">
                <SelectItem
                  value="all"
                  className="text-white hover:bg-[#00FF80]/20"
                >
                  All Prices
                </SelectItem>
                <SelectItem
                  value="low"
                  className="text-white hover:bg-[#00FF80]/20"
                >
                  {"< 0.3 ETH"}
                </SelectItem>
                <SelectItem
                  value="medium"
                  className="text-white hover:bg-[#00FF80]/20"
                >
                  0.3 - 0.5 ETH
                </SelectItem>
                <SelectItem
                  value="high"
                  className="text-white hover:bg-[#00FF80]/20"
                >
                  {"> 0.5 ETH"}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Tickets Grid */}
        {data.tickets.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.tickets.map((ticket: IResellTicket) => (
              <ResellTicketCard
                key={ticket.event.eventId}
                resaleMarketplaceAddress={
                  import.meta.env.VITE_RESALE_CONTRACT_ADDRESS
                }
                ticket={ticket}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-400">
              No tickets found matching your criteria
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
