import apiService from "./apiService";
import { showSuccessToast } from "./toastService";
import type { ApiBaseResponse } from "../types/ApiResponse";

export interface UsuarioDTO {
  id?: string;
  nome: string;
  cpfcnpj: string;
  email: string;
  senha?: string;
  confirmarSenha?: string;
  telefone?: string;
  link_foto?: string;
  endereco?: string;
  cep?: string;
  bairro?: string;
  cidade?: string;
  sg_estado?: string;
  cargo?: string;
}

export interface ApiResponse<T> {
  data?: T[];
}

export interface UpdateProfilePictureResponse {
  link_foto?: string;
}

export async function getCurrentUser(): Promise<UsuarioDTO> {
  const response = await apiService.get<ApiResponse<UsuarioDTO>>("/usuario");
  const usuarios = response.data?.data ?? [];
  if (usuarios.length === 0) {
    throw new Error("Usuário não encontrado");
  }
  return usuarios[0];
}

export async function updateUser(data: Partial<UsuarioDTO>): Promise<UsuarioDTO> {
  const response = await apiService.put<UsuarioDTO>("/usuario", data);
  showSuccessToast("Perfil atualizado com sucesso!");
  return response.data;
}

export async function updateProfilePicture(formData: FormData): Promise<ApiBaseResponse<UpdateProfilePictureResponse>> {
  const response = await apiService.put<ApiBaseResponse<UpdateProfilePictureResponse>>(
    "/usuario/foto-perfil",
    formData
  );
  showSuccessToast("Foto de perfil atualizada com sucesso!");
  return response.data;
}

export const userService = {
  getCurrentUser,
  updateUser,
  updateProfilePicture,
};

export default userService;