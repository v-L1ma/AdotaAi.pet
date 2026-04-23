export type AuthSession = {
  token: string;
  tokenType: string;
  userId: string;
  email: string;
  nome: string;
  cargo: string;
};

let currentSession: AuthSession | null = null;

export function setSession(session: AuthSession) {
  currentSession = session;
}

export function getSession() {
  return currentSession;
}

export function clearSession() {
  currentSession = null;
}

export function updateSessionToken(token: string) {
  if (!currentSession) {
    return;
  }

  currentSession = {
    ...currentSession,
    token,
  };
}
