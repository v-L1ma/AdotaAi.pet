import apiService from "./apiService";
import { showSuccessToast } from "./toastService";
import type { Formulario, FormularioTemplateDTO } from "../types/Formulario";

export interface CreateFormularioData {
  perguntas: string[];
}

function mapTemplateToCard(item: FormularioTemplateDTO): Formulario {
  return {
    id: String(item.id),
    titulo: item.titulo || `Formulario ${String(item.id).slice(0, 8)}`,
    perguntas: Array.isArray(item.perguntas) ? item.perguntas.length : 0,
    status: item.status || "Publicado",
    atualizadoEm: item.atualizadoEm || "-",
  };
}

export async function getFormularios(): Promise<Formulario[]> {
  const response = await apiService.get<FormularioTemplateDTO[]>("/formularios");
  const data = Array.isArray(response.data) ? response.data : [];
  return data.map(mapTemplateToCard);
}

export async function getFormularioTemplateById(id: string): Promise<FormularioTemplateDTO> {
  const response = await apiService.get<FormularioTemplateDTO>(`/formularios/${id}`);
  return response.data;
}

export async function createFormulario(data: CreateFormularioData): Promise<FormularioTemplateDTO> {
  const response = await apiService.post<FormularioTemplateDTO>("/formularios", data);
  showSuccessToast("Formulário criado com sucesso!");
  return response.data;
}

export async function updateFormulario(id: string, data: CreateFormularioData): Promise<FormularioTemplateDTO> {
  const response = await apiService.put<FormularioTemplateDTO>(`/formularios/${id}`, data);
  showSuccessToast("Formulário atualizado com sucesso!");
  return response.data;
}

export const formularioService = {
  getFormularios,
  getFormularioTemplateById,
  createFormulario,
  updateFormulario,
};

export default formularioService;