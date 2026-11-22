import api from "./api";
import type { PriorityEnv } from "../types/PriorityType";

export const PriorityCRUD = {
  list: (envId: number) =>
    api.get<PriorityEnv[]>(`/environments/${envId}/priority`).then((r) => r.data),

  take: (id: number) =>
    api.get<PriorityEnv>(`/columns/${id}`).then((r) => r.data),

  create: (envId: number, data: Partial<PriorityEnv>) =>
    api.post<PriorityEnv>(`/environments/${envId}/priority`, { data }).then((r) => r.data),

  edit: (id: number, data: Partial<PriorityEnv>) =>
    api.put<PriorityEnv>(`/priority/${id}`, data).then((r) => r.data),

  delete: (id: number) => api.delete(`/priority/${id}`),
};