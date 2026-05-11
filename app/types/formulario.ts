export type PerguntaTemplateDTO = {
  id: string;
  texto: string;
};

export type FormularioTemplateDTO = {
  id: string;
  usuarioCriadorId: string;
  perguntas: PerguntaTemplateDTO[];
};

export type FormularioCreateDTO = {
  usuarioCriadorId: string;
  usuarioRespondenteId: string;
  perguntas: string[];
};
