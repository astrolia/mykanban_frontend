import api from "./api";
import type { ColumnEnv } from "../types/ColumnsType";

export const ColumnService = {
  list: (envId: number) =>
    api.get<ColumnEnv[]>(`/environments/${envId}/columns`).then((r) => r.data),

  take: (id: number) =>
    api.get<ColumnEnv>(`/columns/${id}`).then((r) => r.data),

  create: (envId: number, label: string) =>
    api.post<ColumnEnv>(`/environments/${envId}/columns`, { label }).then((r) => r.data),

  edit: (id: number, data: Partial<ColumnEnv>) =>
    api.put<ColumnEnv>(`/columns/${id}`, data).then((r) => r.data),

  delete: (id: number) => api.delete(`/columns/${id}`),
};