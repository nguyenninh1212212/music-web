import React, { createContext, useContext, useState, ReactNode } from "react";

export interface NFTTicket {
  id: string;
  eventTitle: string;
  artistName: string;
  artistId: string;
  date: string;
  venue: string;
  genre: string;
  priceETH: number;
  priceUSD: number;
  totalSupply: number;
  remainingSupply: number;
  image: string;
  seatType: string;
  contractAddress: string;
  description: string;
  isResale?: boolean;
  originalOwner?: string;
}

export interface PurchasedTicket extends NFTTicket {
  purchaseId: string;
  qrCode: string;
  purchaseDate: string;
  ownerAddress: string;
  isUsed: boolean;
  isListed: boolean;
}

interface DataContextType {
  tickets: NFTTicket[];
  purchasedTickets: PurchasedTicket[];
  purchaseTicket: (ticketId: string, userAddress: string) => void;
  listForResale: (purchaseId: string, newPrice: number) => void;
  createTicket: (ticket: Omit<NFTTicket, "id">) => void;
  getTicketById: (id: string) => NFTTicket | undefined;
  getPurchasedTicketById: (id: string) => PurchasedTicket | undefined;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within DataProvider");
  }
  return context;
};

const mockTickets: NFTTicket[] = [
  {
    id: "1",
    eventTitle: "Neon Dreams Festival 2025",
    artistName: "DJ Neon",
    artistId: "artist1",
    date: "2025-12-15",
    venue: "Crypto Arena, Los Angeles",
    genre: "Electronic",
    priceETH: 0.5,
    priceUSD: 1200,
    totalSupply: 500,
    remainingSupply: 350,
    image: "concert electronic",
    seatType: "General Admission",
    contractAddress: "0x1234...5678",
    description:
      "Experience the future of music with cutting-edge visuals and sound.",
  },
  {
    id: "2",
    eventTitle: "Cyber Rock Night",
    artistName: "The Glitchers",
    artistId: "artist2",
    date: "2025-11-20",
    venue: "Digital Dome, New York",
    genre: "Rock",
    priceETH: 0.3,
    priceUSD: 720,
    totalSupply: 300,
    remainingSupply: 120,
    image: "rock concert",
    seatType: "VIP",
    contractAddress: "0xabcd...efgh",
    description: "Rock meets technology in this unforgettable performance.",
  },
  {
    id: "3",
    eventTitle: "Bass Drop Universe",
    artistName: "BassMaster X",
    artistId: "artist3",
    date: "2025-10-30",
    venue: "Metaverse Stadium, Miami",
    genre: "Bass",
    priceETH: 0.4,
    priceUSD: 960,
    totalSupply: 400,
    remainingSupply: 200,
    image: "edm festival",
    seatType: "Floor",
    contractAddress: "0x9876...5432",
    description: "Feel the bass shake your reality at this massive event.",
  },
  {
    id: "4",
    eventTitle: "Future Jazz Sessions",
    artistName: "Quantum Quartet",
    artistId: "artist4",
    date: "2025-11-05",
    venue: "Blockchain Theater, Chicago",
    genre: "Jazz",
    priceETH: 0.25,
    priceUSD: 600,
    totalSupply: 150,
    remainingSupply: 80,
    image: "jazz performance",
    seatType: "Reserved Seating",
    contractAddress: "0xjazz...1234",
    description: "Traditional jazz meets futuristic innovation.",
  },
  {
    id: "5",
    eventTitle: "Techno Awakening",
    artistName: "Circuit Breaker",
    artistId: "artist5",
    date: "2025-12-01",
    venue: "Grid Complex, Berlin",
    genre: "Techno",
    priceETH: 0.35,
    priceUSD: 840,
    totalSupply: 600,
    remainingSupply: 450,
    image: "techno rave",
    seatType: "Standing",
    contractAddress: "0xtech...9999",
    description: "Underground techno in the heart of the digital revolution.",
  },
  {
    id: "6",
    eventTitle: "Synthwave Sunset",
    artistName: "Retro Waves",
    artistId: "artist6",
    date: "2025-10-25",
    venue: "Neon Beach, California",
    genre: "Synthwave",
    priceETH: 0.28,
    priceUSD: 672,
    totalSupply: 250,
    remainingSupply: 100,
    image: "synthwave concert",
    seatType: "Beach Access",
    contractAddress: "0xsynth...7890",
    description: "Ride the waves of nostalgia into the future.",
  },
];

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [tickets, setTickets] = useState<NFTTicket[]>(mockTickets);
  const [purchasedTickets, setPurchasedTickets] = useState<PurchasedTicket[]>(
    []
  );

  const purchaseTicket = (ticketId: string, userAddress: string) => {
    const ticket = tickets.find((t) => t.id === ticketId);
    if (!ticket || ticket.remainingSupply <= 0) return;

    const purchasedTicket: PurchasedTicket = {
      ...ticket,
      purchaseId: `purchase-${Date.now()}`,
      qrCode: `QR-${ticketId}-${Date.now()}`,
      purchaseDate: new Date().toISOString(),
      ownerAddress: userAddress,
      isUsed: false,
      isListed: false,
    };

    setPurchasedTickets([...purchasedTickets, purchasedTicket]);

    setTickets(
      tickets.map((t) =>
        t.id === ticketId ? { ...t, remainingSupply: t.remainingSupply - 1 } : t
      )
    );
  };

  const listForResale = (purchaseId: string, newPrice: number) => {
    const purchasedTicket = purchasedTickets.find(
      (t) => t.purchaseId === purchaseId
    );
    if (!purchasedTicket) return;

    setPurchasedTickets(
      purchasedTickets.map((t) =>
        t.purchaseId === purchaseId ? { ...t, isListed: true } : t
      )
    );

    const resaleTicket: NFTTicket = {
      ...purchasedTicket,
      id: `resale-${purchaseId}`,
      priceETH: newPrice,
      priceUSD: newPrice * 2400,
      isResale: true,
      originalOwner: purchasedTicket.ownerAddress,
    };

    setTickets([...tickets, resaleTicket]);
  };

  const createTicket = (ticket: Omit<NFTTicket, "id">) => {
    const newTicket: NFTTicket = {
      ...ticket,
      id: `ticket-${Date.now()}`,
    };
    setTickets([...tickets, newTicket]);
  };

  const getTicketById = (id: string) => tickets.find((t) => t.id === id);
  const getPurchasedTicketById = (id: string) =>
    purchasedTickets.find((t) => t.purchaseId === id || t.qrCode === id);

  return (
    <DataContext.Provider
      value={{
        tickets,
        purchasedTickets,
        purchaseTicket,
        listForResale,
        createTicket,
        getTicketById,
        getPurchasedTicketById,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
