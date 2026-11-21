import api from "./api";
import type { CardEnv } from "../types/CardsType";

export const ColumnService = {
  list: (envId: number) =>
    api.get<CardEnv[]>(`/environments/${envId}/cards`).then((r) => r.data),

  take: (id: number) =>
    api.get<CardEnv>(`/cards/${id}`).then((r) => r.data),

  create: (envId: number, data: Partial<CardEnv>) =>
    api.post<CardEnv>(`/environments/${envId}/cards`, { data }).then((r) => r.data),

  edit: (id: number, data: Partial<CardEnv>) =>
    api.put<CardEnv>(`/cards/${id}`, data).then((r) => r.data),

  delete: (id: number) => api.delete(`/cardss/${id}`),
};