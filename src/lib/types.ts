// =======================================================================
// === 1. GENERIC API & UTILITY TYPES
// =======================================================================

export interface PaginationParams {
  page?: number;
  size?: number;
}

export interface PaginatedData<T> {
  items: T[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
}

export interface SuccessMessageResponse {
  message: string;
}

export interface PaypalApproveUrlResponse {
  approveUrl: string;
}

// =======================================================================
// === 2. USER MODEL
// =======================================================================

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  walletAddress: string;
  subscription: "free" | "premium" | "family";
  role?: "USER" | "ARTIST" | "ADMIN";
  artistId?: string;
}

export interface IPasswordData {
  username: string;
  newPassword: string;
  oldPassword: string;
}
export interface IRegisterForm {
  username: string;
  password: string;
  name: string;
}
export interface ILoginForm {
  username: string;
  password: string;
}
export interface IUserForm {
  user: {
    name?: string;
    artistId: string;
    token: string;
    walletAddress?: string;
    avatar: string;
    email: string;
    subscription?: {
      name?: string;
      expiredAt?: string;
    }[];
  };
}

// =======================================================================
// === 3. SONG MODELS
// =======================================================================

export interface SongSummary {
  id: string;
  title: string;
  coverImage: string;
  duration: number;
}

export interface Song extends SongSummary {
  artist: string; // Đây có thể là artistId
  albumId: string;
  song: string; // URL hoặc ID của file âm thanh
  isFavourite?: boolean;
}

export interface ISongCard extends SongSummary {
  song: string;
  artist: {
    stageName: string;
    id: string;
  };
  albumId: string;
  isFavourite: boolean;
}
export interface ISongBar extends SongSummary {
  stageName: string;
  song: string;
  artistId: string;
  albumId: string;
  ads: string;
}

/**
 * Dữ liệu tóm tắt của Song (dùng trong trang Artist).
 */
export interface ISongSummary {
  id: string;
  coverImage: string;
  isVipOnly: boolean;
  title: string;
  song: string;
  view: number;
  createdAt: string;
}

export interface ArtistSong extends Song {
  status: "PUBLISHED" | "DRAFT";
  streams?: number;
}

/**
 * Dữ liệu đầu vào để tạo một Song.
 */
export interface ICreateSong {
  title: string;
  duration: number;
  covereFile: File;
  songFile: File;
}

// =======================================================================
// === 4. ALBUM MODELS
// =======================================================================

/**
 * Model chính cho một Album.
 * (Gộp từ 2 định nghĩa 'Album' của bạn)
 */
export interface Album {
  id: string;
  title: string;
  coverUrl: string;
  artistId: string;
  songs: Song[];
  releaseDate?: string; // Thêm từ file album.js
  createdAt: string;
  updatedAt: string;
}

/**
 * Dữ liệu cho một Album Card (UI).
 */
export interface IAlbumCard {
  id: string;
  coverUrl: string;
  title: string;
  artist?: {
    id: string;
    stageName: string;
  };
}

/**
 * Dữ liệu tóm tắt của Album (dùng trong trang Artist).
 */
export interface IAlbumSummary {
  id: string;
  title: string;
  coverUrl: string;
}

/**
 * Biến thể Album cho trang quản lý của Artist.
 */
export interface ArtistAlbum extends Album {
  trackCount: number;
}

/**
 * Dữ liệu đầu vào để tạo một Album.
 */
export interface ICreateAlbum {
  title: string;
  coverFile: File;
}

// =======================================================================
// === 5. ARTIST MODELS
// =======================================================================

/**
 * Dữ liệu tóm tắt của Artist (dùng cho danh sách GET /artists).
 */
export interface IArtistSummary {
  id: string;
  stageName: string;
  avatarUrl: string;
  verified: boolean;
}
export interface IArtistCreate {
  stageName: string;
  avatarFile: File;
  bannerFile: File;
  verified: boolean;
  bio: string;
  youtubeUrl: string;
  facebookUrl: string;
  instagramUrl: string;
}

/**
 * Dữ liệu cho một Artist Card (UI).
 */
export interface IArtistCard extends IArtistSummary {
  followerCount: number;
  name?: string;
}

/**
 * Dữ liệu chi tiết đầy đủ của Artist (dùng cho GET /:id và GET /me).
 * (Gộp 'Artist' và 'IArtist' của bạn)
 */
export interface IArtist extends IArtistSummary {
  bio: string | null;
  bannerUrl: string | null;
  youtubeUrl: string | null;
  facebookUrl: string | null;
  instagramUrl: string | null;
  albums: IAlbumSummary[];
  songs: ISongSummary[];
  isFollow?: boolean;
  views?: number; // Thêm từ interface 'Artist' cũ
}

/**
 * Dữ liệu tóm tắt của người theo dõi (Follower).
 */
export interface IFollower {
  name: string;
}

// =======================================================================
// === 6. PLAYLIST MODEL
// =======================================================================

/**
 * Model chính cho một Playlist.
 * (Gộp từ 2 định nghĩa 'Playlist' của bạn, chọn cái chi tiết hơn)
 */
export interface Playlist {
  id: string;
  name: string;
  songCount: number;
  songs: {
    id: string;
    coverImage: string;
  }[];
  description?: string;
}

// =======================================================================
// === 7. BILLING MODELS (PLAN, SUBSCRIPTION, PAYMENT)
// =======================================================================

/**
 * Đại diện cho một Gói đăng ký (Plan).
 * (Gộp 'SubscriptionPlan' và 'Plan')
 */
export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  duration: number;
  type: string;
  createdAt: string;
  updatedAt: string;
  subscription: UserSubscription | null;
}

export interface UserSubscription {
  id: string;
  planId: string;
  status: "ACTIVE" | "INACTIVE" | "EXPIRED";
  expiresAt: string;
  createdAt: string;
}

export interface IOrderDetails {
  id: string;
  amount: number;
  method: "paypal" | "credit_card" | "bank_transfer";
  status: string;
  transactionId: string;
  paymentType: "SUBSCRIPTION" | "ALBUM" | "RENEWSUBSCRIPTION";
  createdAt: string;
  currencyCode: string;
  orderId: string;
  item?: {
    id: string;
    name: string;
    price: number;
    duration: number;
    type: string;
  };
}

/**
 * Dữ liệu để tạo Plan (loại bỏ 'id').
 */
export type CreatePlanParams = Omit<SubscriptionPlan, "id">;

/**
 * Đại diện cho Gói đã đăng ký (Subscription) của người dùng.
 */
export interface Subscription {
  id: string;
  userId: string;
  planId: string;
  status: "active" | "expired" | "pending" | "cancelled";
  startDate: string; // ISO Date string
  endDate: string; // ISO Date string
  plan: SubscriptionPlan; // Join với plan
}

/**
 * Đại diện cho một bản ghi Thanh toán (Payment).
 */
export interface Payment {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  status: "completed" | "pending" | "failed";
  paymentMethod: string;
  transactionId: string;
  createdAt: string;
}

export interface IEventTicket {
  artistId: string;
  contractAddress: string;
  eventId: string;
  mintedCount: number;
  status: string;
  stageName: string;
  baseUri: string;
  title: string;
  location: string;
  date: string;
  price: string;
  maxSupply: number;
  coverImage: string;
  createdAt: string;
}
export interface IMyTicket {
  event: IEventTicket;
  isResell: boolean;
  resellPrice: string;
  stageName?: string;
  tokenId: string;
  userTicketId: string;
}

export interface ICreateTicket {
  coverFile: File | null;
  title: string;
  date: string; // Sẽ lưu ở định dạng "YYYY-MM-DDTHH:mm"
  location: string;
  price: string;
  maxSupply: string;
  saleDeadline: string; // Sẽ lưu ở định dạng "YYYY-MM-DDTHH:mm"
}

export interface IResellTicket {
  isSold: false;
  originalTicketId: string;
  price: string;
  resellTicketId: string;
  sellerId: string;
  stageName: string;
  buyerId: string;
  event: IEventTicket;
  tokenId: string;
}
