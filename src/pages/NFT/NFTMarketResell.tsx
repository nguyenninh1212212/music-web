import { useQuery } from "@tanstack/react-query";
import { getResellTickets } from "@/api/nft";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { AppCrash } from "./error/AppCrash";
import { IResellTicket } from "@/lib/types";
import { ResellTicketCard } from "@/components/ResellTicketCard";

export const NFTMarketResell = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["nft-resell"],
    queryFn: async () => {
      return getResellTickets();
    },
    gcTime: 2,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
  if (isLoading) return <LoadingSpinner />;
  if (error) return <AppCrash />;

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <div className="container mx-auto px-4 py-8">
        {/* Filters */}

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
            <p className="text-gray-400">Không có vé nào trong này</p>
          </div>
        )}
      </div>
    </div>
  );
};
