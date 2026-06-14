import { api, toList } from "./client";

export const structuresApi = {
  list: async () => toList(await api.get("/structure")),
  create: (data) => api.post("/structure", data),
  update: (id, data) => api.patch(`/structure/${id}`, data),
  remove: (id) => api.delete(`/structure/${id}`),
};
