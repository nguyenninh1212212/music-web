import React from "react";
import { NavbarHorizontal } from "@/components/NavbarHorizontal";
import { Outlet } from "react-router-dom";
import { Music, Flame, Search, Disc, Mic2 } from "lucide-react";

const navItems = [
  { name: "Trang chính", path: "/", icon: Music },
  { name: "Thịnh hành", path: "/music/trend", icon: Flame },
  { name: "Tìm kiếm", path: "/search", icon: Search },
  { name: "Albums", path: "/albums", icon: Disc },
  { name: "Nghệ sĩ", path: "/artists", icon: Mic2 },
];
export const Home: React.FC = () => {
  return (
    <div className="p-5 pb-32"> 
      {/* Hero Banner */}
      <NavbarHorizontal navItems={navItems} navActive={["/"]} />
      <Outlet />
    </div>
  );
};
