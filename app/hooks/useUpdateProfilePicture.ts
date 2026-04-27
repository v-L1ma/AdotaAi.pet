import { useCallback, useState } from "react";
import { Platform } from "react-native";
import { getApiErrorMessages } from "../services/apiErrorService";
import apiService from "../services/apiService";
import type { ApiBaseResponse } from "@/types/ApiResponse";

export const MAX_PROFILE_PICTURE_SIZE_BYTES = 50 * 1024 * 1024;

type UpdateProfilePictureResponse = {
  link_foto?: string;
};

export type UpdateProfilePictureInput = {
  uri: string;
  fileName?: string | null;
  mimeType?: string | null;
  fileSize?: number | null;
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

function validateFileSize(fileSize?: number | null) {
  if (fileSize != null && fileSize > MAX_PROFILE_PICTURE_SIZE_BYTES) {
    throw new Error("A imagem deve ter no maximo 50 MB.");
  }
}

async function buildFormData(input: UpdateProfilePictureInput): Promise<FormData> {
  validateFileSize(input.fileSize);

  const formData = new FormData();
  const filename = input.fileName || input.uri.split("/").pop() || `perfil-${Date.now()}.jpg`;
  const extension = filename.split(".").pop()?.toLowerCase();
  const mimeType = input.mimeType || (extension === "png" ? "image/png" : "image/jpeg");

  if (Platform.OS === "web") {
    const imageResponse = await fetch(input.uri);
    const imageBlob = await imageResponse.blob();
    validateFileSize(imageBlob.size);
    formData.append("imagem", imageBlob, filename);
  } else {
    formData.append("imagem", {
      uri: input.uri,
      name: filename,
      type: mimeType,
    } as any);
  }

  return formData;
}

export function useUpdateProfilePicture() {
  const [isUpdatingProfilePicture, setIsUpdatingProfilePicture] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorMessages, setErrorMessages] = useState<string[]>([]);

  const updateProfilePicture = useCallback(
    async (input: UpdateProfilePictureInput): Promise<HookResult<UpdateProfilePictureResponse>> => {
      setIsUpdatingProfilePicture(true);
      setError(null);
      setErrorMessages([]);

      try {
        const formData = await buildFormData(input);
        const response = await apiService.put<ApiBaseResponse<UpdateProfilePictureResponse>>(
          "/usuario/foto-perfil",
          formData
        );

        return {
          ok: true,
          data: response.data?.data?.[0] ?? {},
        };
      } catch (err) {
        const messages = getApiErrorMessages(err, "Falha ao atualizar foto de perfil");
        const message = messages[0] || "Falha ao atualizar foto de perfil";
        setError(message);
        setErrorMessages(messages);
        return {
          ok: false,
          message,
          messages,
        };
      } finally {
        setIsUpdatingProfilePicture(false);
      }
    },
    []
  );

  return {
    updateProfilePicture,
    isUpdatingProfilePicture,
    error,
    errorMessages,
  };
}
