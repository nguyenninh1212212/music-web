import React from "react";
import { Check } from "lucide-react";
import { Button } from "../components/ui/button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import subscriptionApi from "@/api/subscriptionApi";
import { formatDate } from "@/util/help";
import { toast } from "sonner";

export const Subscription: React.FC = () => {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["subscriptionPlans"],
    queryFn: async () => await subscriptionApi.getUserSubscriptions(),
  });

  // SỬA LỖI 1: Di chuyển useMutation lên trên cùng (Rules of Hooks)
  // Hook phải được gọi trước bất kỳ câu lệnh return có điều kiện nào.
  const subscribeMutation = useMutation({
    mutationFn: async ({ planId, type }: { planId: string; type: string }) =>
      await subscriptionApi.subscribeToPlan(planId, type),
    onSuccess: (data) => {
      if (typeof data === "string" && data.startsWith("http")) {
        window.location.href = data;
      } else {
        toast.success("Plan activated successfully!");
        queryClient.invalidateQueries({ queryKey: ["subscriptionPlans"] });
      }
    },
    onError: (error) => {
      console.error(error);
      toast.error("Subscription failed!");
    },
  });

  // Các câu lệnh return có điều kiện phải nằm SAU KHI TẤT CẢ hook đã được gọi
  if (isLoading || !data) return <div>Loading...</div>;
  if (error) return <div>Error loading subscription plans</div>;

  const subscriptionPlans = data?.items || [];

  const handleSubscribe = (planId: string, type: string) => {
    const plan = subscriptionPlans.find((p) => p.id === planId);

    if (plan?.subscription) {
      toast.info("You already subscribed to this plan.");
      return;
    }

    subscribeMutation.mutate({ planId, type });
  };

  return (
    <div className="p-8 pb-32">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-white mb-4">Choose Your Plan</h1>
          <p className="text-gray-400">
            Unlock premium features and enjoy unlimited music
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {subscriptionPlans.map((plan) => {
            const isSubscribed = !!plan.subscription;
            const isFree = plan.price === 0;

            // SỬA LỖI 2: Sửa lại logic gán biến
            // Thêm "&&" để kết hợp cả hai điều kiện
            const isProcessing =
              subscribeMutation.isPending &&
              subscribeMutation.variables?.planId === plan.id &&
              subscribeMutation.variables?.type === plan.type;

            return (
              <div
                key={plan.id}
                className={`relative bg-gray-900/30 rounded-2xl p-8 border transition-all duration-300 ${
                  isSubscribed
                    ? "border-[#00FF80] shadow-[0_0_30px_rgba(0,255,128,0.3)] scale-105"
                    : "border-gray-800 hover:border-gray-700"
                }`}
              >
                {isSubscribed && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#00FF80] text-black px-4 py-1 rounded-full text-sm shadow-[0_0_20px_rgba(0,255,128,0.5)]">
                    Active
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-white mb-4">{plan.name}</h3>
                  <div className="mb-2">
                    <span className="text-4xl text-white font-bold">
                      ${plan.price}
                    </span>
                    {plan.price > 0 && (
                      <span className="text-gray-400">/month</span>
                    )}
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 mt-0.5 flex-shrink-0 text-[#00FF80]" />
                    <span className="text-gray-300">
                      Duration: {plan.duration} days
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 mt-0.5 flex-shrink-0 text-[#00FF80]" />
                    <span className="text-gray-300">Type: {plan.type}</span>
                  </li>
                  {plan.subscription && (
                    <>
                      <li className="flex items-start gap-3">
                        <Check className="w-5 h-5 mt-0.5 flex-shrink-0 text-[#00FF80]" />
                        <span className="text-gray-300">
                          Started at: {formatDate(plan.subscription?.createdAt)}
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <Check className="w-5 h-5 mt-0.5 flex-shrink-0 text-[#00FF80]" />
                        <span className="text-gray-300">
                          Expires at: {formatDate(plan.subscription?.expiresAt)}
                        </span>
                      </li>
                    </>
                  )}
                </ul>

                <Button
                  onClick={() => handleSubscribe(plan.id, plan.type)}
                  className={`w-full ${
                    isSubscribed
                      ? "bg-[#00FF80] text-black hover:bg-[#00FF80]/80 shadow-[0_0_20px_rgba(0,255,128,0.5)]"
                      : "bg-gray-800 hover:bg-gray-700 text-white"
                  }`}
                  disabled={isSubscribed || subscribeMutation.isPending}
                >
                  {isProcessing
                    ? "Processing..."
                    : isSubscribed
                    ? "Current Plan"
                    : isFree
                    ? "Activate Free Plan"
                    : "Subscribe with PayPal"}
                </Button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
