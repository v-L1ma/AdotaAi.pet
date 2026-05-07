import { useCallback, useState } from "react";
import { Platform } from "react-native";
import { getSession } from "../lib/session";
import { getApiErrorMessages } from "../services/apiErrorService";
import apiService from "../services/apiService";
import { porte } from "@/types/TPorte";

export type CreatePetInput = {
  nome: string;
  dt_nasc: string; // formato esperado: "2026-04-04"
  especieId: string;
  porte: porte; // enum uppercase
  racaId: string;
  descricao: string;
  formularioId?: string | null;
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
  porte: porte;
  racaId: string;
  especieId: string;
  formularioId: string | null;
};

type HookSuccessResult<T> = {
  ok: true;
  data: T;
};

type HookErrorResult = {
  ok: false;
  message: string;
  messages: string[];
};

type HookResult<T> = HookSuccessResult<T> | HookErrorResult;

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
    racaId: input.racaId,
    especieId: input.especieId,
    formularioId: input.formularioId ?? null,
  };
}

async function buildFormData(
  payload: CreatePetPayload,
  imagem: CreatePetInput["imagem"]
): Promise<FormData> {
  const formData = new FormData();

  const payloadJson = JSON.stringify(payload);

  // No native, enviar string evita incompatibilidades com Blob no FormData.
  if (Platform.OS === "web") {
    formData.append("dados", new Blob([payloadJson], { type: "application/json" }));
  } else {
    formData.append("dados", payloadJson);
  }

  // Processa a imagem
  const uri = imagem.uri;
  const filename = imagem.fileName || uri.split("/").pop() || `pet-${Date.now()}.jpg`;
  const extension = filename.split(".").pop()?.toLowerCase();
  const mimeType = imagem.mimeType || (extension === "png" ? "image/png" : "image/jpeg");

  if (Platform.OS === "web") {
    const imageResponse = await fetch(uri);
    const imageBlob = await imageResponse.blob();
    formData.append("imagem", imageBlob, filename);
  } else {
    // React Native RN Fetch Blob format
    formData.append("imagem", {
      uri,
      name: filename,
      type: mimeType,
    } as any);
  }

  return formData;
}

export function useCreatePet() {
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorMessages, setErrorMessages] = useState<string[]>([]);

  const createPet = useCallback(async (input: CreatePetInput): Promise<HookResult<unknown>> => {
    setIsCreating(true);
    setError(null);
    setErrorMessages([]);

    try {
      const session = getSession();
      if (!session?.token) {
        throw new Error("Usuario nao autenticado. Faca login novamente.");
      }

      const payload = toPayload(input);
      const formData = await buildFormData(payload, input.imagem);

      // Nao forcar Content-Type: o axios define boundary corretamente.
      const response = await apiService.post("/pets", formData);

      return {
        ok: true,
        data: response.data,
      };
    } catch (err) {
      const messages = getApiErrorMessages(err, "Falha ao criar pet");
      const message = messages[0] || "Falha ao criar pet";
      setError(message);
      setErrorMessages(messages);
      return {
        ok: false,
        message,
        messages,
      };
    } finally {
      setIsCreating(false);
    }
  }, []);

  return {
    createPet,
    isCreating,
    error,
    errorMessages,
  };
}