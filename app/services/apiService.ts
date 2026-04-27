import axios from "axios";
import type { AxiosError, InternalAxiosRequestConfig } from "axios";
import { API_BASE_URL } from "../lib/api";
import { clearSession, getSession, updateSessionToken } from "../lib/session";
import { normalizeApiError } from "./apiErrorService";
import { tokenService } from "./tokenService";

type CadastroIncompletoHandler = () => void;

type RetryableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

const apiService = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
});

let refreshInFlight: Promise<string | null> | null = null;
let cadastroIncompletoHandler: CadastroIncompletoHandler | null = null;

export function registerCadastroIncompletoHandler(handler: CadastroIncompletoHandler | null) {
  cadastroIncompletoHandler = handler;
}

function isCadastroIncompletoError(error: AxiosError) {
  if (error.response?.status !== 403) {
    return false;
  }

  const data = error.response.data as
    | { message?: string; errors?: string[] }
    | undefined;

  if (!data) {
    return false;
  }

  const message = data.message?.toLowerCase() ?? "";
  const errors = (data.errors ?? []).map((item) => item.toLowerCase());

  return message.includes("cadastro incompleto")
    || errors.some((item) => item.includes("finalize seu cadastro"));
}

async function refreshAccessToken() {
  const refreshToken = await tokenService.getRefreshToken();
  if (!refreshToken) {
    return null;
  }

  try {
    const response = await axios.post(`${API_BASE_URL}/auth/refresh`, { refreshToken });
    const newAccessToken = response?.data?.token as string | undefined;
    const newRefreshToken = (response?.data?.refreshToken as string | undefined) ?? refreshToken;

    if (!newAccessToken) {
      return null;
    }

    await tokenService.saveTokens(newAccessToken, newRefreshToken);
    updateSessionToken(newAccessToken);
    return newAccessToken;
  } catch {
    return null;
  }
}

apiService.interceptors.request.use(async (config) => {
  const session = getSession();
  const storedAccessToken = await tokenService.getAccessToken();
  const token = session?.token || storedAccessToken;
  const tokenType = session?.tokenType || "Bearer";

  if (token) {
    const authorization = `${tokenType} ${token}`;

    if (config.headers && typeof (config.headers as any).set === "function") {
      (config.headers as any).set("Authorization", authorization);
    }
  }

  return config;
});

apiService.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryableRequestConfig | undefined;

    if (isCadastroIncompletoError(error)) {
      cadastroIncompletoHandler?.();
      return Promise.reject(
        normalizeApiError(error, "Finalize seu cadastro para acessar este recurso")
      );
    }

    console.log("Erro na resposta da API:", {
      url: originalRequest?.url,
      method: originalRequest?.method,
      status: error.response?.status,
      data: error.response?.data,
    });

    if (!originalRequest || error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(normalizeApiError(error));
    }

    originalRequest._retry = true;

    if (!refreshInFlight) {
      refreshInFlight = refreshAccessToken().finally(() => {
        refreshInFlight = null;
      });
    }

    const newAccessToken = await refreshInFlight;
    if (!newAccessToken) {
      await tokenService.clearTokens();
      clearSession();
      return Promise.reject(normalizeApiError(error, "Sessao expirada. Faca login novamente"));
    }

    if (originalRequest.headers && typeof (originalRequest.headers as any).set === "function") {
      (originalRequest.headers as any).set("Authorization", `Bearer ${newAccessToken}`);
    }

    return apiService(originalRequest);
  }
);

export default apiService;
