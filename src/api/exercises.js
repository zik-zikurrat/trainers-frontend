import { api, toList } from "./client";

export const exercisesApi = {
  list: async () => toList(await api.get("/exercise")),
  create: (data) => api.post("/exercise", data),
  update: (id, data) => api.patch(`/exercise/${id}`, data),
  remove: (id) => api.delete(`/exercise/${id}`),
};
