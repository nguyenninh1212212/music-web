import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function UnauthorizedPage() {
  const navigate = useNavigate();
  const handleLogin = () => {
    navigate("/login");
  };
  const handleRegister = () => {
    navigate("/register");
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] relative overflow-hidden">
      <div className="absolute top-[-100px] left-[-100px] w-96 h-96 bg-[#00FF80] opacity-20 blur-[120px] rounded-full animate-pulse   " />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#00FF80] opacity-15 blur-[120px] rounded-full" />
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4">
        <div className="mb-8 relative">
          <div className="absolute inset-0 bg-[#00FF80] opacity-50 blur-2xl rounded-full" />
        </div>

        <Button
          onClick={handleLogin}
          className="relative group px-12 py-6 bg-[#00FF80] hover:bg-[#00FF80] text-black rounded-full transition-all duration-300 shadow-[0_0_40px_rgba(0,255,128,0.4)] hover:shadow-[0_0_60px_rgba(0,255,128,0.6)] hover:scale-105 border-2 border-[#00FF80]"
        >
          <span className="relative z-10 tracking-wide">
            Đăng nhập để tiếp tục
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full" />
        </Button>

        {/* Alternative Options */}
        <div className="mt-8 flex flex-col items-center gap-3">
          <button
            className="text-gray-500 hover:text-[#00FF80] transition-colors duration-300 underline underline-offset-4"
            onClick={handleRegister}
          >
            Chưa có tài khoản? Đăng ký miễn phí
          </button>
        </div>

        {/* Footer Note */}
        <div className="absolute bottom-8 text-center text-gray-600 text-sm">
          <p>Tiếp tục tức là bạn đồng ý với Điều khoản Dịch vụ</p>
        </div>
      </div>
      <div className="absolute bottom-[-100px] right-[-100px] w-96 h-96 bg-[#00FF80] opacity-20 blur-[120px] rounded-full animate-pulse   " />

      {/* Animated Border Effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00FF80]/50 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00FF80]/50 to-transparent" />
      </div>
    </div>
  );
}
