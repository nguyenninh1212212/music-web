import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useData } from "../../contexts/DataContext";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Upload, TrendingUp, Ticket, DollarSign } from "lucide-react";
import { toast } from "sonner";

export const ArtistDashboard = () => {
  const navigate = useNavigate();
  const { user, isArtist } = useAuth();
  const { tickets, createTicket } = useData();

  const [formData, setFormData] = useState({
    eventTitle: "",
    date: "",
    venue: "",
    genre: "",
    priceETH: "",
    totalSupply: "",
    seatType: "",
    description: "",
    image: "",
  });

  if (!user || !isArtist) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-gray-400">Artist access only</p>
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

  const artistTickets = tickets.filter(
    (t) => t.artistId === "artist1" || t.artistName === user.name
  );

  const handleCreateTicket = () => {
    if (
      !formData.eventTitle ||
      !formData.date ||
      !formData.priceETH ||
      !formData.totalSupply
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    createTicket({
      eventTitle: formData.eventTitle,
      artistName: user.name,
      artistId: user.id,
      date: formData.date,
      venue: formData.venue,
      genre: formData.genre,
      priceETH: parseFloat(formData.priceETH),
      priceUSD: parseFloat(formData.priceETH) * 2400,
      totalSupply: parseInt(formData.totalSupply),
      remainingSupply: parseInt(formData.totalSupply),
      image: formData.image || "concert music",
      seatType: formData.seatType,
      contractAddress: `0x${Math.random()
        .toString(16)
        .slice(2, 10)}...${Math.random().toString(16).slice(2, 6)}`,
      description: formData.description,
    });

    toast.success("NFT Ticket created successfully!");

    setFormData({
      eventTitle: "",
      date: "",
      venue: "",
      genre: "",
      priceETH: "",
      totalSupply: "",
      seatType: "",
      description: "",
      image: "",
    });
  };

  const totalSold = artistTickets.reduce(
    (sum, t) => sum + (t.totalSupply - t.remainingSupply),
    0
  );
  const totalEarnings = artistTickets.reduce(
    (sum, t) => sum + (t.totalSupply - t.remainingSupply) * t.priceETH,
    0
  );

  const salesData = [
    { month: "Jan", sales: 12 },
    { month: "Feb", sales: 19 },
    { month: "Mar", sales: 15 },
    { month: "Apr", sales: 28 },
    { month: "May", sales: 35 },
    { month: "Jun", sales: 42 },
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-white mb-2">🎤 Artist NFT Dashboard</h1>
          <p className="text-gray-400">Welcome back, {user.name}</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="p-6 rounded-2xl bg-gradient-to-br from-[#00FF80]/20 to-[#00FF80]/5 border border-[#00FF80]/30">
            <div className="flex items-center gap-3 mb-2">
              <Ticket className="text-[#00FF80]" size={24} />
              <h3 className="text-white">Total Events</h3>
            </div>
            <p className="text-white text-[2rem]">{artistTickets.length}</p>
          </div>

          <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-500/20 to-blue-500/5 border border-blue-500/30">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="text-blue-400" size={24} />
              <h3 className="text-white">Tickets Sold</h3>
            </div>
            <p className="text-white text-[2rem]">{totalSold}</p>
          </div>

          <div className="p-6 rounded-2xl bg-gradient-to-br from-yellow-500/20 to-yellow-500/5 border border-yellow-500/30">
            <div className="flex items-center gap-3 mb-2">
              <DollarSign className="text-yellow-400" size={24} />
              <h3 className="text-white">Total Earnings</h3>
            </div>
            <p className="text-white text-[2rem]">
              {totalEarnings.toFixed(2)} ETH
            </p>
            <p className="text-gray-400 text-[0.875rem]">
              ${(totalEarnings * 2400).toFixed(2)}
            </p>
          </div>
        </div>

        <Tabs defaultValue="events" className="space-y-6">
          <TabsList className="bg-white/5 border border-[#00FF80]/20">
            <TabsTrigger
              value="events"
              className="data-[state=active]:bg-[#00FF80] data-[state=active]:text-black"
            >
              My Events
            </TabsTrigger>
            <TabsTrigger
              value="create"
              className="data-[state=active]:bg-[#00FF80] data-[state=active]:text-black"
            >
              Create New Ticket
            </TabsTrigger>
            <TabsTrigger
              value="sales"
              className="data-[state=active]:bg-[#00FF80] data-[state=active]:text-black"
            >
              Sales Overview
            </TabsTrigger>
          </TabsList>

          {/* My Events */}
          <TabsContent value="events" className="space-y-4">
            <div className="rounded-2xl bg-white/5 backdrop-blur-lg border border-[#00FF80]/20 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="border-[#00FF80]/20 hover:bg-transparent">
                    <TableHead className="text-[#00FF80]">Event</TableHead>
                    <TableHead className="text-[#00FF80]">Date</TableHead>
                    <TableHead className="text-[#00FF80]">Price</TableHead>
                    <TableHead className="text-[#00FF80]">Sold</TableHead>
                    <TableHead className="text-[#00FF80]">Remaining</TableHead>
                    <TableHead className="text-[#00FF80]">Earnings</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {artistTickets.map((ticket) => {
                    const sold = ticket.totalSupply - ticket.remainingSupply;
                    const earnings = sold * ticket.priceETH;
                    return (
                      <TableRow
                        key={ticket.id}
                        className="border-[#00FF80]/10 hover:bg-white/5"
                      >
                        <TableCell className="text-white">
                          {ticket.eventTitle}
                        </TableCell>
                        <TableCell className="text-gray-400">
                          {new Date(ticket.date).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-white">
                          {ticket.priceETH} ETH
                        </TableCell>
                        <TableCell className="text-[#00FF80]">{sold}</TableCell>
                        <TableCell className="text-gray-400">
                          {ticket.remainingSupply}
                        </TableCell>
                        <TableCell className="text-white">
                          {earnings.toFixed(2)} ETH
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {/* Create New Ticket */}
          <TabsContent value="create" className="space-y-4">
            <div className="p-8 rounded-2xl bg-white/5 backdrop-blur-lg border border-[#00FF80]/20">
              <h3 className="text-white mb-6">Mint New NFT Ticket</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="eventTitle" className="text-gray-300">
                    Event Name *
                  </Label>
                  <Input
                    id="eventTitle"
                    value={formData.eventTitle}
                    onChange={(e) =>
                      setFormData({ ...formData, eventTitle: e.target.value })
                    }
                    className="mt-2 bg-white/5 border-[#00FF80]/30 text-white"
                    placeholder="Neon Dreams Festival 2025"
                  />
                </div>

                <div>
                  <Label htmlFor="date" className="text-gray-300">
                    Event Date *
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) =>
                      setFormData({ ...formData, date: e.target.value })
                    }
                    className="mt-2 bg-white/5 border-[#00FF80]/30 text-white"
                  />
                </div>

                <div>
                  <Label htmlFor="venue" className="text-gray-300">
                    Venue
                  </Label>
                  <Input
                    id="venue"
                    value={formData.venue}
                    onChange={(e) =>
                      setFormData({ ...formData, venue: e.target.value })
                    }
                    className="mt-2 bg-white/5 border-[#00FF80]/30 text-white"
                    placeholder="Crypto Arena, Los Angeles"
                  />
                </div>

                <div>
                  <Label htmlFor="genre" className="text-gray-300">
                    Genre
                  </Label>
                  <Input
                    id="genre"
                    value={formData.genre}
                    onChange={(e) =>
                      setFormData({ ...formData, genre: e.target.value })
                    }
                    className="mt-2 bg-white/5 border-[#00FF80]/30 text-white"
                    placeholder="Electronic, Rock, Jazz..."
                  />
                </div>

                <div>
                  <Label htmlFor="priceETH" className="text-gray-300">
                    Price (ETH) *
                  </Label>
                  <Input
                    id="priceETH"
                    type="number"
                    step="0.01"
                    value={formData.priceETH}
                    onChange={(e) =>
                      setFormData({ ...formData, priceETH: e.target.value })
                    }
                    className="mt-2 bg-white/5 border-[#00FF80]/30 text-white"
                    placeholder="0.5"
                  />
                </div>

                <div>
                  <Label htmlFor="totalSupply" className="text-gray-300">
                    Total Supply *
                  </Label>
                  <Input
                    id="totalSupply"
                    type="number"
                    value={formData.totalSupply}
                    onChange={(e) =>
                      setFormData({ ...formData, totalSupply: e.target.value })
                    }
                    className="mt-2 bg-white/5 border-[#00FF80]/30 text-white"
                    placeholder="500"
                  />
                </div>

                <div>
                  <Label htmlFor="seatType" className="text-gray-300">
                    Seat Type
                  </Label>
                  <Input
                    id="seatType"
                    value={formData.seatType}
                    onChange={(e) =>
                      setFormData({ ...formData, seatType: e.target.value })
                    }
                    className="mt-2 bg-white/5 border-[#00FF80]/30 text-white"
                    placeholder="General Admission, VIP, Floor..."
                  />
                </div>

                <div>
                  <Label htmlFor="image" className="text-gray-300">
                    Image Keywords
                  </Label>
                  <Input
                    id="image"
                    value={formData.image}
                    onChange={(e) =>
                      setFormData({ ...formData, image: e.target.value })
                    }
                    className="mt-2 bg-white/5 border-[#00FF80]/30 text-white"
                    placeholder="concert electronic"
                  />
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="description" className="text-gray-300">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="mt-2 bg-white/5 border-[#00FF80]/30 text-white"
                    placeholder="Tell attendees about this amazing event..."
                    rows={4}
                  />
                </div>
              </div>

              <Button
                onClick={handleCreateTicket}
                className="mt-6 bg-[#00FF80] text-black hover:bg-[#00FF80]/90 shadow-[0_0_20px_rgba(0,255,128,0.3)]"
              >
                <Upload className="mr-2" size={18} />
                Mint NFT Ticket
              </Button>
            </div>
          </TabsContent>

          {/* Sales Overview */}
          <TabsContent value="sales" className="space-y-4">
            <div className="p-8 rounded-2xl bg-white/5 backdrop-blur-lg border border-[#00FF80]/20">
              <h3 className="text-white mb-6">Sales History</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={salesData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#00FF80"
                    opacity={0.1}
                  />
                  <XAxis dataKey="month" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0A0A0A",
                      border: "1px solid #00FF80",
                      borderRadius: "8px",
                      color: "#fff",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="sales"
                    stroke="#00FF80"
                    strokeWidth={3}
                    dot={{ fill: "#00FF80", r: 6 }}
                    activeDot={{ r: 8, stroke: "#00FF80", strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
