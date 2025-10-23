import React from "react";
import { Music } from "lucide-react";

export const LoadingSpinner: React.FC = () => {
  return (
    // Thêm 'flex' vào đây
    <div className="fixed flex items-center justify-center h-screen top-0 bottom-0 left-0 right-0 bg-[#0A0A0A]">
      <div className="text-center">
        <Music className="w-16 h-16 text-[#00FF80] mx-auto mb-4 animate-pulse" />
        <p className="text-gray-400">Loading...</p>
      </div>
    </div>
  );
};
