import { useCallback, useState } from "react";
import { Platform } from "react-native";
import { getApiErrorMessages } from "../services/apiErrorService";
import { updateProfilePicture as updateProfilePictureService } from "../services/userService";
import { compressAvatarImage, validateCompressedSize, getCompressionStats } from "../services/imageCompressionService";

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
  
  // Use the provided URI and fileName (which should be from compression result)
  const filename = input.fileName || input.uri.split("/").pop() || `perfil-${Date.now()}.jpg`;
  const extension = filename.split(".").pop()?.toLowerCase();
  const mimeType = input.mimeType || (extension === "png" ? "image/png" : extension === "webp" ? "image/webp" : "image/jpeg");

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
        // Step 1: Compress the avatar image
        const compressionResult = await compressAvatarImage(input.uri, input.fileSize ?? undefined);
        
        // Step 2: Validate compressed size is within acceptable range (50 KB target)
        const isValidSize = validateCompressedSize(compressionResult.compressedSize, 50);
        if (!isValidSize) {
          console.warn(
            `Imagem comprimida excede o alvo de 50 KB: ${(compressionResult.compressedSize / 1024).toFixed(2)} KB. Prosseguindo com upload.`
          );
        }
        
        // Log compression stats for debugging
        console.log(`[Image Compression] ${getCompressionStats(compressionResult)}`);

        // Step 3: Build form data with compressed image
        const compressedInput: UpdateProfilePictureInput = {
          uri: compressionResult.uri,
          fileName: compressionResult.fileName,
          mimeType: compressionResult.mimeType,
          fileSize: compressionResult.compressedSize,
        };
        
        const formData = await buildFormData(compressedInput);
        
        // Step 4: Upload the compressed image
        const response = await updateProfilePictureService(formData);

        return {
          ok: true,
          data: response.data?.[0] ?? {},
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
