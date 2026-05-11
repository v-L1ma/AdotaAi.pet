import { animal } from "@/types/TAnimal";
import { BaseResponse, BuscarPetDTO, PetDTO } from "@/types/pet";
import apiService from "./apiService";

const PET_IMAGE_PLACEHOLDER =
  "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800";

function normalizeEspecie(especie?: string): "cachorro" | "gato" | null {
  const value = especie?.toLowerCase();
  if (value === "cachorro" || value === "gato") {
    return value;
  }

  return null;
}

function normalizePorte(porte?: string): "pequeno" | "medio" | "grande" | null {
  const value = porte?.toLowerCase();
  if (value === "pequeno" || value === "medio" || value === "grande") {
    return value;
  }

  return null;
}

export function getPetImageUrl(linkFoto?: string) {
  const value = linkFoto?.trim();
  return value && value.length > 0 ? value : PET_IMAGE_PLACEHOLDER;
}

export function mapPetToAnimalCard(pet: PetDTO): animal {
  return {
    id: pet.id,
    nome: pet.nome || "Pet sem nome",
    imagem: getPetImageUrl(pet.link_foto),
    genero: null,
    porte: normalizePorte(pet.porte),
    especie: normalizeEspecie(pet.especie),
  };
}

export const petService = {
  async listAll() {
    const response = await apiService.get<PetDTO[]>("/pets");
    return response.data;
  },

  async create(payload: PetDTO) {
    const response = await apiService.post<PetDTO>("/pets", payload);
    return response.data;
  },

  async getById(id: string) {
    const response = await apiService.get<BuscarPetDTO>(`/pets/${id}`);
    return response.data;
  },

  async update(id: string, payload: PetDTO) {
    const response = await apiService.put<PetDTO>(`/pets/${id}`, payload);
    return response.data;
  },

  async remove(id: string) {
    await apiService.delete(`/pets/${id}`);
  },

  async favorite(id: string) {
    const response = await apiService.post<BaseResponse<string>>(`/pets/${id}/favoritar`);
    return response.data;
  },

  async unfavorite(id: string) {
    const response = await apiService.delete<BaseResponse<string>>(`/pets/${id}/favoritar`);
    return response.data;
  },

  async listFavorites() {
    const response = await apiService.get<BaseResponse<PetDTO>>("/pets/favoritos");
    return response.data.data ?? [];
  },
};
