import apiService from "./apiService";
import { showSuccessToast } from "./toastService";

export interface SolicitacaoDTO {
  id: string;
  status: string;
  dataSolicitacao?: string;
  petId?: string;
  petNome?: string;
  petFoto?: string;
  adotanteNome?: string;
  adotanteEmail?: string;
  adotanteTelefone?: string;
  anuncianteNome?: string;
  influencianteEmail?: string;
  influencianteTelefone?: string;
}

export interface PerguntaRespostaDTO {
  perguntaId: string;
  perguntaTexto: string;
  respostaTexto?: string | null;
}

export interface FormularioDetalhadoDTO {
  formularioId: string;
  usuarioCriadorId: string;
  usuarioCriadorNome: string;
  usuarioRespondenteId: string;
  usuarioRespondenteNome: string;
  perguntasRespostas: PerguntaRespostaDTO[];
}

export interface CreateSolicitacaoDirectData {
  petId: string;
  mensagem?: string;
}

export interface CreateSolicitacaoWithFormData {
  petId: string;
  formularioId: string;
}

export interface RespostaInputDTO {
  solicitacaoId: string;
  perguntaId: string;
  resposta: string;
}

export interface RespostaSolicitacaoDTO {
  perguntaId: string;
  perguntaTexto: string;
  respostaTexto: string;
}

export interface CreateSolicitacaoWithRespostasData {
  petId: string;
  respostas: RespostaSolicitacaoDTO[];
}

export async function getSolicitacoesRecebidas(): Promise<SolicitacaoDTO[]> {
  const response = await apiService.get<SolicitacaoDTO[]>("/solicitacoes/recebidas");
  return response.data;
}

export async function getSolicitacoesEnviadas(): Promise<SolicitacaoDTO[]> {
  const response = await apiService.get<SolicitacaoDTO[]>("/solicitacoes/enviadas");
  return response.data;
}

export async function getSolicitacaoById(id: string): Promise<SolicitacaoDTO> {
  const response = await apiService.get<SolicitacaoDTO>(`/solicitacoes/${id}`);
  return response.data;
}

export async function createSolicitacaoDirect(data: CreateSolicitacaoDirectData): Promise<SolicitacaoDTO> {
  const response = await apiService.post<SolicitacaoDTO>("/solicitacoes", data);
  showSuccessToast("Solicitação enviada com sucesso!");
  return response.data;
}

export async function createSolicitacaoWithForm(data: CreateSolicitacaoWithFormData): Promise<SolicitacaoDTO> {
  const response = await apiService.post<SolicitacaoDTO>("/solicitacoes", data);
  showSuccessToast("Solicitação enviada com sucesso!");
  return response.data;
}

export async function submitFormRespostas(respostas: Record<string, string>): Promise<void> {
  await apiService.post("/solicitacoes/respostas", respostas);
  showSuccessToast("Respostas enviadas com sucesso!");
}

export async function submitSolicitacaoResposta(data: RespostaInputDTO): Promise<void> {
  await apiService.post("/solicitacoes/respostas", data);
}

export async function submitSolicitacaoRespostas(respostas: RespostaInputDTO[]): Promise<void> {
  await Promise.all(respostas.map((item) => apiService.post("/solicitacoes/respostas", item)));
  showSuccessToast("Respostas enviadas com sucesso!");
}

export async function createSolicitacaoComRespostas(data: CreateSolicitacaoWithRespostasData): Promise<SolicitacaoDTO> {
  const response = await apiService.post<SolicitacaoDTO>("/solicitacoes", data);
  showSuccessToast("Solicitação enviada com sucesso!");
  return response.data;
}

export async function getDetalhesSolicitacao(id: string): Promise<FormularioDetalhadoDTO> {
  const response = await apiService.get<FormularioDetalhadoDTO>(`/solicitacoes/${id}`);
  return response.data;
}

export const solicitacaoService = {
  getSolicitacoesRecebidas,
  getSolicitacoesEnviadas,
  getSolicitacaoById,
  createSolicitacaoDirect,
  createSolicitacaoWithForm,
  submitFormRespostas,
  submitSolicitacaoResposta,
  submitSolicitacaoRespostas,
  createSolicitacaoComRespostas,
  getDetalhesSolicitacao,
};

export default solicitacaoService;