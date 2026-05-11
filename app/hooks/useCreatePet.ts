import { useCallback, useState } from "react";
import { getSession } from "../lib/session";
import { petService } from "../services/petService";
import { PetDTO } from "../types/pet";

export type CreatePetInput = {
  nome: string;
  dt_nasc: string;
  especie: "gato" | "cachorro";
  porte: "pequeno" | "medio" | "grande";
  raca: string;
  descricao: string;
  link_foto?: string;
};

type CreatePetPayload = {
  nome: string;
  status: "PENDENTE";
  descricao: string;
  dt_nasc: string;
  porte: "pequeno" | "medio" | "grande";
  raca: string;
  especie: "gato" | "cachorro";
  link_foto?: string;
};

function normalizeBirthDateToApi(value: string): string {
  const datePrefix = value.match(/^\d{4}-\d{2}-\d{2}/)?.[0];

  if (datePrefix) {
    return `${datePrefix}T00:00:00.000Z`;
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  const y = parsed.getUTCFullYear();
  const m = String(parsed.getUTCMonth() + 1).padStart(2, "0");
  const d = String(parsed.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}T00:00:00.000Z`;
}

function toPayload(input: CreatePetInput): CreatePetPayload {
  return {
    nome: input.nome,
    status: "PENDENTE",
    descricao: input.descricao,
    dt_nasc: normalizeBirthDateToApi(input.dt_nasc),
    porte: input.porte,
    raca: input.raca,
    especie: input.especie,
    link_foto: input.link_foto,
  };
}

export function useCreatePet() {
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createPet = useCallback(async (input: CreatePetInput): Promise<PetDTO> => {
    setIsCreating(true);
    setError(null);

    try {
      const session = getSession();

      if (!session?.token) {
        throw new Error("Usuario nao autenticado. Faca login novamente.");
      }

      const payload = toPayload(input);
      return await petService.create(payload);
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
