import { useFonts } from "expo-font";
import {
  Manrope_400Regular,
  Manrope_600SemiBold,
  Manrope_700Bold,
  Manrope_800ExtraBold,
} from "@expo-google-fonts/manrope";
import { Stack, useRouter, useSegments } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { getSession } from "../lib/session";
import { tokenService } from "../services/tokenService";

const PUBLIC_ROUTES = new Set(["index", "login", "cadastro"]);

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

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

  useEffect(() => {
    if (isAuthenticated === null) {
      return;
    }

    const isPublicRoute = PUBLIC_ROUTES.has(currentRoute);
    if (!isAuthenticated && !isPublicRoute) {
      router.replace("/login");
    }
  }, [currentRoute, isAuthenticated, router]);

  if (isAuthenticated === null) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const [fontsLoaded] = useFonts({
    Manrope_400Regular,
    Manrope_600SemiBold,
    Manrope_700Bold,
    Manrope_800ExtraBold,
  });

  if (!fontsLoaded) return null;

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
  );
}
