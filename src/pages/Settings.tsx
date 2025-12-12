import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Switch } from "../components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";

import { LogOut, Edit } from "lucide-react";
import { formatDate } from "@/util/help";
import { useMutation, useQuery } from "@tanstack/react-query";
import userApi from "@/api/auth";
import { toast } from "sonner";
import paymentApi from "@/api/paymentApi";
import Loading from "@/components/Loading";
import { Error404 } from "./error/Error404";

export const Settings: React.FC = () => {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.user.name || "");
  const [email, setEmail] = useState(user?.user.email || "");
  const {
    data: paymentsHistory,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["payment history"],
    queryFn: async () => paymentApi.getPaymentHistory(),
    gcTime: 3,
  });
  const mutationUnLinkGG = useMutation({
    mutationFn: async () => await userApi.unLinkGoogle(),
    onSuccess: () => {
      toast.success("SUCCESS");
    },
    onError: (err: any) => {
      toast.error("Error : " + err.response.data.message);
    },
  });

  if (isLoading) return <Loading />;
  if (error) return <Error404 />;
  console.log("🚀 ~ Settings ~ paymentsHistory:", paymentsHistory);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleSave = () => {
    updateUser({ name, email });
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
            <AvatarImage src={user?.user.avatar} alt={user?.user.name} />
            <AvatarFallback className="bg-[#00FF80] text-black text-2xl">
              {user?.user.name?.charAt(0) || "U"}
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
              <Button
                onClick={() => mutationUnLinkGG.mutate()}
                variant="outline"
                className="mt-2 bg-gray-800/50 border-gray-700 text-white focus:border-[#00FF80] disabled:opacity-50 w-full"
              >
                {user?.user.email}
              </Button>
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
        <div className="flex w-full justify-between">
          <h3 className="text-white mb-4">Subscription</h3>
          <Button
            onClick={() => navigate("/subscription")}
            className="bg-[#00FF80] hover:bg-[#00FF80]/80 text-black shadow-[0_0_20px_rgba(0,255,128,0.5)]"
          >
            Upgrade Plan
          </Button>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-300 mb-1">Current Plan</p>
            <p className="text-[#00FF80] capitalize">
              {user?.user.subscription?.map((e) => {
                return (
                  <>
                    {e.name}{" "}
                    <p className="text-sm text-gray-400">
                      {e.expiredAt ? (
                        <>Hết hạn lúc {formatDate(e.expiredAt)}</>
                      ) : (
                        ""
                      )}
                    </p>
                  </>
                );
              }) || "Free"}
            </p>
          </div>
        </div>
      </div>

      {/* Preferences */}
      <div className="bg-gray-900/30 rounded-2xl p-8 mb-6 border border-gray-800">
        <h3 className="text-white mb-6">Payment history</h3>

        <div className="space-y-6">
          <div className="flex flex-col">
            {paymentsHistory?.map((e: any, i: any) => {
              return (
                <div
                  tabIndex={i}
                  className="flex-col gap-3 justify-center p-4  rounded-md text-sm font-medium transition-all disabled:pointer-events-none shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive border hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 px-4 py-2 has-[>svg]:px-3 mt-2 bg-gray-800/50 border-gray-700 text-white focus:border-[#00FF80] disabled:opacity-50 w-full"
                >
                  <p className="text-lg">
                    Đã thanh toán {e.amount} {e.currencyCode} vào ngày{" "}
                    {formatDate(e.createdAt)} bằng phương thức {e.method} cho
                    đơn hàng {e.transactionId}
                  </p>
                </div>
              );
            })}
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
