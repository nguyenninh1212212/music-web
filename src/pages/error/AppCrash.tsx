import { Skull, Music4, RotateCcw, Bug } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AppCrash() {
  return (
    <>
      {/* Icon */}
      <div className="mb-8 relative inline-block">
        <div className="absolute inset-0 bg-emerald-500/20 blur-2xl rounded-full scale-150 animate-pulse"></div>
        <div className="relative bg-gradient-to-br from-red-500/20 via-emerald-500/20 to-emerald-600/20 p-8 rounded-full border border-emerald-500/30 animate-[wiggle_1s_ease-in-out_infinite]">
          <Music4 className="w-24 h-24 text-emerald-400" strokeWidth={1.5} />
          <div className="absolute -top-2 -right-2 bg-black border-2 border-red-500 rounded-full p-2 animate-pulse">
            <Skull className="w-8 h-8 text-red-500" />
          </div>
        </div>
      </div>

      {/* Error code */}
      <div className="mb-4">
        <span className="inline-block px-4 py-2 bg-red-500/10 border border-red-500/30 rounded-full text-red-400 tracking-wider animate-pulse">
          FATAL ERROR
        </span>
      </div>

      {/* Title */}
      <h1 className="mb-4 text-white text-5xl bg-gradient-to-r from-red-300 via-emerald-400 to-red-300 bg-clip-text text-transparent">
        Ứng Dụng Đã Crash
      </h1>

      {/* Description */}
      <p className="mb-4 text-emerald-100/60 max-w-md mx-auto text-lg">
        Rất tiếc! Ứng dụng phát nhạc đã gặp lỗi nghiêm trọng và không thể tiếp
        tục hoạt động.
      </p>

      {/* Error details box */}
      <div className="mb-8 max-w-lg mx-auto">
        <div className="bg-black/50 border border-emerald-500/20 rounded-lg p-4 text-left">
          <div className="flex items-start gap-3 mb-3">
            <Bug className="w-5 h-5 text-red-400 mt-1 flex-shrink-0" />
            <div>
              <p className="text-red-400 text-sm mb-1">
                Exception Type: AudioStreamException
              </p>
              <p className="text-emerald-300/50 text-xs font-mono">
                at PlaybackEngine.processBuffer(line 1847)
              </p>
            </div>
          </div>
          <div className="bg-emerald-950/30 rounded p-3 border border-emerald-500/10">
            <code className="text-emerald-400/70 text-xs font-mono block">
              <div>{"{"}</div>
              <div className="ml-4">"error": "Memory allocation failed",</div>
              <div className="ml-4">
                "timestamp":${new Date().toISOString()},
              </div>
              <div className="ml-4">"status": 0x80004005</div>
              <div>{"}"}</div>
            </code>
          </div>
        </div>
      </div>

      {/* Glitch bars */}
      <div className="flex items-center justify-center gap-1 mb-10 h-16 overflow-hidden">
        {[...Array(25)].map((_, i) => (
          <div
            key={i}
            className="w-1 bg-gradient-to-t from-red-500/60 to-emerald-400/60 rounded-full"
            style={{
              height: `${Math.random() * 80 + 10}%`,
              animation: `glitch ${
                0.5 + Math.random() * 0.5
              }s ease-in-out infinite`,
              animationDelay: `${i * 0.05}s`,
              opacity: Math.random() * 0.5 + 0.3,
            }}
          ></div>
        ))}
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <Button
          className="bg-    emerald-500 hover:bg-emerald-600 text-black px-8 py-6 rounded-full transition-all hover:scale-105 hover:shadow-lg hover:shadow-emerald-500/50 border-0"
          onClick={() => window.location.reload()}
        >
          <RotateCcw className="w-5 h-5 mr-2" />
          Khởi Động Lại
        </Button>

        <Button
          variant="outline"
          className="border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300 px-8 py-6 rounded-full transition-all hover:scale-105 bg-transparent"
        >
          <Bug className="w-5 h-5 mr-2" />
          Báo Lỗi
        </Button>
      </div>

      {/* Footer text */}
      <div className="mt-12 text-red-500/40 uppercase tracking-widest">
        Critical System Failure
      </div>

      {/* Custom animations */}
      <style>{`
        @keyframes wiggle {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-3deg); }
          75% { transform: rotate(3deg); }
        }
        @keyframes glitch {
          0%, 100% { transform: scaleY(1) translateY(0); }
          50% { transform: scaleY(0.3) translateY(-10px); }
        }
      `}</style>
    </>
  );
}
