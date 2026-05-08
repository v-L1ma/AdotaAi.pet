import { useState, useEffect, useCallback } from "react";
import lookupService, { type EspecieEntity } from "@/services/lookupService";

export function useEspecies() {
  const [especies, setEspecies] = useState<EspecieEntity[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEspecies = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await lookupService.getEspecies();
      setEspecies(response);
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