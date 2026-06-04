import apiService from "./apiService";

export type PetAdminDTO = {
  id: string;
  nome: string;
  especie: string;
  raca: string;
  porte: string;
  status: string;
  link_foto: string;
  descricao: string;
  dt_nasc: string;
  user_id: string;
};

export type EventoAdminDTO = {
  id: string;
  nome: string;
  descricao: string;
  data: string;
  hrInicio: string;
  hrFim: string;
  endereco: string;
  bairro: string;
  cidade: string;
  cep: string;
  status: string;
  nmorganizador: string;
  link_foto?: string;
  user_id: string;
  contagemPresencas: number;
};

export type UsuarioAdminDTO = {
  id: string;
  nome: string;
  email: string;
  cpfcnpj: string;
  telefone: string | null;
  link_foto: string | null;
  cargo: string;
  fl_ativo: boolean;
};

export type EspecieAdminDTO = {
  id: string;
  nome: string;
};

export type RacaAdminDTO = {
  id: string;
  nome: string;
  especieId: string;
};

export type AprovarReprovarRequest = {
  motivo?: string;
};

type BaseResponse<T> = {
  message: string;
  data: T[];
  errors?: string[];
};

export const adminService = {
  async listarPetsPendentes(): Promise<PetAdminDTO[]> {
    const response = await apiService.get<BaseResponse<PetAdminDTO>>("/pets/pendentes");
    return response.data.data;
  },

  async aprovarPet(id: string): Promise<void> {
    await apiService.post(`/pets/${id}/aprovar`);
  },

  async reprovarPet(id: string, motivo: string): Promise<void> {
    await apiService.post(`/pets/${id}/reprovar`, { motivo });
  },

  async listarEventosPendentes(): Promise<EventoAdminDTO[]> {
    const response = await apiService.get<BaseResponse<EventoAdminDTO>>("/eventos/pendentes");
    return response.data.data;
  },

  async aprovarEvento(id: string): Promise<void> {
    await apiService.post(`/eventos/${id}/aprovar`);
  },

  async reprovarEvento(id: string, motivo: string): Promise<void> {
    await apiService.post(`/eventos/${id}/reprovar`, { motivo });
  },

  async listarUsuarios(): Promise<UsuarioAdminDTO[]> {
    const response = await apiService.get<BaseResponse<UsuarioAdminDTO>>("/usuario/admin/usuarios");
    return response.data.data;
  },

  async ativarUsuario(id: string): Promise<void> {
    await apiService.put(`/usuario/admin/${id}/ativar`);
  },

  async desativarUsuario(id: string): Promise<void> {
    await apiService.put(`/usuario/admin/${id}/desativar`);
  },

  // Espécies
  async listarEspecies(): Promise<EspecieAdminDTO[]> {
    const response = await apiService.get<BaseResponse<EspecieAdminDTO>>("/especies");
    return response.data.data;
  },

  async criarEspecie(dto: { nome: string }): Promise<void> {
    await apiService.post("/especies", dto);
  },

  async atualizarEspecie(id: string, dto: { nome: string }): Promise<void> {
    await apiService.put(`/especies/${id}`, dto);
  },

  async excluirEspecie(id: string): Promise<void> {
    await apiService.delete(`/especies/${id}`);
  },

  // Raças
  async listarRacas(especieId?: string): Promise<RacaAdminDTO[]> {
    const params = especieId ? { especieId } : undefined;
    const response = await apiService.get<BaseResponse<RacaAdminDTO>>("/racas", { params });
    return response.data.data;
  },

  async criarRaca(dto: { nome: string; especieId: string }): Promise<void> {
    await apiService.post("/racas", dto);
  },

  async atualizarRaca(id: string, dto: { nome: string; especieId?: string }): Promise<void> {
    await apiService.put(`/racas/${id}`, dto);
  },

  async excluirRaca(id: string): Promise<void> {
    await apiService.delete(`/racas/${id}`);
  },
};

export default adminService;
