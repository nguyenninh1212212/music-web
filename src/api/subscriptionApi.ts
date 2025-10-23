import api from "./axios";

const subscriptionApi = {
  getUserSubscriptions: async () => (await api.get("/subscriptions")).data,

  subscribeToPlan: async (planId) =>
    (await api.post(`/subscriptions/subcribe/${planId}`)).data,

  renewSubscription: async (subscriptionId) =>
    (await api.post(`/subscriptions/renew/${subscriptionId}`)).data,
};

export default subscriptionApi;
