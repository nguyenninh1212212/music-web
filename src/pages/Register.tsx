import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Music } from "lucide-react";

export const Register: React.FC = () => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
    const { register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await register(name, username, password);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#1a1a1a] to-[#0A0A0A] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-[#00FF80] rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-1/3 left-1/3 w-96 h-96 bg-[#00FF80] rounded-full blur-[120px] animate-pulse delay-1000"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Music className="w-12 h-12 text-[#00FF80] drop-shadow-[0_0_15px_rgba(0,255,128,0.8)]" />
            <span
              className="text-3xl text-white"
              style={{ fontWeight: "bold" }}
            >
              MusicStream
            </span>
          </div>
          <h1 className="text-white mb-2">Create Account</h1>
          <p className="text-gray-400">Start your musical journey today</p>
        </div>

        <div className="bg-gray-900/50 backdrop-blur-xl p-8 rounded-2xl border border-gray-800 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="name" className="text-gray-300">
                Full Name
              </Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-2 bg-gray-800/50 border-gray-700 text-white focus:border-[#00FF80] focus:ring-[#00FF80]/20"
                placeholder="John Doe"
                required
              />
            </div>

            <div>
              <Label htmlFor="username" className="text-gray-300">
                username
              </Label>
              <Input
                id="username"
                type="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-2 bg-gray-800/50 border-gray-700 text-white focus:border-[#00FF80] focus:ring-[#00FF80]/20"
                placeholder="your@email.com"
                required
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-gray-300">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-2 bg-gray-800/50 border-gray-700 text-white focus:border-[#00FF80] focus:ring-[#00FF80]/20"
                placeholder="••••••••"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-[#00FF80] hover:bg-[#00FF80]/80 text-black shadow-[0_0_20px_rgba(0,255,128,0.5)] hover:shadow-[0_0_30px_rgba(0,255,128,0.7)] transition-all duration-300"
            >
              Create Account
            </Button>
          </form>

          <p className="text-center text-gray-400 mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-[#00FF80] hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
