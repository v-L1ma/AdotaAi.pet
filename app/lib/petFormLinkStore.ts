import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

type PetFormMap = Record<string, string>;

const PET_FORM_LINK_KEY = "petFormLinkMap";

const canUseSecureStore =
  Platform.OS !== "web"
  && typeof SecureStore.getItemAsync === "function"
  && typeof SecureStore.setItemAsync === "function"
  && typeof SecureStore.deleteItemAsync === "function";

async function readMap(): Promise<PetFormMap> {
  if (!canUseSecureStore) {
    return {};
  }

  const raw = await SecureStore.getItemAsync(PET_FORM_LINK_KEY);
  if (!raw) {
    return {};
  }

  try {
    return JSON.parse(raw) as PetFormMap;
  } catch {
    return {};
  }
}

async function writeMap(map: PetFormMap) {
  if (!canUseSecureStore) {
    return;
  }

  await SecureStore.setItemAsync(PET_FORM_LINK_KEY, JSON.stringify(map));
}

export const petFormLinkStore = {
  async getFormIdByPetId(petId: string) {
    const map = await readMap();
    return map[petId] ?? null;
  },

  async setLink(petId: string, formId: string) {
    const map = await readMap();
    map[petId] = formId;
    await writeMap(map);
  },

  async removeLink(petId: string) {
    const map = await readMap();
    if (!(petId in map)) {
      return;
    }

    delete map[petId];
    await writeMap(map);
  },
};
