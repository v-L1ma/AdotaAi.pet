import axios from "axios";
import type { AxiosError, InternalAxiosRequestConfig } from "axios";
import { API_BASE_URL } from "../lib/api";
import { clearSession, getSession, updateSessionToken } from "../lib/session";
import { tokenService } from "./tokenService";

type RetryableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

const apiService = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
});

let refreshInFlight: Promise<string | null> | null = null;

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

    if (!originalRequest || error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
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
      return Promise.reject(error);
    }

    if (originalRequest.headers && typeof (originalRequest.headers as any).set === "function") {
      (originalRequest.headers as any).set("Authorization", `Bearer ${newAccessToken}`);
    }

    return apiService(originalRequest);
  }
);

export default apiService;
