import { useCallback, useState } from "react";
import { AuthSession, clearSessionPersistent, saveSession } from "../lib/session";
import apiService from "../services/apiService";
import { tokenService } from "../services/tokenService";

type LoginInput = {
  email: string;
  senha: string;
};

type LoginResponse = {
  token: string;
  refreshToken?: string;
  tipo: string;
  id: string;
  email: string;
  nome: string;
  cargo: string;
};

type RegisterInput = {
  nome: string;
  email: string;
  senha: string;
  confirmarSenha: string;
  cpfcnpj: string;
};

type ApiBaseResponse<T> = {
  message?: string;
  data?: T[];
  errors?: string[];
};

export function useAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(async (input: LoginInput) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiService.post<LoginResponse>("/auth/login", input);
      const parsedBody = response.data;

      const loginResponse = parsedBody as LoginResponse;
      const session: AuthSession = {
        token: loginResponse.token,
        tokenType: loginResponse.tipo || "Bearer",
        userId: loginResponse.id,
        email: loginResponse.email,
        nome: loginResponse.nome,
        cargo: loginResponse.cargo,
      };

      await tokenService.saveTokens(loginResponse.token, loginResponse.refreshToken ?? null);
      await saveSession(session);
      return session;
    } catch (err) {
      // const message = isApiServiceError(err)
      //   ? getApiErrorMessage(err.response?.data, "Falha ao realizar login")
      //   : err instanceof Error
      //     ? err.message
      //     : "Falha ao realizar login";
      // setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    await tokenService.clearTokens();
    await clearSessionPersistent();
  }, []);

  const register = useCallback(async (input: RegisterInput) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiService.post("/usuario", {
        nome: input.nome,
        email: input.email,
        senha: input.senha,
        confirmarSenha: input.confirmarSenha,
        cpfcnpj: input.cpfcnpj,
      });

      const parsedBody = response.data;

      return parsedBody;
    } catch (err) {
      // const message = isApiServiceError(err)
      //   ? getApiErrorMessage(err.response?.data, "Falha ao realizar cadastro")
      //   : err instanceof Error
      //     ? err.message
      //     : "Falha ao realizar cadastro";
      // setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    login,
    register,
    logout,
    isLoading,
    error,
  };
}
