import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Switch } from "../components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { LogOut, Edit, Music } from "lucide-react";

export const Settings: React.FC = () => {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [role, setRole] = useState(user?.role || "USER");

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleSave = () => {
    updateUser({ name, email, role: role as "USER" | "ARTIST" | "ADMIN" });
    setIsEditing(false);
  };

  return (
    <div className="p-8 pb-32 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-white mb-2">Settings</h1>
        <p className="text-gray-400">Manage your account and preferences</p>
      </div>

      {/* Profile Section */}
      <div className="bg-gray-900/30 rounded-2xl p-8 mb-6 border border-gray-800">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-white">Profile</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
            className="bg-transparent border-gray-700 text-white hover:bg-gray-800/50 hover:border-[#00FF80] hover:text-[#00FF80]"
          >
            <Edit className="w-4 h-4 mr-2" />
            {isEditing ? "Cancel" : "Edit Profile"}
          </Button>
        </div>

        <div className="flex items-start gap-6">
          <Avatar className="w-24 h-24 ring-2 ring-[#00FF80] ring-offset-2 ring-offset-[#0A0A0A]">
            <AvatarImage src={user?.avatar} alt={user?.name} />
            <AvatarFallback className="bg-[#00FF80] text-black text-2xl">
              {user?.name?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 space-y-4">
            <div>
              <Label htmlFor="name" className="text-gray-300">
                Name
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={!isEditing}
                className="mt-2 bg-gray-800/50 border-gray-700 text-white focus:border-[#00FF80] disabled:opacity-50"
              />
            </div>

            <div>
              <Label htmlFor="email" className="text-gray-300">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={!isEditing}
                className="mt-2 bg-gray-800/50 border-gray-700 text-white focus:border-[#00FF80] disabled:opacity-50"
              />
            </div>

            <div>
              <Label
                htmlFor="role"
                className="text-gray-300 flex items-center gap-2"
              >
                Account Role
                <span className="text-xs text-gray-500">(Demo Only)</span>
              </Label>
              <Select
                value={role}
                onValueChange={setRole}
                disabled={!isEditing}
              >
                <SelectTrigger className="mt-2 bg-gray-800/50 border-gray-700 text-white focus:border-[#00FF80] disabled:opacity-50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700 text-white">
                  <SelectItem value="USER">User (Listener)</SelectItem>
                  <SelectItem value="ARTIST">Artist (Creator)</SelectItem>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                </SelectContent>
              </Select>
              {role === "ARTIST" || role === "ADMIN" ? (
                <p className="text-xs text-[#00FF80] mt-1 flex items-center gap-1">
                  <Music className="w-3 h-3" />
                  You can access "Hồ sơ nghệ sĩ của tôi" from the sidebar
                </p>
              ) : null}
            </div>

            {isEditing && (
              <Button
                onClick={handleSave}
                className="bg-[#00FF80] hover:bg-[#00FF80]/80 text-black shadow-[0_0_20px_rgba(0,255,128,0.5)]"
              >
                Save Changes
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Subscription Info */}
      <div className="bg-gray-900/30 rounded-2xl p-8 mb-6 border border-gray-800">
        <h3 className="text-white mb-4">Subscription</h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-300 mb-1">Current Plan</p>
            <p className="text-[#00FF80] capitalize">
              {user?.subscription || "Free"}
            </p>
          </div>
          <Button
            onClick={() => navigate("/subscription")}
            className="bg-[#00FF80] hover:bg-[#00FF80]/80 text-black shadow-[0_0_20px_rgba(0,255,128,0.5)]"
          >
            Upgrade Plan
          </Button>
        </div>
      </div>

      {/* Preferences */}
      <div className="bg-gray-900/30 rounded-2xl p-8 mb-6 border border-gray-800">
        <h3 className="text-white mb-6">Preferences</h3>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white mb-1">Dark Mode</p>
              <p className="text-gray-400 text-sm">
                Use dark theme across the app
              </p>
            </div>
            <Switch
              checked={darkMode}
              onCheckedChange={setDarkMode}
              className="data-[state=checked]:bg-[#00FF80]"
            />
          </div>
        </div>
      </div>

      {/* Logout */}
      <div className="bg-gray-900/30 rounded-2xl p-8 border border-gray-800">
        <Button
          onClick={handleLogout}
          variant="outline"
          className="w-full bg-transparent border-red-900/50 text-red-500 hover:bg-red-900/20 hover:border-red-500"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Log Out
        </Button>
      </div>
    </div>
  );
};
