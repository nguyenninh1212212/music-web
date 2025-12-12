// PaginationControls.jsx hoặc PaginationControls.tsx
import React from "react";

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  isPreviousData: boolean; // Dùng để vô hiệu hóa nút Next khi đang tải trang mới
  onPrev: () => void;
  onNext: () => void;
}

const PaginationControls: React.FC<PaginationControlsProps> = ({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  isPreviousData,
  onPrev,
  onNext,
}) => {
  // Tính toán phạm vi item đang hiển thị
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  // Nếu tổng số trang chỉ là 1 hoặc không có item nào, không cần hiển thị phân trang
  if (totalPages <= 1 && totalItems === 0) {
    return null;
  }

  return (
    <div className="flex flex-col md:flex-row items-center justify-between p-4 mt-6 bg-gray-800/50 rounded-lg shadow-lg">
      {/* Thông tin phạm vi hiển thị */}
      <div className="text-sm text-gray-400 mb-3 md:mb-0">
        {totalItems > 0 ? (
          <>
            Hiển thị{" "}
            <span className="font-semibold text-white">{startItem}</span> -{" "}
            <span className="font-semibold text-white">{endItem}</span> trong
            tổng số{" "}
            <span className="font-semibold text-white">{totalItems}</span> mục
          </>
        ) : (
          "Không có dữ liệu"
        )}
      </div>

      {/* Điều khiển Phân trang */}
      <div className="flex items-center gap-3">
        {/* Nút Trước */}
        <button
          onClick={onPrev}
          disabled={currentPage === 1}
          className="flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700/50 border border-gray-700 rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          &larr; Trang Trước
        </button>

        {/* Số Trang */}
        <span className="px-3 py-1 text-sm font-medium text-teal-400 bg-gray-700/80 rounded-lg">
          {currentPage} / {totalPages}
        </span>

        {/* Nút Kế tiếp */}
        <button
          onClick={onNext}
          // Vô hiệu hóa nếu là trang cuối HOẶC đang tải trang mới (isPreviousData/isPlaceholderData)
          disabled={currentPage === totalPages || isPreviousData}
          className="flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700/50 border border-gray-700 rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Trang Kế tiếp &rarr;
        </button>
      </div>
    </div>
  );
};

export default PaginationControls;
