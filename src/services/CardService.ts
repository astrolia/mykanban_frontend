import api from "./api";
import type { CardEnv, CardMoveType } from "../types/CardsType";

export const CardCRUD = {
  list: (envId: number) =>
    api.get<CardEnv[]>(`/environments/${envId}/cards`).then((r) => r.data),

  take: (id: number) =>
    api.get<CardEnv>(`/cards/${id}`).then((r) => r.data),

  create: (envId: number, data: Partial<CardEnv>) =>
    api.post<CardEnv>(`/environments/${envId}/cards`, { data }).then((r) => r.data),

  edit: (id: number, data: Partial<CardEnv>) =>
    api.put<CardEnv>(`/cards/${id}`, data).then((r) => r.data),

  archive: (id: number, data: Partial<CardEnv>) =>
    api.put<CardEnv[]>(`/cards/${id}`, data).then((r) => r.data),

  move: (id: number, data: CardMoveType) =>
    api.put<CardEnv[]>(`/cards/move/${id}`, data).then((r) => r.data),

  delete: (id: number) => api.delete(`/cards/${id}`).then((r) => r.data),
};