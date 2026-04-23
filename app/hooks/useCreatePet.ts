import { useCallback, useState } from "react";
import { getSession } from "../lib/session";
import apiService from "../services/apiService";

export type CreatePetInput = {
  nome: string;
  dt_nasc: string;
  especie: "gato" | "cachorro";
  porte: "pequeno" | "medio" | "grande";
  raca: string;
  descricao: string;
};

type CreatePetPayload = {
  nome: string;
  status: "PENDENTE";
  descricao: string;
  dt_nasc: string;
  porte: "pequeno" | "medio" | "grande";
  raca: string;
  especie: "gato" | "cachorro";
};

function toPayload(input: CreatePetInput): CreatePetPayload {
  return {
    nome: input.nome,
    status: "PENDENTE",
    descricao: input.descricao,
    dt_nasc: input.dt_nasc,
    porte: input.porte,
    raca: input.raca,
    especie: input.especie,
  };
}

export function useCreatePet() {
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createPet = useCallback(async (input: CreatePetInput) => {
    setIsCreating(true);
    setError(null);

    try {
      const session = getSession();

      if (!session?.token) {
        throw new Error("Usuario nao autenticado. Faca login novamente.");
      }

      const payload = toPayload(input);

      await apiService.post("/pets", payload);
    } catch (err) {
      // const message = isApiServiceError(err)
      //   ? (err.response?.data?.errors?.[0]
      //     || err.response?.data!.message
      //     || err.message
      //     || "Falha ao criar anuncio")
      //   : err instanceof Error
      //     ? err.message
      //     : "Falha ao criar anuncio";
      // setError(message);
      throw err;
    } finally {
      setIsCreating(false);
    }
  }, []);

  return {
    createPet,
    isCreating,
    error,
  };
}
