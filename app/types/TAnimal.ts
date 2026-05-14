import { especie } from "./TEspecie";
import { porte } from "./TPorte";
import { genero } from "./TGenero";

export type animal = {
    id: string;
    status:string;
    descricao:string;
    dt_nasc:string;
    nome: string;
    especie: especie;
    porte: porte;
    genero?: genero;
    raca:string;
    link_foto: string;
    user_id:string;
    bairro?: string;
    cidade?: string;
    uf?: string;
    racaId?: string;
    especieId?: string;
    formularioId?: string | null;
    mensagemReprovado?: string | null;
    isFavoritado?: boolean;
    isFavorito?: boolean;
    dono?: {
        id: string;
        nome: string;
        linkFotoPerfil?: string;
    };
    // genero: string;
}