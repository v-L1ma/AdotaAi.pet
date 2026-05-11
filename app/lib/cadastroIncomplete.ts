type CadastroIncompletoListener = () => void;

const listeners = new Set<CadastroIncompletoListener>();

export function onCadastroIncompleto(listener: CadastroIncompletoListener) {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}

export function notifyCadastroIncompleto() {
  listeners.forEach((listener) => listener());
}

export function isCadastroIncompletoPayload(payload: unknown) {
  if (!payload || typeof payload !== "object") {
    return false;
  }

  const message = (payload as { message?: unknown }).message;
  const errors = (payload as { errors?: unknown }).errors;

  const hasMessage = typeof message === "string" && message.toLowerCase().includes("cadastro incompleto");

  const hasError =
    Array.isArray(errors)
    && errors.some((item) => typeof item === "string" && item.toLowerCase().includes("finalize seu cadastro"));

  return hasMessage || hasError;
}
