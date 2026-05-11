import { useFonts } from "expo-font";
import {
  Manrope_400Regular,
  Manrope_600SemiBold,
  Manrope_700Bold,
  Manrope_800ExtraBold,
} from "@expo-google-fonts/manrope";
import { Stack, useRouter, useSegments } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { onCadastroIncompleto } from "../lib/cadastroIncomplete";
import { getSession, loadSession } from "../lib/session";
import { tokenService } from "../services/tokenService";

const PUBLIC_ROUTES = new Set(["index", "login", "cadastro"]);

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [showCadastroIncompletoModal, setShowCadastroIncompletoModal] = useState(false);

  const currentRoute = useMemo(() => {
    return segments[segments.length - 1];
  }, [segments]);

  useEffect(() => {
    let isMounted = true;

    const hydrateAuthState = async () => {
      const session = getSession() || await loadSession();
      if (session?.token) {
        if (isMounted) {
          setIsAuthenticated(true);
        }
        return;
      }

      const storedAccessToken = await tokenService.getAccessToken();
      if (isMounted) {
        setIsAuthenticated(Boolean(storedAccessToken));
      }
    };

    hydrateAuthState();

    return () => {
      isMounted = false;
    };
  }, [currentRoute]);

  useEffect(() => {
    if (isAuthenticated === null) {
      return;
    }

    const isPublicRoute = PUBLIC_ROUTES.has(currentRoute);
    if (!isAuthenticated && !isPublicRoute) {
      router.replace("/login");
    }
  }, [currentRoute, isAuthenticated, router]);

  useEffect(() => {
    const unsubscribe = onCadastroIncompleto(() => {
      if (currentRoute === "perfil-user") {
        return;
      }

      setShowCadastroIncompletoModal(true);
    });

    return unsubscribe;
  }, [currentRoute]);

  const [fontsLoaded] = useFonts({
    Manrope_400Regular,
    Manrope_600SemiBold,
    Manrope_700Bold,
    Manrope_800ExtraBold,
  });

  if (isAuthenticated === null) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!fontsLoaded) return null;

  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />

      <Modal
        visible={showCadastroIncompletoModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowCadastroIncompletoModal(false)}
      >
        <Pressable style={styles.backdrop} onPress={() => setShowCadastroIncompletoModal(false)}>
          <Pressable style={styles.modalCard} onPress={(event) => event.stopPropagation()}>
            <Text style={styles.modalTitle}>Cadastro incompleto</Text>
            <Text style={styles.modalText}>Finalize seu perfil para continuar usando todas as funcionalidades.</Text>

            <View style={styles.actionsRow}>
              <TouchableOpacity style={styles.secondaryButton} onPress={() => setShowCadastroIncompletoModal(false)}>
                <Text style={styles.secondaryButtonText}>Agora não</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.primaryButton}
                onPress={() => {
                  setShowCadastroIncompletoModal(false);
                  router.push("/perfil-user");
                }}
              >
                <Text style={styles.primaryButtonText}>Finalizar cadastro</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.35)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  modalCard: {
    width: "100%",
    borderRadius: 16,
    backgroundColor: "#fff",
    padding: 16,
    gap: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#222",
  },
  modalText: {
    fontSize: 14,
    color: "#555",
    lineHeight: 20,
  },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
    marginTop: 4,
  },
  secondaryButton: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E6E6E6",
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  secondaryButtonText: {
    color: "#666",
    fontWeight: "700",
  },
  primaryButton: {
    borderRadius: 10,
    backgroundColor: "#E74C3C",
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  primaryButtonText: {
    color: "#fff",
    fontWeight: "700",
  },
});
