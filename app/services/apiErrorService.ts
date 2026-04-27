import { AxiosError } from "axios";
import { ApiBaseResponse, NormalizedApiError } from "@/types/ApiResponse";

type UnknownRecord = Record<string, unknown>;

function isObject(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null;
}

function toStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => (typeof item === "string" ? item.trim() : ""))
    .filter((item) => item.length > 0);
}

function parseBaseResponsePayload(payload: unknown): ApiBaseResponse {
  if (!isObject(payload)) {
    return {};
  }

  const message = typeof payload.message === "string" ? payload.message : undefined;
  const errors = toStringArray(payload.errors);

  return {
    message,
    errors,
    data: Array.isArray(payload.data) ? payload.data : undefined,
  };
}

function buildNormalizedError(params: {
  message: string;
  status?: number;
  errors?: string[];
  endpoint?: string;
  method?: string;
  raw?: unknown;
}): NormalizedApiError {
  const error = new Error(params.message) as NormalizedApiError;

  error.name = "NormalizedApiError";
  error.status = params.status;
  error.errors = params.errors ?? [];
  error.endpoint = params.endpoint;
  error.method = params.method;
  error.raw = params.raw;
  error.isValidation = params.status === 400;
  error.isAuth = params.status === 401 || params.status === 403;

  return error;
}

export function isNormalizedApiError(error: unknown): error is NormalizedApiError {
  return isObject(error) && error.name === "NormalizedApiError";
}

export function normalizeApiError(
  error: unknown,
  fallbackMessage = "Falha ao processar requisicao"
): NormalizedApiError {
  if (isNormalizedApiError(error)) {
    return error;
  }

  if (error instanceof AxiosError) {
    const payload = parseBaseResponsePayload(error.response?.data);
    const status = error.response?.status;
    const userMessage = payload.errors?.[0] || payload.message || error.message || fallbackMessage;

    return buildNormalizedError({
      message: userMessage,
      status,
      errors: payload.errors,
      endpoint: error.config?.url,
      method: error.config?.method,
      raw: error.response?.data,
    });
  }

  if (error instanceof Error) {
    return buildNormalizedError({
      message: error.message || fallbackMessage,
      raw: error,
    });
  }

  return buildNormalizedError({
    message: fallbackMessage,
    raw: error,
  });
}

export function getApiErrorMessage(error: unknown, fallbackMessage: string): string {
  return normalizeApiError(error, fallbackMessage).message;
}

export function getApiErrorMessages(error: unknown, fallbackMessage: string): string[] {
  const normalized = normalizeApiError(error, fallbackMessage);

  return normalized.errors.length > 0 ? normalized.errors : [normalized.message];
}
