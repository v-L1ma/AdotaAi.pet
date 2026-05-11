import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

export type AuthSession = {
  token: string;
  tokenType: string;
  userId: string;
  email: string;
  nome: string;
  cargo: string;
};

let currentSession: AuthSession | null = null;

const SESSION_KEY = "authSession";
const canUseSecureStore =
  Platform.OS !== "web"
  && typeof SecureStore.getItemAsync === "function"
  && typeof SecureStore.setItemAsync === "function"
  && typeof SecureStore.deleteItemAsync === "function";

async function persistSession(session: AuthSession | null) {
  if (!canUseSecureStore) {
    return;
  }

  if (!session) {
    await SecureStore.deleteItemAsync(SESSION_KEY);
    return;
  }

  await SecureStore.setItemAsync(SESSION_KEY, JSON.stringify(session));
}

export function setSession(session: AuthSession) {
  currentSession = session;
  void persistSession(session);
}

export async function saveSession(session: AuthSession) {
  currentSession = session;
  await persistSession(session);
}

export function getSession() {
  return currentSession;
}

export function clearSession() {
  currentSession = null;
  void persistSession(null);
}

export async function clearSessionPersistent() {
  currentSession = null;
  await persistSession(null);
}

export async function loadSession() {
  if (currentSession) {
    return currentSession;
  }

  if (!canUseSecureStore) {
    return null;
  }

  const raw = await SecureStore.getItemAsync(SESSION_KEY);
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as AuthSession;
    if (!parsed?.token) {
      return null;
    }

    currentSession = parsed;
    return parsed;
  } catch {
    return null;
  }
}

export function updateSessionToken(token: string) {
  if (!currentSession) {
    return;
  }

  currentSession = {
    ...currentSession,
    token,
  };

  void persistSession(currentSession);
}
