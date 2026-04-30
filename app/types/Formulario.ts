export type Formulario = {
  id: string;
  titulo: string;
  perguntas: number;
  status: "Publicado" | "Rascunho";
  atualizadoEm: string;
};