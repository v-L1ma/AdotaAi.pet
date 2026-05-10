import apiService from "./apiService";
import { showSuccessToast } from "./toastService";

export type EventoDTO = {
    id?: string;
    nome: string;
    endereco?: string;
    bairro?: string;
    cidade?: string;
    cep?: string;
    hrinicio?: string;
    hrfim?: string;
    descricao?: string;
    data?: string;
  status?: string;
  nmorganizador?: string;
  contagemPresencas?: number;
  isInscrito?: boolean;
  mensagemReprovado?: string | null;
};

export async function getEventos(): Promise<EventoDTO[]> {
  const response = await apiService.get<EventoDTO[]>("/eventos");
  return response.data;
}

export async function getEventoById(id: string): Promise<EventoDTO> {
  const response = await apiService.get<EventoDTO>(`/eventos/${id}`);
  return response.data;
}

export async function createEvento(evento: Omit<EventoDTO, "id">): Promise<EventoDTO> {
  const response = await apiService.post<EventoDTO>("/eventos", evento);
  showSuccessToast("Evento criado com sucesso!");
  return response.data;
}

export async function updateEvento(id: string, evento: Omit<EventoDTO, "id">): Promise<EventoDTO> {
  const response = await apiService.put<EventoDTO>(`/eventos/${id}`, evento);
  showSuccessToast("Evento atualizado com sucesso!");
  return response.data;
}

export async function deleteEvento(id: string): Promise<void> {
  await apiService.delete(`/eventos/${id}`);
  showSuccessToast("Evento removido com sucesso!");
}

export async function getEventosUsuario(): Promise<EventoDTO[]> {
  const response = await apiService.get<EventoDTO[]>("/usuario/eventos");
  return response.data;
}

export async function getEventosInscritos(): Promise<EventoDTO[]> {
  const response = await apiService.get<EventoDTO[]>("/usuario/eventos-inscritos");
  return response.data;
}

export async function registrarPresenca(id: string): Promise<void> {
  await apiService.post(`/eventos/${id}/presenca`);
  showSuccessToast("Presença confirmada!");
}

export async function removerPresenca(id: string): Promise<void> {
  await apiService.delete(`/eventos/${id}/presenca`);
  showSuccessToast("Presença removida!");
}

export const eventoService = {
  getEventos,
  getEventoById,
  createEvento,
  updateEvento,
  deleteEvento,
  getEventosUsuario,
  getEventosInscritos,
  registrarPresenca,
  removerPresenca,
};

export default eventoService;