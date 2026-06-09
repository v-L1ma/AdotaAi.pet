import apiService from "./apiService";
import { showSuccessToast } from "./toastService";
import type { ApiBaseResponse } from "../types/ApiResponse";
import type { animal } from "../types/TAnimal";
import type { especie } from "../types/TEspecie";
import type { porte } from "../types/TPorte";
import type { genero } from "../types/TGenero";

export interface PetFilters {
  especie?: especie;
  porte?: porte;
  genero?: genero;
}

export type PetOwner = {
  id: string;
  nome: string;
  linkFotoPerfil?: string;
};

export type PetDetail = animal & {
  formularioId?: string | null;
  racaId?: string;
  especieId?: string;
  isFavoritado?: boolean;
  isFavorito?: boolean;
  solicitacaoEnviada?: boolean;
  dono?: PetOwner;
};

export interface PetUpsertData {
  nome: string;
  descricao: string;
  dtNasc: string;
  porte: porte;
  genero?: genero;
  racaId?: string;
  especieId?: string;
  formularioId?: string | null;
}

export async function getPets(filters?: PetFilters): Promise<animal[]> {
  const response = await apiService.get<animal[]>("/pets", { params: filters });
  return response.data;
}

export async function getPetById(id: string): Promise<PetDetail> {
  const response = await apiService.get<PetDetail>(`/pets/${id}`);
  return response.data;
}

export async function createPet(data: PetUpsertData): Promise<animal> {
  const response = await apiService.post<animal>("/pets", data);
  showSuccessToast("Pet cadastrado com sucesso!");
  return response.data;
}

export async function updatePet(id: string, data: Partial<PetUpsertData>, successMessage = "Pet atualizado com sucesso!"): Promise<animal> {
  const response = await apiService.put<animal>(`/pets/${id}`, data);
  showSuccessToast(successMessage);
  return response.data;
}

export async function createPetFromFormData(formData: FormData): Promise<animal> {
  const response = await apiService.post<animal>("/pets", formData);
  showSuccessToast("Pet cadastrado com sucesso!");
  return response.data;
}

export async function updatePetFromFormData(id: string, formData: FormData): Promise<animal> {
  const response = await apiService.put<animal>(`/pets/${id}`, formData);
  showSuccessToast("Pet atualizado com sucesso!");
  return response.data;
}

export async function deletePet(id: string): Promise<void> {
  await apiService.delete(`/pets/${id}`);
  showSuccessToast("Pet deletado com sucesso!");
}

export async function favoritePet(id: string): Promise<void> {
  await apiService.post(`/pets/${id}/favoritar`);
  showSuccessToast("Pet adicionado aos favoritos!");
}

export async function unfavoritePet(id: string): Promise<void> {
  await apiService.delete(`/pets/${id}/favoritar`);
  showSuccessToast("Pet removido dos favoritos!");
}

export async function getUserFavorites(): Promise<animal[]> {
  const response = await apiService.get<ApiBaseResponse<animal>>("/pets/favoritos");
  return response.data?.data ?? [];
}

export async function getUserPets(): Promise<animal[]> {
  const response = await apiService.get<animal[]>("/usuario/pets");
  return response.data;
}

export async function getRecentApprovedPets(limit = 5): Promise<animal[]> {
  const response = await apiService.get<animal[]>("/pets/destaques", {
    params: { limit },
  });
  return response.data;
}

export async function linkFormToPet(petId: string, data: PetUpsertData): Promise<animal> {
  const successMessage = data.formularioId
    ? "Formulário vinculado ao pet!"
    : "Formulário removido do pet!";
  return updatePet(petId, data, successMessage);
}

export const petService = {
  getPets,
  getPetById,
  createPet,
  updatePet,
  createPetFromFormData,
  updatePetFromFormData,
  deletePet,
  favoritePet,
  unfavoritePet,
  getUserFavorites,
  getUserPets,
  linkFormToPet,
};

export default petService;