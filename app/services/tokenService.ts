import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";

let memoryAccessToken: string | null = null;
let memoryRefreshToken: string | null = null;

const canUseSecureStore =
  Platform.OS !== "web"
  && typeof SecureStore.getItemAsync === "function"
  && typeof SecureStore.setItemAsync === "function"
  && typeof SecureStore.deleteItemAsync === "function";

async function setItem(key: string, value: string) {
  if (canUseSecureStore) {
    await SecureStore.setItemAsync(key, value);
  }
}

async function getItem(key: string) {
  if (canUseSecureStore) {
    return SecureStore.getItemAsync(key);
  }

  return null;
}

async function deleteItem(key: string) {
  if (canUseSecureStore) {
    await SecureStore.deleteItemAsync(key);
  }
}

export const tokenService = {
  async saveTokens(accessToken: string, refreshToken?: string | null) {
    memoryAccessToken = accessToken;
    memoryRefreshToken = refreshToken ?? null;

    await setItem(ACCESS_TOKEN_KEY, accessToken);

    if (refreshToken) {
      await setItem(REFRESH_TOKEN_KEY, refreshToken);
      return;
    }

    await deleteItem(REFRESH_TOKEN_KEY);
  },

  async getAccessToken() {
    if (memoryAccessToken) {
      return memoryAccessToken;
    }

    const token = await getItem(ACCESS_TOKEN_KEY);
    memoryAccessToken = token;
    return token;
  },

  async getRefreshToken() {
    if (memoryRefreshToken) {
      return memoryRefreshToken;
    }

    const token = await getItem(REFRESH_TOKEN_KEY);
    memoryRefreshToken = token;
    return token;
  },

  async clearTokens() {
    memoryAccessToken = null;
    memoryRefreshToken = null;

    await deleteItem(ACCESS_TOKEN_KEY);
    await deleteItem(REFRESH_TOKEN_KEY);
  },
};
