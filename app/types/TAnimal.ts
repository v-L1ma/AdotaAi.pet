import { especie } from "./TEspecie";
import { porte } from "./TPorte";

export type animal = {
    id: string;
    status:string;
    descricao:string;
    dt_nasc:string;
    nome: string;
    especie: especie;
    porte: porte;
    raca:string;
    link_foto: string;
    user_id:string;
    // genero: string;
}