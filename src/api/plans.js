import { api, toList } from "./client";

export const plansApi = {
  list: async () => {
    const list = toList(await api.get("/plan"));
    return list.sort(
      (a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0)
    );
  },
  generate: (data) => api.post("/generate", data),
};
