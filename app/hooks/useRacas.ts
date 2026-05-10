import { useState, useEffect, useCallback } from "react";
import lookupService from "@/services/lookupService";
import { raca } from "@/types/TRaca";

export function useRacas(especieId?: string) {
  const [racas, setRacas] = useState<raca[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRacas = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await lookupService.getRacas(especieId);
      setRacas(response);
    } catch (err) {
      setError("Falha ao carregar raças");
    } finally {
      setIsLoading(false);
    }
  }, [especieId]);

  useEffect(() => {
    fetchRacas();
  }, [fetchRacas]);

  return { racas, isLoading, error, refetch: fetchRacas };
}