import { api, toList } from "./client";

export const groupsApi = {
  list: async () => toList(await api.get("/group")),
  create: (data) => api.post("/group", data),
  update: (id, data) => api.patch(`/group/${id}`, data),
  remove: (id) => api.delete(`/group/${id}`),
};
