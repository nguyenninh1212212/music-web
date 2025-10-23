import React from "react";
import { NavbarHorizontal } from "@/components/NavbarHorizontal";
import { Outlet } from "react-router-dom";
import { Store, Ticket } from "lucide-react";

const navItems = [
  { name: "Chợ", path: "/nft", icon: Store },
  { name: "Vé của tôi", path: "/nft/my-ticket", icon: Ticket },
];
export const NFTPage: React.FC = () => {
  return (
    <div className="p-5 pb-32">
      {/* SỬA LỖI: "nft" -> "/nft" 
        Để khớp chính xác với path trong navItems
      */}
      <NavbarHorizontal navItems={navItems} navActive={["/nft"]} />
      <Outlet />
    </div>
  );
};
