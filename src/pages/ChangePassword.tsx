import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Music } from "lucide-react";
import { IPasswordData } from "@/lib/types";
import { useMutation } from "@tanstack/react-query";
import userApi from "@/api/auth";
import { toast } from "sonner";

export const ChangePassword: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState<IPasswordData>({
    username: "",
    oldPassword: "",
    newPassword: "",
  });

  const mutate = useMutation({
    mutationFn: async (data: IPasswordData) =>
      await userApi.changePassword(data),
    onSuccess: () => {
      toast.success("Sửa đổi mật khẩu thành công");
      navigate("/login");
    },
    onError: () => toast.error("Sửa đổi mật khẩu thất bại"),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate.mutateAsync(form);
  };

  console.log("Gooogle client" + import.meta.env.VITE_GOOGLE_CLIENT_ID);
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#1a1a1a] to-[#0A0A0A] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#00FF80] rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#00FF80] rounded-full blur-[120px] animate-pulse delay-1000"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <Link
            to={"/"}
            className="flex items-center justify-center gap-2 mb-4"
          >
            <Music className="w-12 h-12 text-[#00FF80] drop-shadow-[0_0_15px_rgba(0,255,128,0.8)]" />
            <span
              className="text-3xl text-white"
              style={{ fontWeight: "bold" }}
            >
              MusicStream
            </span>
          </Link>
        </div>

        <div className="bg-gray-900/50 backdrop-blur-xl p-8 rounded-2xl border border-gray-800 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="email" className="text-gray-300">
                Email hoặc tên tài khoản
              </Label>
              <Input
                id="username"
                type="text"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                className="mt-2 bg-gray-800/50 border-gray-700 text-white focus:border-[#00FF80] focus:ring-[#00FF80]/20"
                placeholder="your@email.com"
                required
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-gray-300">
                Mật khẩu cũ
              </Label>
              <Input
                id="password"
                type="password"
                value={form.oldPassword}
                onChange={(e) =>
                  setForm({ ...form, oldPassword: e.target.value })
                }
                className="mt-2 bg-gray-800/50 border-gray-700 text-white focus:border-[#00FF80] focus:ring-[#00FF80]/20"
                placeholder="••••••••"
                required
              />
            </div>
            <div>
              <Label htmlFor="newPassword" className="text-gray-300">
                Mật khẩu mới
              </Label>
              <Input
                id="newPassword"
                type="password"
                value={form.newPassword}
                onChange={(e) =>
                  setForm({ ...form, newPassword: e.target.value })
                }
                className="mt-2 bg-gray-800/50 border-gray-700 text-white focus:border-[#00FF80] focus:ring-[#00FF80]/20"
                placeholder="••••••••"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-[#00FF80] hover:bg-[#00FF80]/80 text-black shadow-[0_0_20px_rgba(0,255,128,0.5)] hover:shadow-[0_0_30px_rgba(0,255,128,0.7)] transition-all duration-300"
            >
              Đổi mật khẩu
            </Button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700"></div>
              </div>
            </div>
          </div>

          <p className="text-center text-gray-400 mt-6">
            Đã có tài khoản{" "}
            <Link to="/login" className="text-[#00FF80] hover:underline">
              Đăng nhập
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
