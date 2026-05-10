import apiService from "./apiService";

export type LoginInput = {
  email: string;
  senha: string;
};

export type LoginResponse = {
  token: string;
  refreshToken?: string;
  tipo: string;
  id: string;
  email: string;
  nome: string;
  cargo: string;
};

export type RegisterInput = {
  nome: string;
  email: string;
  senha: string;
  confirmarSenha: string;
  cpfcnpj: string;
};

export async function login(input: LoginInput): Promise<LoginResponse> {
  const response = await apiService.post<LoginResponse>("/auth/login", input);
  return response.data;
}

export async function register(input: RegisterInput): Promise<unknown> {
  const response = await apiService.post("/usuario", {
    nome: input.nome,
    email: input.email,
    senha: input.senha,
    confirmarSenha: input.confirmarSenha,
    cpfcnpj: input.cpfcnpj,
  });
  return response.data;
}

export const authService = {
  login,
  register,
};

export default authService;
