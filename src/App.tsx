import React from "react";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { MusicPlayerProvider } from "@/contexts/MusicPlayerContext";
import { Sidebar } from "@/components/Sidebar";
import { MusicPlayerBar } from "@/components/MusicPlayerBar";
import { Login } from "@/pages/Login";
import { Register } from "@/pages/Register";
import { Home } from "@/pages/Home";
import { Playlists } from "@/pages/Playlists";
import { PlaylistDetail } from "@/pages/PlaylistDetail";
import { Albums } from "@/pages/Albums";
import { AlbumDetail } from "@/pages/AlbumDetail";
import { Artists } from "@/pages/Artists";
import { ArtistDetail } from "@/pages/Artist/ArtistDetail";
import { Favourites } from "@/pages/Favourites";
import { Settings } from "@/pages/Settings";
import { Subscription } from "@/pages/Subscription";
import { MusicDetail } from "@/pages/MusicDetail";
import { MyArtistProfile } from "@/pages/Artist/MyArtistProfile";
import { SearchPage } from "@/pages/SearchPage";
import { TrendMusic } from "@/pages/TrendMusic";
import { MainPage } from "@/pages/MainPage";

import ProtectedRoute from "@/pages/protected/ProtectedRouteProps ";
import { Toaster } from "sonner";
import { PaymentSuccess } from "@/pages/payment/PaymentSuccess";
import { PaymentFailed } from "@/pages/payment/PaymentFailed";
import ArtistRegistrationForm from "@/pages/Artist/ArtistRegistrationForm";
import AudioSearch from "./components/AudioSearch";
import { Search } from "./pages/Search";
import { HistoryMusic } from "./pages/History";

// Protected Route wrapper
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
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/payment-failed" element={<PaymentFailed />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<AppLayout />}>
          <Route element={<Home />}>
            <Route index element={<MainPage />} />
            <Route path="/search" element={<SearchPage />}>
              <Route index element={<Search />} />
              <Route path="audio" element={<AudioSearch />} />
            </Route>

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
          <Route
            path="history"
            element={
              <ProtectedRoute>
                <HistoryMusic />
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
          <Route
            path="subscription"
            element={
              <ProtectedRoute>
                <Subscription />
              </ProtectedRoute>
            }
          />
          <Route path="music/:id" element={<MusicDetail />} />
          <Route path="my-artist-profile" element={<MyArtistProfile />} />
          <Route path="/artist-register" element={<ArtistRegistrationForm />} />
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
        <PayPalScriptProvider
          options={{ clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID }}
        >
          <AppRoutes />
          <Toaster richColors position="top-right" />
        </PayPalScriptProvider>
      </MusicPlayerProvider>
    </AuthProvider>
  );
}
