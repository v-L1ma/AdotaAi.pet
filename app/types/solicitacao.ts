export type SolicitacaoCreateDTO = {
  adotanteId: string;
  formularioId: string;
};

export type SolicitacaoResponseDTO = {
  id: string;
  adotanteId: string;
  anuncianteId: string;
  status: "PENDENTE" | "APROVADO" | "RECUSADO";
  dataSolicitacao: string;
};

export type PerguntaRespostaDTO = {
  perguntaId: string;
  perguntaTexto: string;
  respostaTexto?: string | null;
};

export type FormularioDetalhadoDTO = {
  formularioId: string;
  usuarioCriadorId: string;
  usuarioCriadorNome: string;
  usuarioRespondenteId: string;
  usuarioRespondenteNome: string;
  perguntasRespostas: PerguntaRespostaDTO[];
};

export type RespostaDTO = {
  solicitacaoId: string;
  perguntaId: string;
  resposta: string;
};
