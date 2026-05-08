import { useCallback, useState } from "react";
import { AuthSession, clearSession, setSession } from "../lib/session";
import { getApiErrorMessages } from "../services/apiErrorService";
import authService, { type LoginInput, type LoginResponse, type RegisterInput } from "../services/authService";
import { tokenService } from "../services/tokenService";

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
      const loginResponse = await authService.login(input);
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
      const parsedBody = await authService.register(input);

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
