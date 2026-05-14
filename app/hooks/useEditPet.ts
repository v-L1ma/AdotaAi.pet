import { useCallback, useState } from "react";
import { Platform } from "react-native";
import { getSession } from "../lib/session";
import { getApiErrorMessages } from "../services/apiErrorService";
import { updatePet, updatePetFromFormData } from "../services/petService";
import { porte } from "@/types/TPorte";
import type { genero } from "@/types/TGenero";

export type EditPetInput = {
  petId: string;
  nome: string;
  dt_nasc: string;
  especieId: string;
  porte: porte;
  genero: genero;
  racaId: string;
  descricao: string;
  formularioId?: string | null;
  imagem?: {
    uri: string;
    fileName?: string | null;
    mimeType?: string | null;
  } | null;
};

type EditPetPayload = {
  nome: string;
  descricao: string;
  dtNasc: string;
  porte: porte;
  genero: genero;
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
  if (!/^\d{4}-\d{2}-\d{2}$/.test(sliced)) {
    throw new Error("Formato de data inválido. Esperado: yyyy-MM-dd");
  }
  return sliced;
}

function toPayload(input: EditPetInput): EditPetPayload {
  return {
    nome: input.nome,
    descricao: input.descricao,
    dtNasc: normalizeDate(input.dt_nasc),
    porte: input.porte,
    genero: input.genero,
    racaId: input.racaId,
    especieId: input.especieId,
    formularioId: input.formularioId ?? null,
  };
}

async function buildFormData(
  payload: EditPetPayload,
  imagem?: EditPetInput["imagem"]
): Promise<FormData> {
  const formData = new FormData();

  const payloadJson = JSON.stringify(payload);

  if (Platform.OS === "web") {
    formData.append("dados", new Blob([payloadJson], { type: "application/json" }));
  } else {
    formData.append("dados", payloadJson);
  }

  if (imagem?.uri) {
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
  }

  return formData;
}

export function useEditPet() {
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorMessages, setErrorMessages] = useState<string[]>([]);

  const editPet = useCallback(async (input: EditPetInput): Promise<HookResult<unknown>> => {
    setIsEditing(true);
    setError(null);
    setErrorMessages([]);

    try {
      const session = getSession();
      if (!session?.token) {
        throw new Error("Usuario nao autenticado. Faca login novamente.");
      }

      const payload = toPayload(input);
      
      if (input.imagem?.uri) {
        const formData = await buildFormData(payload, input.imagem);
        const pet = await updatePetFromFormData(input.petId, formData);
        return {
          ok: true,
          data: pet,
        };
      }

      const pet = await updatePet(input.petId, payload);

      return {
        ok: true,
        data: pet,
      };
    } catch (err) {
      const messages = getApiErrorMessages(err, "Falha ao editar pet");
      const message = messages[0] || "Falha ao editar pet";
      setError(message);
      setErrorMessages(messages);
      return {
        ok: false,
        message,
        messages,
      };
    } finally {
      setIsEditing(false);
    }
  }, []);

  return {
    editPet,
    isEditing,
    error,
    errorMessages,
  };
}