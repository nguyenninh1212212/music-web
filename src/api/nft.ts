import api from "./axios";

// Lấy danh sách ticket (NFT)
export const getTickets = async (page?: number, limit?: number) => {
  const res = await api.get("/nfts", {
    params: { page, limit },
  });
  console.log("🚀 ~ getTickets ~ res:", res.data);
  return res.data;
};
export const getMyTickets = async (page?: number, limit?: number) => {
  const res = await api.get("/nfts/my-ticket", {
    params: { page, limit },
  });
  console.log("🚀 ~ getTickets ~ res:", res.data);
  return res.data;
};

// Tạo ticket mới (NFT)
export const createTicket = async (
  contractAddress: string,
  baseUrl: string,
  saleDeadline: String,
  date: String,
  price: String,
  location: String,
  title: String,
  maxSupply: Number,
  coverImage: string
) => {
  console.log("🚀 ~ createTicket ~ date:", date);
  console.log("🚀 ~ createTicket ~ saleDeadline:", saleDeadline);
  const res = await api.post("/nfts/create-ticket", {
    contractAddress,
    baseUrl,
    date,
    saleDeadline,
    price,
    location,
    title,
    maxSupply,
    coverImage,
  });
  console.log("🚀 ~ createTicket ~ res:", res);
  return res.data;
};

// Ghi nhận giao dịch mua NFT (log purchase)
export const logPurchase = async (payload: {
  eventId: string;
  tokenId: string;
  txHash: string;
}) => {
  const res = await api.post("/nfts/log-purchase", payload);
  console.log("🚀 ~ logPurchase ~ res:", res);
  return res.data;
};

// Admin: Set fee
export const setFee = async (newFee: number) => {
  const res = await api.post("/nfts/set-fee", { newFee });
  console.log("🚀 ~ setFee ~ res:", res);
  return res.data;
};

// Admin: Set wallet
export const setWallet = async (newWallet: string) => {
  const res = await api.post("/nfts/set-wallet", { newWallet });
  console.log("🚀 ~ setWallet ~ res:", res);
  return res.data;
};

// ================================
// 1️⃣ Get all tickets listed for resale
// ================================
export const getResellTickets = async (page?: number, limit?: number) => {
  const res = await api.get("/nfts/resell", {
    params: { page, limit },
  });
  return res.data;
};
export const getArtistTickets = async (page?: number, limit?: number) => {
  const res = await api.get("/nfts/artist-ticket", {
    params: { page, limit },
  });
  return res.data;
};
// ================================
// 2️⃣ List ticket for resale
// ================================
export const listResellTicket = async (userTicketId: string, price: string) => {
  const res = await api.post("/nfts/resell", { userTicketId, price });
  return res.data;
};

// ================================
// 3️⃣ Buy a ticket from resale
// ================================
export const buyResellTicket = async (resellTicketId: string) => {
  const res = await api.post("/nfts/resell/buy", { resellTicketId });
  return res.data;
};

// ================================
// 4️⃣ Update resell ticket status (toggle isSold) by seller/admin
// ================================
export const updateResellTicketClient = async (resellId: string) => {
  const res = await api.patch(`/nfts/resell/${resellId}`);
  return res.data;
};

// ================================
// 5️⃣ Update ticket status (admin) e.g., active/inactive
// ================================
export const updateTicketStatusClient = async (
  ticketId: string,
  status: string
) => {
  const res = await api.post(`/nfts/update-status/${ticketId}`, null, {
    params: { status },
  });
  return res.data;
};
