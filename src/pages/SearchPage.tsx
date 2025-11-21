import React from "react";
import { NavbarHorizontal } from "@/components/NavbarHorizontal";
import { Outlet } from "react-router-dom";
import { Music, Flame, Search, Disc, Mic2, AudioWaveform } from "lucide-react";

const navItems = [
  { name: "Tìm ", path: "/search", icon: Search },
  { name: "Tìm theo nhạc", path: "/search/audio", icon: AudioWaveform },
];
export const SearchPage: React.FC = () => {
  return (
    <div className="p-5 pb-32">
      <NavbarHorizontal navItems={navItems} navActive={["/search"]} />
      <Outlet />
    </div>
  );
};
