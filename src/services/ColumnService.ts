import api from "./api";
import type { ColumnEnv } from "../types/ColumnsType";
import type { ColumnCreateType } from "../types/REMOVERenvironment";

export const ColumnCRUD = {
  list: (envId: number) =>
    api.get<ColumnEnv[]>(`/environments/${envId}/columns`).then((r) => r.data),

  take: (id: number) =>
    api.get<ColumnEnv>(`/columns/${id}`).then((r) => r.data),

  create: (envId: number, column: ColumnCreateType) =>
    api.post<ColumnEnv>(`/environments/${envId}/columns`, { column }).then((r) => r.data),

  edit: (id: number, data: Partial<ColumnEnv>) =>
    api.put<ColumnEnv>(`/columns/${id}`, data).then((r) => r.data),

  delete: (id: number) => api.delete(`/columns/${id}`).then((r) => r.data),
};