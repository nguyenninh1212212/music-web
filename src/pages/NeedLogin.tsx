import { AlertCircle, Music2, RefreshCw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export function NeedLogin() {
  return (
    <>
      {/* Icon */}
      <div className="mb-8 relative inline-block">
        <div className="absolute inset-0 bg-emerald-500/20 blur-2xl rounded-full scale-150"></div>
        <div className="relative bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 p-8 rounded-full border border-emerald-500/30">
          <Music2 className="w-24 h-24 text-emerald-400" strokeWidth={1.5} />
          <div className="absolute -top-2 -right-2 bg-black border-2 border-emerald-500 rounded-full p-2">
            <AlertCircle className="w-8 h-8 text-emerald-400" />
          </div>
        </div>
      </div>

      {/* Error code */}
      <div className="mb-4">
        <span className="inline-block px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-emerald-400 tracking-wider">
          Cần phải đăng nhập
        </span>
      </div>

      {/* Sound wave visualization */}
      <div className="flex items-center justify-center gap-1 mb-10 h-16">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="w-1.5 bg-gradient-to-t from-emerald-500/50 to-emerald-400 rounded-full opacity-30"
            style={{
              height: `${Math.random() * 60 + 20}%`,
              animationDelay: `${i * 0.1}s`,
            }}
          ></div>
        ))}
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <Button
          className="bg-emerald-500 hover:bg-emerald-600 text-black px-8 py-6 rounded-full transition-all hover:scale-105 hover:shadow-lg hover:shadow-emerald-500/50 border-0"
          onClick={() => window.location.reload()}
        >
          <RefreshCw className="w-5 h-5 mr-2" />
          Thử Lại
        </Button>

        <Button
          variant="outline"
          className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 hover:text-emerald-300 px-8 py-6 rounded-full transition-all hover:scale-105 bg-transparent"
          onClick={() => (window.location.href = "/")}
        >
          <Home className="w-5 h-5 mr-2" />
          Về Trang Chủ
        </Button>
      </div>

      {/* Footer text */}
      <div className="mt-12 text-emerald-500/40 uppercase tracking-widest">
        Music Player Error
      </div>
    </>
  );
}
