import { useCallback, useState } from "react";
import { Platform } from "react-native";
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
  dtNasc: string;
  porte: porte ;
  raca: string;
  especie: especie;
};

function normalizeDate(value: string): string {
  if (!value) return value;
  const sliced = value.slice(0, 10);
  // Garante que é yyyy-MM-dd antes de enviar
  if (!/^\d{4}-\d{2}-\d{2}$/.test(sliced)) {
    throw new Error("Formato de data inválido. Esperado: yyyy-MM-dd");
  }
  return sliced;
}

function toPayload(input: CreatePetInput): CreatePetPayload {
  return {
    nome: input.nome,
    descricao: input.descricao,
    dtNasc: normalizeDate(input.dt_nasc),
    porte: input.porte,
    raca: input.raca,
    especie: input.especie,
  };
}

async function buildFormData(payload: CreatePetPayload, imagem: CreatePetInput["imagem"]): Promise<FormData> {
  const formData = new FormData();

  const payloadJson = JSON.stringify(payload);

  try {
    formData.append("dados", new Blob([payloadJson], { type: "application/json" }));
  } catch {
    // Fallback para runtimes que nao suportam Blob no FormData.
    formData.append("dados", payloadJson);
  }

  const uri = imagem.uri;
  const filename = imagem.fileName || uri.split("/").pop() || `pet-${Date.now()}.jpg`;
  const extension = filename.split(".").pop()?.toLowerCase();
  const mimeType = imagem.mimeType || (extension === "png" ? "image/png" : "image/jpeg");

  if (Platform.OS === "web") {
    const imageResponse = await fetch(uri);
    const imageBlob = await imageResponse.blob();
    formData.append("imagem", imageBlob, filename);
  } else {
    formData.append("imagem", {
      uri,
      name: filename,
      type: mimeType,
    } as any);
  }

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
      const formData = await buildFormData(payload, input.imagem);

      await apiService.post("/pets", formData);
      console.log("Form data enviada:", formData);
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