import React from "react";
import { NavbarHorizontal } from "@/components/NavbarHorizontal";
import { Outlet } from "react-router-dom";
import { Store, Ticket } from "lucide-react";
import DialogWallet from "@/components/DiaLogWallet";

const navItems = [
  { name: "Chợ", path: "/nft", icon: Store },
  { name: "Vé của tôi", path: "/nft/my-ticket", icon: Ticket },
];
export const NFTPage: React.FC = () => {
  return (
    <div className="p-5 pb-32">
      <div className="flex items-center">
        <NavbarHorizontal navItems={navItems} navActive={["/nft"]} />
        <DialogWallet />
      </div>
      <Outlet />
    </div>
  );
};
