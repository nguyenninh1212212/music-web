// useQueryPagination.ts (Phiên bản cuối cùng đã cập nhật)
import { useState } from "react";
// Đã thay đổi import từ "@tanstack/react-query"
import { useQuery, UseQueryOptions, QueryKey } from "@tanstack/react-query";

// [Giữ nguyên Interfaces]
// 1. Định nghĩa cấu trúc dữ liệu Bài hát (Song)
interface SongItem {
  id: string;
  title: string;
  coverImage: string;
  duration: number;
  isFavourite: boolean;
  artist: {
    stageName: string;
  };
}

// 2. Định nghĩa cấu trúc response API thực tế của bạn
interface ActualApiResponseData<T> {
  totalItems: number;
  items: T[]; // Mảng dữ liệu của trang hiện tại (tên là "items")
  currentPage: number;
  totalPages: number;
}
interface ActualApiResponse<T> {
  status: number;
  data: ActualApiResponseData<T>;
}

// Định nghĩa tham số đầu vào cho API function
interface ApiParams {
  page: number;
  size: number;
}

// Định nghĩa đầu ra của hook
interface UseQueryPaginationResult<T> {
  data: T[] | undefined;
  isLoading: boolean;
  isFetching: boolean;
  // Dùng tên này để tương thích với component điều khiển
  isPreviousData: boolean;
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  goToNextPage: () => void;
  goToPrevPage: () => void;
  goToPage: (page: number) => void;
}

/**
 * Custom hook để xử lý logic phân trang và gọi API bằng React Query.
 */
export function useQueryPagination<T>(
  queryKey: QueryKey,
  // apiFn phải trả về Promise<ActualApiResponse<T>>
  apiFn: (params: ApiParams) => Promise<ActualApiResponse<T>>,
  size: number = 30,
  options?: UseQueryOptions<ActualApiResponse<T>, Error>
): UseQueryPaginationResult<T> {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = size;

  const fullQueryKey = [...queryKey, currentPage, pageSize] as const;

  // SỬ DỤNG useQuery
  const {
    data,
    isLoading,
    isFetching,
    isPlaceholderData, // Đây là flag mới thay thế cho isPreviousData
  } = useQuery({
    queryKey: fullQueryKey,
    queryFn: () => apiFn({ page: currentPage, size: pageSize }),
    // Giữ dữ liệu cũ trong khi chuyển trang
    placeholderData: (previousData) => previousData,
    ...options,
  });

  // Lấy dữ liệu từ trường 'data' trong response (data?.data)
  const apiData = data?.data;

  const totalPages = apiData?.totalPages || 1;
  const totalItems = apiData?.totalItems || 0;

  const goToNextPage = () => {
    // Sử dụng isPlaceholderData để kiểm tra trạng thái fetching
    if (currentPage < totalPages && !isPlaceholderData) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return {
    // Trả về mảng "items"
    data: apiData?.items,
    isLoading,
    isFetching,
    // Trả về isPlaceholderData dưới tên isPreviousData để tương thích
    isPreviousData: isPlaceholderData,
    currentPage,
    totalPages,
    totalItems,
    pageSize,
    goToNextPage,
    goToPrevPage,
    goToPage,
  };
}
