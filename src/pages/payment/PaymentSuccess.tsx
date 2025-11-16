import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Check, ArrowRight } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams, useNavigate, Link } from "react-router-dom"; // Thêm useNavigate và Link
import { IOrderDetails } from "@/lib/types";
import paymentApi from "@/api/paymentApi";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { formatDate } from "@/util/help";
import { Button } from "@/components/ui/button";

// 2. Định dạng phương thức thanh toán
const formatPaymentMethod = (
  paymentType: "paypal" | "credit_card" | "bank_transfer"
) => {
  switch (paymentType) {
    case "paypal":
      return "PayPal";
    case "credit_card":
      return "Thẻ Tín Dụng";
    case "bank_transfer":
      return "Chuyển khoản Ngân hàng";
    default:
      return "Không xác định";
  }
};

export function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  // --- Thêm các hook cần thiết ---
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(20); // Đếm ngược 10 giây

  const { data, isLoading, error } = useQuery<{ order: IOrderDetails }>({
    queryKey: ["orderDetails", token], // Thêm token vào queryKey
    queryFn: async () => await paymentApi.getOrderDetails(token || ""),
    enabled: !!token, // Chỉ chạy query khi có token
  });
  console.log("🚀 ~ PaymentSuccess ~ data:", data);

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["subscriptionPlans"] });

    // 2. Tự động chuyển hướng sau 10 giây
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    const redirectTimeout = setTimeout(() => {
      navigate("/"); // Chuyển về trang chủ (hoặc /subscribe)
    }, 10000);

    // Cleanup timers
    return () => {
      clearInterval(timer);
      clearTimeout(redirectTimeout);
    };
  }, [queryClient, navigate]);

  if (isLoading) return <LoadingSpinner />;
  if (error || !data)
    return <div>Error loading order details. Please contact support.</div>;
  const order = data.order;
  // UI/UX mới: Sạch sẽ, tinh gọn và data-driven
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="bg-white dark:bg-gray-950 rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden"
      >
        {/* Phần Header */}
        <div className="p-8 md:p-10 text-center border-b border-gray-200 dark:border-gray-800">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              delay: 0.2,
              type: "spring",
              stiffness: 300,
              damping: 15,
            }}
            className="w-16 h-16 bg-green-100 dark:bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-5"
          >
            <Check
              className="w-8 h-8 text-green-600 dark:text-green-400"
              strokeWidth={3}
            />
          </motion.div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Thanh toán thành công!
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Cảm ơn bạn đã thanh toán hóa đơn {`#${order.orderId}`}
          </p>
        </div>

        {/* Phần Chi tiết Hóa đơn (Data-driven) */}
        <div className="p-8 md:p-10 space-y-4">
          <div className="text-center mb-6">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              TỔNG CỘNG
            </p>
            <p className="text-4xl font-bold text-gray-900 dark:text-white">
              {/* SỬ DỤNG DỮ LIỆU ĐỘNG */}
              {order.amount} {order.currencyCode}
            </p>
          </div>

          {/* Chi tiết giao dịch */}
          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6 space-y-4 border border-gray-200 dark:border-gray-800">
            {/* LƯU Ý: Gói "Premium" là tạm hardcode vì API không trả về tên gói */}
            <ReceiptRow
              label="Gói đăng ký"
              value={`${order.item?.name}`}
              isBold
            />

            {/* SỬ DỤNG DỮ LIỆU ĐỘNG */}
            <ReceiptRow
              label="Mã giao dịch"
              value={order.transactionId}
              isMono
            />
            {/* SỬ DỤNG DỮ LIỆU ĐỘNG */}
            <ReceiptRow
              label="Ngày thanh toán"
              value={formatDate(order.createdAt)}
            />
            {/* SỬ DỤNG DỮ LIỆU ĐỘNG */}
            <ReceiptRow
              label="Phương thức"
              value={formatPaymentMethod(order.method)}
            />
          </div>
        </div>

        {/* Phần Footer (Call to Action) */}
        <div className="p-8 md:p-10 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-800">
          <Button
            asChild
            className="w-full h-12 text-base bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Link to="/">
              Về trang chủ
              <ArrowRight size={18} className="ml-2" />
            </Link>
          </Button>
          <p className="text-center text-gray-500 dark:text-gray-400 text-sm mt-4">
            Tự động chuyển hướng sau {countdown} giây...
          </p>
        </div>
      </motion.div>
    </div>
  );
}

const ReceiptRow = ({
  label,
  value,
  isBold = false,
  isMono = false,
}: {
  label: string;
  value: string;
  isBold?: boolean;
  isMono?: boolean;
}) => (
  <div className="flex justify-between items-center text-sm">
    <span className="text-gray-600 dark:text-gray-400">{label}</span>
    <span
      className={`
        ${
          isBold
            ? "font-bold text-gray-900 dark:text-white"
            : "text-gray-800 dark:text-gray-200"
        }
        ${isMono ? "font-mono text-xs" : ""}
      `}
    >
      {value}
    </span>
  </div>
);
