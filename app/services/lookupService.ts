import apiService from "./apiService";
import type { raca } from "../types/TRaca";

export type EspecieEntity = {
  id: string;
  nome: string;
};

export async function getEspecies(): Promise<EspecieEntity[]> {
  const response = await apiService.get<EspecieEntity[]>("/lookups/especies");
  return response.data;
}

export async function getRacas(especieId?: string): Promise<raca[]> {
  const response = await apiService.get<raca[]>("/lookups/racas", {
    params: especieId ? { especie_id: especieId } : undefined,
  });
  return response.data;
}

export const lookupService = {
  getEspecies,
  getRacas,
};

export default lookupService;
