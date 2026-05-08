export type PerguntaDTO = {
  id: string;
  texto: string;
};

export type FormularioTemplateDTO = {
  id: string;
  usuarioCriadorId: string;
  perguntas: PerguntaDTO[];
  titulo?: string;
  status?: "Publicado" | "Rascunho";
  atualizadoEm?: string;
};

export type Formulario = {
  id: string;
  titulo: string;
  perguntas: number;
  status: "Publicado" | "Rascunho";
  atualizadoEm: string;
};