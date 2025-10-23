import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { MusicPlayerProvider } from "./contexts/MusicPlayerContext";
import { Sidebar } from "./components/Sidebar";
import { MusicPlayerBar } from "./components/MusicPlayerBar";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Home } from "./pages/Home";
import { Playlists } from "./pages/Playlists";
import { PlaylistDetail } from "./pages/PlaylistDetail";
import { Albums } from "./pages/Albums";
import { AlbumDetail } from "./pages/AlbumDetail";
import { Artists } from "./pages/Artists";
import { ArtistDetail } from "./pages/Artist/ArtistDetail";
import { Favourites } from "./pages/Favourites";
import { Settings } from "./pages/Settings";
import { Subscription } from "./pages/Subscription";
import { MusicDetail } from "./pages/MusicDetail";
import { MyArtistProfile } from "./pages/Artist/MyArtistProfile";
import { Search } from "./pages/Search";
import { TrendMusic } from "./pages/TrendMusic";
import { MainPage } from "./pages/MainPage";
import { ArtistDashboard } from "./pages/NFT/ArtistDashboard";
import { DataProvider } from "./contexts/DataContext";
import { MyTickets } from "./pages/NFT/MyTicket";
import { NFTMarketplace } from "./pages/NFT/NFTMarketplace";
import { NFTPage } from "./pages/NFT/NFTPage";
import { ResellTicket } from "./pages/NFT/ResellTicket";
import ProtectedRoute from "./pages/protected/ProtectedRouteProps ";
import { Toaster } from "sonner";

// // Protected Route wrapper
// const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
//   children,
// }) => {
//   const { isAuthenticated } = useAuth();
//   return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
// };

const AppLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0A0A0A] dark overflow-y-auto scrollbar-hide">
      <Sidebar />

      <main className="ml-64 overflow-y-auto scrollbar-hide">
        <Outlet />
      </main>
      <MusicPlayerBar />
    </div>
  );
};

function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<AppLayout />}>
          <Route element={<Home />}>
            <Route index element={<MainPage />} />
            <Route path="search" element={<Search />} />
            <Route path="artists" element={<Artists />} />
            <Route path="albums" element={<Albums />} />
            <Route path="music/trend" element={<TrendMusic />} />
          </Route>
          <Route
            path="playlists"
            element={
              <ProtectedRoute>
                <Playlists />
              </ProtectedRoute>
            }
          />
          <Route path="playlist/:id" element={<PlaylistDetail />} />
          <Route path="album/:id" element={<AlbumDetail />} />
          <Route path="artist/:id" element={<ArtistDetail />} />
          <Route
            path="favourites"
            element={
              <ProtectedRoute>
                <Favourites />
              </ProtectedRoute>
            }
          />
          <Route
            path="settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />
          <Route path="subscription" element={<Subscription />} />
          <Route path="music/:id" element={<MusicDetail />} />
          <Route path="my-artist-profile" element={<MyArtistProfile />} />
          <Route
            path="/resell/:id"
            element={
              <DataProvider>
                <ResellTicket />
              </DataProvider>
            }
          />
          <Route
            path="my-artist-nft"
            element={
              <DataProvider>
                <ArtistDashboard />
              </DataProvider>
            }
          />

          <Route
            path="nft"
            element={
              <DataProvider>
                <NFTPage />
              </DataProvider>
            }
          >
            <Route index element={<NFTMarketplace />} />
            <Route path="my-ticket" element={<MyTickets />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}
export default function App() {
  return (
    <AuthProvider>
      <MusicPlayerProvider>
        <AppRoutes />
        <Toaster richColors position="top-right" />
      </MusicPlayerProvider>
    </AuthProvider>
  );
}
