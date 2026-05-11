import { getSession } from "@/lib/session";
import { FormularioCreateDTO, FormularioTemplateDTO } from "@/types/formulario";
import apiService from "./apiService";

type FormularioCreateResponse = {
  id?: string;
};

function normalizeId(value?: string) {
  return value?.trim().toLowerCase();
}

export const formularioService = {
  async listAll() {
    const response = await apiService.get<FormularioTemplateDTO[]>("/formularios");
    return response.data;
  },

  async listMine() {
    const userId = normalizeId(getSession()?.userId);
    const all = await this.listAll();

    if (!userId) {
      return all;
    }

    return all.filter((item) => normalizeId(item.usuarioCriadorId) === userId);
  },

  async getById(id: string) {
    const response = await apiService.get<FormularioTemplateDTO>(`/formularios/${id}`);
    return response.data;
  },

  async create(payload: FormularioCreateDTO) {
    const response = await apiService.post<FormularioCreateResponse>("/formularios", payload);
    return response.data;
  },

  async remove(id: string) {
    await apiService.delete(`/formularios/${id}`);
  },

  buildCreatePayload(perguntas: string[]): FormularioCreateDTO {
    const userId = getSession()?.userId;

    if (!userId) {
      throw new Error("Usuário não autenticado.");
    }

    return {
      usuarioCriadorId: userId,
      usuarioRespondenteId: userId,
      perguntas,
    };
  },
};
