import api from "./axios";

const planApi = {
  getPlans: async () => (await api.get("/plans")).data,

  createPlan: async (planData) => (await api.post("/plans", planData)).data,

  updatePlan: async (type, planData) =>
    (await api.patch(`/plans?type=${type}`, planData)).data,
};

export default planApi;
