import { getSession } from "@/lib/session";
import {
  FormularioDetalhadoDTO,
  RespostaDTO,
  SolicitacaoCreateDTO,
  SolicitacaoResponseDTO,
} from "@/types/solicitacao";
import apiService from "./apiService";

export const solicitacaoService = {
  async criar(formularioId: string) {
    const userId = getSession()?.userId;
    if (!userId) {
      throw new Error("Usuário não autenticado.");
    }

    const payload: SolicitacaoCreateDTO = {
      adotanteId: userId,
      formularioId,
    };

    const response = await apiService.post<SolicitacaoResponseDTO>("/solicitacoes", payload);
    return response.data;
  },

  async detalhar(solicitacaoId: string) {
    const response = await apiService.get<FormularioDetalhadoDTO>(`/solicitacoes/${solicitacaoId}`);
    return response.data;
  },

  async responder(payload: RespostaDTO) {
    await apiService.post("/solicitacoes/respostas", payload);
  },

  async aprovar(solicitacaoId: string) {
    const response = await apiService.put<SolicitacaoResponseDTO>(`/solicitacoes/${solicitacaoId}/aprovar`);
    return response.data;
  },

  async recusar(solicitacaoId: string) {
    const response = await apiService.put<SolicitacaoResponseDTO>(`/solicitacoes/${solicitacaoId}/recusar`);
    return response.data;
  },
};
