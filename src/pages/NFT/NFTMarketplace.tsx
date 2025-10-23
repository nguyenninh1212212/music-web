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

export const NFTMarketplace = () => {
  const { tickets } = useData();
  const [searchTerm, setSearchTerm] = useState("");
  const [genreFilter, setGenreFilter] = useState("all");
  const [priceFilter, setPriceFilter] = useState("all");

  const genres = ["all", ...Array.from(new Set(tickets.map((t) => t.genre)))];

  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch =
      ticket.eventTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.artistName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.venue.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesGenre = genreFilter === "all" || ticket.genre === genreFilter;

    const matchesPrice =
      priceFilter === "all" ||
      (priceFilter === "low" && ticket.priceETH < 0.3) ||
      (priceFilter === "medium" &&
        ticket.priceETH >= 0.3 &&
        ticket.priceETH < 0.5) ||
      (priceFilter === "high" && ticket.priceETH >= 0.5);

    return matchesSearch && matchesGenre && matchesPrice;
  });

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-[3rem] text-white mb-3 bg-gradient-to-r from-[#00FF80] to-white bg-clip-text text-transparent">
            🎟️ NFT Ticket Marketplace
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Discover exclusive events and secure your spot with
            blockchain-verified tickets
          </p>
        </div>

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
        {filteredTickets.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTickets.map((ticket) => (
              <TicketCard key={ticket.id} ticket={ticket} />
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
