import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

const KEY = "sentSolicitacoesIds";

const canUseSecureStore =
  Platform.OS !== "web"
  && typeof SecureStore.getItemAsync === "function"
  && typeof SecureStore.setItemAsync === "function";

async function readIds() {
  if (!canUseSecureStore) {
    return [] as string[];
  }

  const raw = await SecureStore.getItemAsync(KEY);
  if (!raw) {
    return [] as string[];
  }

  try {
    const parsed = JSON.parse(raw) as string[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [] as string[];
  }
}

async function writeIds(ids: string[]) {
  if (!canUseSecureStore) {
    return;
  }

  await SecureStore.setItemAsync(KEY, JSON.stringify(ids));
}

export const sentSolicitacoesStore = {
  async list() {
    return readIds();
  },

  async add(id: string) {
    const current = await readIds();
    if (current.includes(id)) {
      return;
    }

    await writeIds([id, ...current]);
  },
};
