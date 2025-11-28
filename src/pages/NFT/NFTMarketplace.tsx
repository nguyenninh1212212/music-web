import { TicketCard } from "../../components/TicketCard";

import { useQuery } from "@tanstack/react-query";
import { getTickets } from "@/api/nft";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { AppCrash } from "./error/AppCrash";
import { IEventTicket } from "@/lib/types";

export const NFTMarketplace = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["nft"],
    queryFn: async () => {
      return getTickets();
    },
    gcTime: 2,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
  if (isLoading) return <LoadingSpinner />;
  if (error) return <AppCrash />;
  console.log("🚀 ~ NFTMarketplace ~ data:", data);

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <div className="container mx-auto px-4 py-8">
        {/* Filters */}

        {/* Tickets Grid */}
        {data.tickets.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.tickets.map((ticket: IEventTicket) => (
              <TicketCard key={ticket.eventId} ticket={ticket} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-400">Không có vé nào trong này</p>
          </div>
        )}
      </div>
    </div>
  );
};
