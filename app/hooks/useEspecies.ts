import { useState, useEffect, useCallback } from "react";
import apiService from "@/services/apiService";
import { especie as especieType } from "@/types/TEspecie";

type especieEntity = {
  id: string;
  nome: string;
};

export function useEspecies() {
  const [especies, setEspecies] = useState<especieEntity[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEspecies = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiService.get<especieEntity[]>("/lookups/especies");
      setEspecies(response.data);
    } catch (err) {
      setError("Falha ao carregar espécies");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEspecies();
  }, [fetchEspecies]);

  return { especies, isLoading, error, refetch: fetchEspecies };
}