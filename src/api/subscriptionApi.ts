import { PaginatedData, SubscriptionPlan } from "@/lib/types";
import api from "./axios";

const subscriptionApi = {
  getUserSubscriptions: async (): Promise<PaginatedData<SubscriptionPlan>> =>
    (await api.get("/subscriptions")).data,

  renewSubscription: async (subscriptionId: string) =>
    (await api.post(`/subscriptions/renew/${subscriptionId}`)).data,

  subscribeToPlan: async (planId: string, type: string) => {
    return (
      await api.post(
        `/subscriptions/subscribe/${planId}`,
        {},
        {
          params: { type },
        }
      )
    ).data;
  },
};

export default subscriptionApi;
