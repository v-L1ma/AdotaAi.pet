import { useCallback, useState } from "react";
import { getSession } from "../lib/session";
import apiService from "../services/apiService";
import { especie } from "@/types/TEspecie";
import { porte } from "@/types/TPorte";

export type CreatePetInput = {
  nome: string;
  dt_nasc: string; // formato esperado: "2026-04-04"
  especie: especie; // enum uppercase para bater com o backend
  porte: porte; // enum uppercase
  raca: string;
  descricao: string;
  imagem: {
    uri: string;
    fileName?: string | null;
    mimeType?: string | null;
  };
};

type CreatePetPayload = {
  nome: string;
  descricao: string;
  dt_nasc: string;
  porte: porte ;
  raca: string;
  especie: especie;
};

function toPayload(input: CreatePetInput): CreatePetPayload {
  return {
    nome: input.nome,
    descricao: input.descricao,
    dt_nasc: input.dt_nasc,
    porte: input.porte,
    raca: input.raca,
    especie: input.especie,
  };
}

function buildFormData(payload: CreatePetPayload, imagem: CreatePetInput["imagem"]): FormData {
  const formData = new FormData();

  formData.append("dados", JSON.stringify(payload));

  const uri = imagem.uri;
  const filename = imagem.fileName || uri.split("/").pop() || `pet-${Date.now()}.jpg`;
  const extension = filename.split(".").pop()?.toLowerCase();
  const mimeType = imagem.mimeType || (extension === "png" ? "image/png" : "image/jpeg");

  formData.append("imagem", {
    uri,
    name: filename,
    type: mimeType,
  } as any);

  return formData;
}

function parseError(err: unknown): string {
  if (err instanceof Error) return err.message;
  return "Falha ao criar anuncio";
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
      const formData = buildFormData(payload, input.imagem);

      await apiService.post("/pets", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    } catch (err) {
      const message = parseError(err);
      setError(message);
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