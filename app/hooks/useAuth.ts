import { useCallback, useState } from "react";
import { AuthSession, clearSession, setSession } from "../lib/session";
import { getApiErrorMessages } from "../services/apiErrorService";
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

export function useAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorMessages, setErrorMessages] = useState<string[]>([]);

  const login = useCallback(async (input: LoginInput): Promise<HookResult<AuthSession>> => {
    setIsLoading(true);
    setError(null);
    setErrorMessages([]);

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
      setSession(session);
      return { ok: true, data: session };
    } catch (err) {
      const messages = getApiErrorMessages(err, "Falha ao realizar login");
      const message = messages[0] || "Falha ao realizar login";
      setError(message);
      setErrorMessages(messages);
      return {
        ok: false,
        message,
        messages,
      };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    await tokenService.clearTokens();
    clearSession();
  }, []);

  const register = useCallback(async (input: RegisterInput): Promise<HookResult<unknown>> => {
    setIsLoading(true);
    setError(null);
    setErrorMessages([]);

    try {
      const response = await apiService.post("/usuario", {
        nome: input.nome,
        email: input.email,
        senha: input.senha,
        confirmarSenha: input.confirmarSenha,
        cpfcnpj: input.cpfcnpj,
      });

      const parsedBody = response.data;

      return {
        ok: true,
        data: parsedBody,
      };
    } catch (err) {
      const messages = getApiErrorMessages(err, "Falha ao realizar cadastro");
      const message = messages[0] || "Falha ao realizar cadastro";
      setError(message);
      setErrorMessages(messages);
      return {
        ok: false,
        message,
        messages,
      };
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
    errorMessages,
  };
}
