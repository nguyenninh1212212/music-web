import React from "react";
import { Link, useLocation } from "react-router-dom";

interface NavItem {
  name: string;
  path: string;
  icon: React.ElementType;
}

interface NavbarProps {
  navItems: NavItem[];
  navActive?: string[];
}
export const NavbarHorizontal: React.FC<NavbarProps> = ({
  navItems,
  navActive = [],
}) => {
  const location = useLocation();
  return (
    <header className="w-full p-2 flex mb-4">
      <nav className="">
        <ul className="flex items-center space-x-4">
          {navItems.map((item) => {
            const Icon = item.icon;

            let isActive;
            if (navActive.includes(item.path)) {
              isActive = location.pathname === item.path;
            } else {
              isActive = location.pathname.startsWith(item.path);
            }

            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? "bg-[#00FF80] text-black "
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
        </ul>
      </nav>
    </header>
  );
};
