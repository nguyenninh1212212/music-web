import api from "./axios";

const paymentApi = {
  getPaymentHistory: async () => (await api.get("/payments")).data,

  createPaypalOrder: async (planId: string) =>
    (await api.post("/payments/paypal/create-order", { planId })).data,

  getOrderDetails: async (orderId: string) =>
    (await api.get(`/payments/order/${orderId}`)).data,
};

export default paymentApi;
