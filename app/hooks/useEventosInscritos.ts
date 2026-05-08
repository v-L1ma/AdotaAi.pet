import { useState, useEffect, useCallback } from "react";
import lookupService, { type EspecieEntity } from "@/services/lookupService";
import eventoService, { EventoDTO } from "@/services/eventoService";

export function useEventosInscritos() {
  const [eventos, setEventos] = useState<EventoDTO[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEventosInscritos = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await eventoService.getEventosInscritos();
      setEventos(response);
    } catch (err) {
      setError("Falha ao carregar eventos inscritos");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEventosInscritos();
  }, [fetchEventosInscritos]);

  return { eventos, isLoading, error, refetch: fetchEventosInscritos };
}