import React from "react";
import { Link, useLocation } from "react-router-dom";
// ... (các import icon giữ nguyên)
import { useAuth } from "../contexts/AuthContext";
import {
  CreditCard,
  Dock,
  Heart,
  History,
  Home,
  ListMusic,
  Music,
  Settings,
  User,
} from "lucide-react";

const navItems = [
  { name: "Trang chủ", path: "/", icon: Home },
  { name: "Playlists", path: "/playlists", icon: ListMusic },
  { name: "Yêu thích", path: "/favourites", icon: Heart },
  { name: "Gói đăng ký", path: "/subscription", icon: CreditCard },
  { name: "Cài đặt", path: "/settings", icon: Settings },
  { name: "Lịch sử nghe", path: "/history", icon: History },
];

const navArtist = [
  { name: "Hồ sơ nghệ sĩ", path: "/my-artist-profile", icon: User },
  {
    name: "Đăng ký nghệ sỹ",
    path: "/artist-register",
    icon: User,
  },
];

export const Sidebar: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const isArtist = user?.user.artistId;
  const subscriptions = user?.user?.subscription?.map((e) => e) || [];
  const subscriptionArtist = subscriptions.find((e) => e.name === "ARTIST");

  const loca = location.pathname;

  const allRootPaths = [
    ...navItems.map((item) => item.path),
    ...(isArtist ? navArtist.map((item) => item.path) : []),
  ];

  const otherRootPaths = allRootPaths.filter((p) => p !== "/");

  return (
    <aside className="w-64 bg-[#0A0A0A] border-r border-gray-800 h-screen fixed left-0 top-0 flex flex-col">
      {/* Logo (giữ nguyên) */}
      <div className="p-6 border-b border-gray-800">
        <Link to="/" className="flex items-center gap-2">
          <Music className="w-8 h-8 text-[#00FF80]" />
          <span className="text-xl text-white font-bold">MusicStream</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;

            // --- LOGIC ISACTIVE ĐÃ SỬA ---
            let isActive;
            if (item.path === "/") {
              isActive = !otherRootPaths.some((p) => loca.startsWith(p));
            } else {
              isActive = loca.startsWith(item.path);
            }
            // --- KẾT THÚC SỬA ---

            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? "bg-[#00FF80]/10 text-[#00FF80] shadow-[0_0_20px_rgba(0,255,128,0.3)]"
                      : "text-gray-400 hover:text-white hover:bg-gray-800/50"
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 ${
                      isActive
                        ? "drop-shadow-[0_0_8px_rgba(0,255,128,0.8)]"
                        : ""
                    }`}
                  />
                  <span>{item.name}</span>
                </Link>
              </li>
            );
          })}

          {/* Artist Links (giữ nguyên logic 'startsWith') */}
          {subscriptionArtist && (
            <>
              <li className="pt-4 mt-4 border-t border-gray-800">
                <p className="px-4 py-2 text-xs text-gray-500 uppercase tracking-wider">
                  Công cụ nghệ sĩ
                </p>
              </li>

              {isArtist ? (
                // Nếu có subscription ARTIST → hiện Hồ sơ nghệ sĩ + NFT dashboard
                <>
                  {navArtist
                    .filter((item) => item.name !== "Đăng ký nghệ sỹ") // ẩn "Đăng ký nghệ sỹ"
                    .map((item) => {
                      const Icon = item.icon;
                      const isActive = loca.startsWith(item.path);
                      return (
                        <li key={item.path}>
                          <Link
                            to={item.path}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                              isActive
                                ? "bg-[#00FF80]/10 text-[#00FF80] shadow-[0_0_10px_rgba(0,255,128,0.3)]"
                                : "text-gray-400 hover:text-white hover:bg-[#1A1A1A]"
                            }`}
                          >
                            <Icon
                              className={`w-5 h-5 ${
                                isActive
                                  ? "drop-shadow-[0_0_8px_rgba(0,255,128,0.8)]"
                                  : ""
                              }`}
                            />
                            <span>{item.name}</span>
                          </Link>
                        </li>
                      );
                    })}
                </>
              ) : (
                // Nếu không có subscription ARTIST → chỉ hiện "Đăng ký nghệ sỹ"
                navArtist
                  .filter((item) => item.name === "Đăng ký nghệ sỹ")
                  .map((item) => {
                    const Icon = item.icon;
                    const isActive = loca.startsWith(item.path);
                    return (
                      <li key={item.path}>
                        <Link
                          to={item.path}
                          className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                            isActive
                              ? "bg-[#00FF80]/10 text-[#00FF80] shadow-[0_0_10px_rgba(0,255,128,0.3)]"
                              : "text-gray-400 hover:text-white hover:bg-[#1A1A1A]"
                          }`}
                        >
                          <Icon
                            className={`w-5 h-5 ${
                              isActive
                                ? "drop-shadow-[0_0_8px_rgba(0,255,128,0.8)]"
                                : ""
                            }`}
                          />
                          <span>{item.name}</span>
                        </Link>
                      </li>
                    );
                  })
              )}
            </>
          )}
        </ul>
      </nav>
    </aside>
  );
};
