import { useState, useEffect, useCallback } from "react";
import { getEventos, EventoDTO } from "@/services/eventoService";

export function useEvento() {
  const [eventos, setEventos] = useState<EventoDTO[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEventos = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getEventos();
      setEventos(response ?? []);
    } catch {
      setError("Nao foi possivel carregar os eventos.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEventos();
  }, [fetchEventos]);

  return { eventos, isLoading, error, refetch: fetchEventos };
}
