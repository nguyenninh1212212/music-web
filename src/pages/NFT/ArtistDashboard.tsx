import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { Upload, TrendingUp, Ticket, DollarSign } from "lucide-react";
import { toast } from "sonner";
import { ethers } from "ethers";
import { createTicket } from "@/api/nft";
import { useMutation } from "@tanstack/react-query";
import { ICreateTicket } from "@/lib/types";
import FactoryABI from "../../../../smart-contract-new/artifacts/contracts/TicketFactory.sol/TicketFactory.json";
import { uploadFileToIPFS, uploadJSONToIPFS } from "@/util/ipfs";
import { LocationPicker } from "@/components/LocationPicker";

export const ArtistDashboard = () => {
  const navigate = useNavigate();
  const { user, isArtist } = useAuth();

  const [formData, setFormData] = useState<ICreateTicket>({
    coverFile: null,
    title: "",
    date: "",
    location: "",
    price: "",
    maxSupply: "",
    saleDeadline: "",
  });
  console.log("🚀 ~ ArtistDashboard ~ formData:", formData);

  const [isCreating, setIsCreating] = useState(false);

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
  const mutate = useMutation({
    mutationFn: ({
      contractAddress,
      baseUrl,
      date,
      saleDeadline,
      price,
      location,
      title,
      maxSupply,
      coverImage,
    }: {
      contractAddress: string;
      baseUrl: string;
      date: string;
      saleDeadline: string;
      price: string;
      location: string;
      title: string;
      maxSupply: number;
      coverImage: string;
    }) =>
      createTicket(
        contractAddress,
        baseUrl,
        saleDeadline,
        date,
        price,
        location,
        title,
        maxSupply,
        coverImage
      ),
    onSuccess: () => {
      toast.success("NFT Ticket created successfully!");
      setFormData({
        coverFile: null,
        title: "",
        date: "",
        location: "",
        maxSupply: "",
        price: "",
        saleDeadline: "",
      });
      setIsCreating(false);
    },
    onError: (error: any) => {
      toast.error("NFT create offchain failed: " + (error?.message || error));
      setIsCreating(false);
    },
  });

  const handleCreateTicket = async () => {
    if (isCreating) return;

    try {
      // 1. Validation
      if (
        !formData.title ||
        !formData.date ||
        !formData.price ||
        !formData.maxSupply ||
        !formData.coverFile
      ) {
        return toast.error("Please fill in all required fields");
      }

      if (!window.ethereum) {
        return toast.error("Install MetaMask!");
      }

      setIsCreating(true);
      toast.info("Starting ticket creation process...");

      // 2. Upload image to IPFS
      toast.info("Uploading image to IPFS...");
      const imageResult = await uploadFileToIPFS(formData.coverFile);

      // 3. Create and upload metadata to IPFS
      toast.info("Uploading metadata to IPFS...");
      const metadata = {
        name: formData.title,
        description: `Ticket for ${formData.title}${
          formData.location ? ` at ${formData.location}` : ""
        }`,
        attributes: [
          { trait_type: "Event", value: formData.title },
          { trait_type: "Location", value: formData.location || "TBA" },
          { trait_type: "Date", value: formData.date },
          { trait_type: "Price", value: `${formData.price} ETH` },
        ],
      };

      const metadataCID = await uploadJSONToIPFS(metadata);
      const _baseURI = `ipfs://${metadataCID}/`;
      const factoryAddress = import.meta.env.VITE_CONTRACT_ADDRESS;

      // 4. Connect to blockchain
      toast.info("Connecting to blockchain...");
      const provider = new ethers.BrowserProvider(window.ethereum);

      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const abi = FactoryABI.abi;

      const factoryContract = new ethers.Contract(factoryAddress, abi, signer);

      const code = await provider.getCode(factoryAddress);
      console.log(code.length > 2 ? "Contract exists" : "Not deployed");

      const network = await provider.getNetwork();
      if (network.chainId !== 31337n) {
        return toast.error("Please switch MetaMask to Hardhat (chainId 31337)");
      }
      console.log(
        "🚀 ~ handleCreateTicket ~ factoryContract:",
        factoryContract
      );

      const _price = ethers.parseUnits(formData.price, "ether");
      const _maxSupply = parseInt(formData.maxSupply);

      // Validate and set sale deadline
      let _saleDeadline: number;
      if (formData.saleDeadline) {
        _saleDeadline = Math.floor(
          new Date(formData.saleDeadline).getTime() / 1000
        );
        const now = Math.floor(Date.now() / 1000);

        if (_saleDeadline <= now) {
          setIsCreating(false);
          return toast.error("Sale deadline must be in the future!");
        }
      } else {
        _saleDeadline = Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60;
      }

      // 6. Create ticket contract on blockchain
      toast.info("Creating ticket contract on blockchain...");
      const fn = factoryContract.getFunction("createTicketContract");
      const tx = await factoryContract[fn.name](
        _price,
        _maxSupply,
        _saleDeadline,
        _baseURI
      );

      toast.info("Waiting for transaction confirmation...");
      const receipt = await tx.wait(1);

      const iface = factoryContract.interface;
      let ticketAddress: string | null = null;

      for (const log of receipt.logs) {
        try {
          const parsed = iface.parseLog(log);

          console.log("Parsed:", parsed);

          if (parsed?.name === "TicketContractCreated") {
            ticketAddress = parsed.args.ticketContract; // ethers v6
            break;
          }
        } catch {}
      }

      // Fallback method if event parsing fails
      if (!ticketAddress) {
        console.log("⚠️ Event not found, trying fallback method...");
        await new Promise((resolve) => setTimeout(resolve, 2000));
        ticketAddress = await factoryContract.getLastTicket();

        if (
          !ticketAddress ||
          ticketAddress === "0x0000000000000000000000000000000000000000"
        ) {
          throw new Error("Failed to get ticket contract address!");
        }
      }
      console.log("🚀 ~ handleCreateTicket ~ ticketAddress:", ticketAddress);

      toast.success("Ticket contract created on blockchain!");

      toast.info("Saving ticket to database...");
      setIsCreating(false);
      console.log("🚀 ~ handleCreateTicket ~ formData.date:", formData.date);

      mutate.mutate({
        contractAddress: ticketAddress,
        baseUrl: _baseURI,
        date: formData.date,
        location: formData.location,
        price: formData.price,
        saleDeadline: _saleDeadline.toString(),
        title: formData.title,
        maxSupply: _maxSupply,
        coverImage: imageResult.ipfsUrl,
      });
    } catch (error: any) {
      console.error("❌ Error creating ticket:", error);
      toast.error(
        "Failed to create ticket: " + (error.message || String(error))
      );
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-white mb-2">🎤 Artist NFT Dashboard</h1>
          <p className="text-gray-400">Welcome back, {user?.user.name}</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="p-6 rounded-2xl bg-gradient-to-br from-[#00FF80]/20 to-[#00FF80]/5 border border-[#00FF80]/30">
            <div className="flex items-center gap-3 mb-2">
              <Ticket className="text-[#00FF80]" size={24} />
              <h3 className="text-white">Total Events</h3>
            </div>
            <p className="text-white text-[2rem]">0</p>
          </div>

          <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-500/20 to-blue-500/5 border border-blue-500/30">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="text-blue-400" size={24} />
              <h3 className="text-white">Tickets Sold</h3>
            </div>
            <p className="text-white text-[2rem]">0</p>
          </div>

          <div className="p-6 rounded-2xl bg-gradient-to-br from-yellow-500/20 to-yellow-500/5 border border-yellow-500/30">
            <div className="flex items-center gap-3 mb-2">
              <DollarSign className="text-yellow-400" size={24} />
              <h3 className="text-white">Total Earnings</h3>
            </div>
            <p className="text-white text-[2rem]">0 ETH</p>
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
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center text-gray-400 py-8"
                    >
                      No events yet. Create your first ticket!
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {/* Create New Ticket */}
          <TabsContent value="create" className="space-y-4">
            <div className="p-8 rounded-2xl bg-white/5 backdrop-blur-lg border border-[#00FF80]/20">
              <h3 className="text-white text-xl mb-6">Mint New NFT Ticket</h3>

              {/* Cover Image */}
              <div className="mb-6">
                <Label htmlFor="coverFile" className="text-gray-300">
                  Cover Image *
                </Label>
                <div className="mt-2 flex flex-col gap-3 items-center">
                  {formData.coverFile && (
                    <img
                      src={URL.createObjectURL(formData.coverFile)}
                      alt="Preview"
                      className="w-full max-w-md h-64 object-cover rounded-xl border border-[#00FF80]/30 shadow-lg"
                    />
                  )}
                  <Input
                    id="coverFile"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      setFormData({ ...formData, coverFile: file || null });
                    }}
                    className="bg-white/5 border-[#00FF80]/30 text-white cursor-pointer"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Event Name */}
                <div>
                  <Label htmlFor="eventTitle" className="text-gray-300">
                    Event Name *
                  </Label>
                  <Input
                    id="eventTitle"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="mt-2 bg-white/5 border-[#00FF80]/30 text-white"
                    placeholder="Neon Dreams Festival 2025"
                  />
                </div>

                {/* Event Date */}
                <div>
                  <Label htmlFor="eventDate" className="text-gray-300">
                    Event Date *
                  </Label>
                  <Input
                    id="eventDate"
                    type="datetime-local"
                    value={formData.date}
                    min={new Date().toISOString().slice(0, 16)}
                    onChange={(e) => {
                      setFormData({ ...formData, date: e.target.value });
                    }}
                    className="mt-2 bg-white/5 border-[#00FF80]/30 text-white"
                  />
                </div>

                {/* Location */}
                <div>
                  <Label htmlFor="location" className="text-gray-300 mb-2 ">
                    Location
                  </Label>
                  <LocationPicker
                    value={formData.location}
                    onSelect={(address) =>
                      setFormData({ ...formData, location: address })
                    }
                  />
                </div>

                {/* Sale Deadline */}
                <div className="flex flex-col gap-4">
                  <div>
                    <Label htmlFor="saleDeadline" className="text-gray-300">
                      Sale Deadline (Optional - Default: 7 days)
                    </Label>
                    <Input
                      id="saleDeadline"
                      type="datetime-local"
                      value={formData.saleDeadline}
                      min={new Date().toISOString().slice(0, 16)}
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          saleDeadline: e.target.value,
                        });
                      }}
                      className="mt-2 bg-white/5 border-[#00FF80]/30 text-white"
                    />
                  </div>

                  {/* Price */}
                  <div>
                    <Label htmlFor="priceETH" className="text-gray-300">
                      Price (ETH) *
                    </Label>
                    <Input
                      id="priceETH"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData({ ...formData, price: e.target.value })
                      }
                      className="mt-2 bg-white/5 border-[#00FF80]/30 text-white"
                      placeholder="0.5"
                    />
                  </div>

                  {/* Max Supply */}
                  <div>
                    <Label htmlFor="maxSupply" className="text-gray-300">
                      Max Supply *
                    </Label>
                    <Input
                      id="maxSupply"
                      type="number"
                      min="1"
                      value={formData.maxSupply}
                      onChange={(e) =>
                        setFormData({ ...formData, maxSupply: e.target.value })
                      }
                      className="mt-2 bg-white/5 border-[#00FF80]/30 text-white"
                      placeholder="50"
                    />
                  </div>
                </div>
              </div>

              <Button
                onClick={handleCreateTicket}
                disabled={isCreating}
                className="mt-6 bg-[#00FF80] text-black hover:bg-[#00FF80]/90 shadow-[0_0_20px_rgba(0,255,128,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Upload className="mr-2" size={18} />
                {isCreating ? "Creating..." : "Mint NFT Ticket"}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
