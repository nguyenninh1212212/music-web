import api from "./axios";

const paymentApi = {
  getPaymentHistory: async () => (await api.get("/payments")).data,

  createPaypalOrder: async (planId) =>
    (await api.post("/payments/paypal/create-order", { planId })).data,
};

export default paymentApi;
