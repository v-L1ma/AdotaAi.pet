import Toast from "react-native-toast-message";
import type { NormalizedApiError } from "../types/ApiResponse";

export type ToastType = "success" | "error" | "info";

interface ToastProps {
  type: ToastType;
  text1: string;
  text2?: string;
  visibilityTime?: number;
}

export function showToast({ type, text1, text2, visibilityTime = 3000 }: ToastProps) {
  Toast.show({
    type,
    text1,
    text2,
    visibilityTime,
  });
}

export function showSuccessToast(message: string, description?: string) {
  showToast({ type: "success", text1: message, text2: description });
}

export function showErrorToast(message: string, description?: string) {
  showToast({ type: "error", text1: message, text2: description });
}

export function showInfoToast(message: string, description?: string) {
  showToast({ type: "info", text1: message, text2: description });
}

export function showApiError(error: unknown, defaultMessage = "Erro ao processar requisição") {
  let message = defaultMessage;
  let description: string | undefined;
  console.log("Teste",error)

  if (error && typeof error === "object") {
    const err = error as Record<string, unknown>;
    message = (err.message as string) || defaultMessage;
    const errors = err.errors as string[] | undefined;
    description = errors?.[0];
  } else if (error instanceof Error) {
    message = error.message || defaultMessage;
  }

  showErrorToast(message, description);
}

export const toastService = {
  showToast,
  showSuccessToast,
  showErrorToast,
  showInfoToast,
  showApiError,
};

export default toastService;