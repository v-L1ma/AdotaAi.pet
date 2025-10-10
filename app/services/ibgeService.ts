import axios from "axios";

export interface Estado {
    id:number,
    sigla:string,
    nome:string
}

export interface Cidade {
    id:number,
    nome:string
}

const API_URL = "https://servicodados.ibge.gov.br/api/v1/localidades"


export async function buscarEstados(): Promise<Estado[]> {
    try {
        const response = await axios.get<Estado[]>(`${API_URL}/estados?orderBy=nome`);
        return response.data;
    } catch (error) {
        console.log("Erro ao buscar estados", error);
        return [];
    }
}

export async function buscarCidadesPorEstado(siglaEstado:string): Promise<Cidade[]> {
    try {
        const response = await axios.get<Cidade[]>(`${API_URL}/estados/${siglaEstado}/municipios?orderBy=nome`);
        return response.data;
    } catch (error) {
        console.log("Erro ao buscar estados", error);
        return [];
    }
}