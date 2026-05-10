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

export type AprovarReprovarRequest = {
  motivo?: string;
};

export const adminService = {
  async listarPetsPendentes(): Promise<PetAdminDTO[]> {
    const response = await apiService.get<{ data: PetAdminDTO[] }>("/pets/pendentes");
    return response.data.data;
  },

  async aprovarPet(id: string): Promise<void> {
    await apiService.post(`/pets/${id}/aprovar`);
  },

  async reprovarPet(id: string, motivo: string): Promise<void> {
    await apiService.post(`/pets/${id}/reprovar`, { motivo });
  },

  async listarEventosPendentes(): Promise<EventoAdminDTO[]> {
    const response = await apiService.get<{ data: EventoAdminDTO[] }>("/eventos/pendentes");
    return response.data.data;
  },

  async aprovarEvento(id: string): Promise<void> {
    await apiService.post(`/eventos/${id}/aprovar`);
  },

  async reprovarEvento(id: string, motivo: string): Promise<void> {
    await apiService.post(`/eventos/${id}/reprovar`, { motivo });
  },

  async listarUsuarios(): Promise<UsuarioAdminDTO[]> {
    const response = await apiService.get<{ data: UsuarioAdminDTO[] }>("/usuario/admin/usuarios");
    return response.data.data;
  },

  async ativarUsuario(id: string): Promise<void> {
    await apiService.put(`/usuario/admin/${id}/ativar`);
  },

  async desativarUsuario(id: string): Promise<void> {
    await apiService.put(`/usuario/admin/${id}/desativar`);
  },
};

export default adminService;