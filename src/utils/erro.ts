// src/utils/erro.ts
import axios from "axios";

export function msgErro(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const msgBackend = error.response?.data?.message;
    if (typeof msgBackend === "string" && msgBackend) return msgBackend;

    if (!error.response) return "Servidor indisponível. Verifique sua conexão.";

    switch (error.response.status) {
      case 400: return "Dados inválidos.";
      case 401: return "Sessão expirada. Faça login novamente.";
      case 403: return "Você não tem permissão para isso.";
      case 404: return "Recurso não encontrado.";
      case 409: return "Conflito: essa operação não pode ser feita agora.";
      case 500: return "Erro no servidor. Tente novamente mais tarde.";
      default:  return "Algo deu errado.";
    }
  }
  return "Erro inesperado.";
}