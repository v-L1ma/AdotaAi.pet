export type PetDTO = {
  id?: string;
  status?: string;
  descricao?: string;
  dt_nasc?: string;
  nome?: string;
  porte?: string;
  raca?: string;
  especie?: string;
  link_foto?: string;
  user_id?: string;
};

export type BuscarPetDTO = PetDTO & {
  isFavoritado?: boolean;
  dono?: {
    id: string;
    nome: string;
  };
};

export type BaseResponse<T> = {
  message?: string;
  data?: T[];
  errors?: string[];
};
