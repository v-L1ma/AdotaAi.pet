import { useFonts } from "expo-font";
import {
  Manrope_400Regular,
  Manrope_600SemiBold,
  Manrope_700Bold,
  Manrope_800ExtraBold,
} from "@expo-google-fonts/manrope";
import { Stack, useRouter, useSegments } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import CadastroIncompletoModal from "@/components/CadastroIncompletoModal";
import { getSession } from "../lib/session";
import { registerCadastroIncompletoHandler } from "../services/apiService";
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
      const session = getSession();
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

  const openCadastroIncompletoModal = useCallback(() => {
    setShowCadastroIncompletoModal(true);
  }, []);

  useEffect(() => {
    registerCadastroIncompletoHandler(openCadastroIncompletoModal);

    return () => {
      registerCadastroIncompletoHandler(null);
    };
  }, [openCadastroIncompletoModal]);

  useEffect(() => {
    if (isAuthenticated === null) {
      return;
    }

    const isPublicRoute = PUBLIC_ROUTES.has(currentRoute);
    if (!isAuthenticated && !isPublicRoute) {
      router.replace("/login");
    }
  }, [currentRoute, isAuthenticated, router]);

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

      <CadastroIncompletoModal
        visible={showCadastroIncompletoModal}
        onClose={() => setShowCadastroIncompletoModal(false)}
        onConcluirCadastro={() => {
          setShowCadastroIncompletoModal(false);
          router.push("/perfil-user");
        }}
      />
    </>
  );
}
