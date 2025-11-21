import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { Button } from "./ui/button";

// Kết nối socket server
const socket = io("http://localhost:4000");

export default function SongComments({ songId }: { songId: string }) {
  const { user } = useAuth();
  const [comments, setComments] = useState<
    { id: string; user: { name: string; email: string }; content: string }[]
  >([]);
  const [input, setInput] = useState("");
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const handleLogin = () => {
    navigate("/login");
  };
  useEffect(() => {
    socket.emit("joinSong", {
      songId,
      user: { name: user?.user.name, email: user?.user.email },
    });

    socket.on("updateComments", (data) => {
      setComments((prev) => {
        // Kiểm tra comment cuối cùng là của mình không
        const lastComment = data[data.length - 1];
        const isFromCurrentUser = lastComment?.user.email === user?.user.email;

        // Nếu không phải mình, scroll xuống
        if (!isFromCurrentUser) {
          messagesContainerRef.current?.scrollTo({
            top: messagesContainerRef.current.scrollHeight,
            behavior: "smooth",
          });
        }

        return data;
      });
    });

    return () => {
      socket.emit("leaveSong", { songId });
      socket.off("updateComments");
    };
  }, [songId]);

  const handleSend = () => {
    if (!input.trim()) return;
    socket.emit("newComment", {
      songId,
      user: { name: user?.user.name, email: user?.user.email },
      content: input,
    });
    setInput("");
  };

  return (
    <div className="flex flex-col h-[500px] w-full max-w-md bg-[#121212] rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="px-4 py-2 bg-[#00FF80] text-black font-bold">
        Live Chat
      </div>

      {/* Messages */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto px-4 py-2 space-y-2"
      >
        {comments.map((c) => {
          const isCurrentUser = c.user.email === user?.user.email;
          return (
            <div
              key={c.id}
              className={`flex ${
                isCurrentUser ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`px-3 py-2 rounded-lg max-w-[70%] break-words ${
                  isCurrentUser
                    ? "bg-[#00FF80] text-black"
                    : "bg-[#1E1E1E] text-white"
                }`}
              >
                {!isCurrentUser && (
                  <div className="text-xs text-gray-400 mb-1">
                    {c.user.name}
                  </div>
                )}
                <div>{c.content}</div>
              </div>
            </div>
          );
        })}
      </div>

      {user?.user ? (
        <div className="px-4 py-2 border-t border-gray-700 flex gap-2">
          <input
            className="flex-1 px-3 py-2 rounded-lg bg-[#1E1E1E] text-white focus:outline-none"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <button
            className="px-4 py-2 bg-[#00FF80] text-black rounded-lg font-semibold hover:bg-green-400 transition-colors"
            onClick={handleSend}
          >
            Send
          </button>
        </div>
      ) : (
        <Button
          onClick={handleLogin}
          className="relative group px-12 py-6 bg-[#00FF80] hover:bg-[#00FF80] text-black rounded-full transition-all duration-300 shadow-[0_0_40px_rgba(0,255,128,0.4)] hover:shadow-[0_0_60px_rgba(0,255,128,0.6)] hover:scale-105 border-2 border-[#00FF80]"
        >
          <span className="relative z-10 tracking-wide">
            Đăng nhập để tiếp tục
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full" />
        </Button>
      )}
    </div>
  );
}
