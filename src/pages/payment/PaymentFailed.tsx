import { motion } from "framer-motion";
import {
  X,
  AlertCircle,
  RefreshCw,
  CreditCard,
  Music2,
  Radio,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function PaymentFailed() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#1a1a1a] to-[#0A0A0A] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="w-full max-w-2xl relative">
        {/* Background Glow Effects */}
        <div className="absolute -top-20 -left-20 w-72 h-72 bg-[#FF0050] rounded-full blur-[120px] opacity-20" />
        <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-[#FF0050] rounded-full blur-[120px] opacity-10" />

        {/* Floating Music Icons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 0.2, y: 0 }}
          transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
          className="absolute -top-10 left-10 text-zinc-600"
        >
          <Music2 size={40} />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 0.2, x: 0 }}
          transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
          className="absolute bottom-10 -right-10 text-zinc-600"
        >
          <Radio size={36} />
        </motion.div>

        <Card className="relative bg-zinc-950/80 backdrop-blur-xl border-zinc-800 shadow-2xl overflow-hidden">
          {/* Animated Border Gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#FF0050]/20 via-transparent to-[#FF0050]/20 animate-pulse" />

          <div className="relative p-8 md:p-12">
            {/* Failed Icon */}
            <motion.div
              initial={{ scale: 0, rotate: 180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 15,
                duration: 0.8,
              }}
              className="w-24 h-24 mx-auto mb-6 relative"
            >
              <div className="absolute inset-0 bg-[#FF0050] rounded-full blur-xl opacity-50 animate-pulse" />
              <div className="relative w-full h-full bg-gradient-to-br from-[#FF0050] to-[#CC0040] rounded-full flex items-center justify-center shadow-lg shadow-[#FF0050]/50">
                <X size={48} className="text-white" strokeWidth={3} />
              </div>
            </motion.div>

            {/* Failed Message */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-center mb-8"
            >
              <h1 className="text-3xl md:text-4xl text-white mb-3">
                Thanh toán thất bại
              </h1>
              <p className="text-zinc-400 text-lg">
                Có lỗi xảy ra trong quá trình xử lý thanh toán
              </p>
            </motion.div>

            {/* Error Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-zinc-900/50 rounded-xl p-6 mb-6 border border-zinc-800"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-[#FF0050]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <AlertCircle size={24} className="text-[#FF0050]" />
                </div>
                <div className="flex-1">
                  <h3 className="text-white mb-1">Lỗi xác thực thẻ</h3>
                  <p className="text-zinc-400 text-sm leading-relaxed">
                    Thẻ của bạn đã bị từ chối. Vui lòng kiểm tra thông tin thẻ
                    hoặc liên hệ với ngân hàng của bạn.
                  </p>
                </div>
              </div>

              <div className="space-y-2 pt-4 border-t border-zinc-800">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-400">Mã lỗi</span>
                  <span className="text-[#FF0050] font-mono">
                    #ERR_CARD_DECLINED
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-400">Thời gian</span>
                  <span className="text-white">30/10/2025 - 14:32</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-400">Gói dịch vụ</span>
                  <span className="text-white">Premium Family - ₫99,000</span>
                </div>
              </div>
            </motion.div>

            {/* Common Issues */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="mb-8"
            >
              <h3 className="text-white mb-4 text-sm">
                Nguyên nhân thường gặp:
              </h3>
              <div className="space-y-3">
                {[
                  "Số dư tài khoản không đủ",
                  "Thông tin thẻ không chính xác",
                  "Thẻ đã hết hạn hoặc bị khóa",
                  "Vượt quá giới hạn giao dịch",
                ].map((issue, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-zinc-600 flex-shrink-0" />
                    <span className="text-zinc-400 text-sm">{issue}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <Button className="bg-gradient-to-r from-[#00FF80] to-[#00CC66] text-black hover:from-[#00CC66] hover:to-[#00FF80] shadow-lg shadow-[#00FF80]/30 h-12 transition-all">
                <RefreshCw size={18} className="mr-2" />
                Thử lại
              </Button>
              <Button
                variant="outline"
                className="border-zinc-700 bg-zinc-900/50 text-white hover:bg-zinc-800 hover:border-[#00FF80] h-12 transition-all"
              >
                <CreditCard size={18} className="mr-2" />
                Đổi phương thức
              </Button>
            </motion.div>

            {/* Support Note */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="mt-6 p-4 bg-zinc-900/30 rounded-lg border border-zinc-800"
            >
              <p className="text-center text-zinc-400 text-sm">
                Cần trợ giúp?{" "}
                <button className="text-[#00FF80] hover:underline">
                  Liên hệ hỗ trợ
                </button>
              </p>
            </motion.div>
          </div>
        </Card>

        {/* Decorative Lines */}
        <div className="absolute top-1/4 -left-32 w-64 h-[1px] bg-gradient-to-r from-transparent via-zinc-700 to-transparent" />
        <div className="absolute bottom-1/4 -right-32 w-64 h-[1px] bg-gradient-to-r from-transparent via-zinc-700 to-transparent" />
      </div>
    </div>
  );
}
