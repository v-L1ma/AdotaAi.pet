import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "@/styles/variables";
import AppHeader from "@/components/AppHeader";

type MenuItem = {
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  route: string;
  color: string;
};

export default function AdminMenuScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;

  const menuItems: MenuItem[] = [
    {
      title: "Gerenciar Animais",
      subtitle: "Aprovar ou reprovar animais",
      icon: "paw-outline",
      route: "/gerenciar-animais",
      color: colors.primary,
    },
    {
      title: "Gerenciar Eventos",
      subtitle: "Aprovar ou reprovar eventos",
      icon: "calendar-outline",
      route: "/gerenciar-eventos",
      color: "#4CAF50",
    },
    {
      title: "Gerenciar Usuários",
      subtitle: "Ativar ou desativar contas",
      icon: "people-outline",
      route: "/gerenciar-usuarios",
      color: "#FF9800",
    },
  ];

  return (
    <SafeAreaView style={styles.screen} edges={["top", "left", "right"]}>
      <AppHeader title="Painel Administrativo" onBackPress={() => router.back()} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, isTablet && styles.contentTablet]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.welcomeCard}>
          <View style={styles.welcomeIcon}>
            <Ionicons name="shield-checkmark" size={32} color={colors.primary} />
          </View>
          <View style={styles.welcomeText}>
            <Text style={styles.welcomeTitle}>Área Administrativa</Text>
            <Text style={styles.welcomeSubtitle}>
              Gerencie approveção de conteúdo e usuários
            </Text>
          </View>
        </View>

        <Text style={styles.sectionLabel}>Ações Administrativas</Text>

        <View style={[styles.menuGrid, isTablet && styles.menuGridTablet]}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.route}
              style={[styles.menuCard, isTablet && styles.menuCardTablet]}
              onPress={() => router.push(item.route as never)}
              activeOpacity={0.8}
            >
              <View style={[styles.menuIcon, { backgroundColor: item.color + "20" }]}>
                <Ionicons name={item.icon} size={28} color={item.color} />
              </View>
              <View style={styles.menuText}>
                <Text style={styles.menuTitle}>{item.title}</Text>
                <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.surface,
    paddingTop: 50,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
    gap: 20,
  },
  contentTablet: {
    alignSelf: "center",
    width: "100%",
    maxWidth: 980,
  },
  welcomeCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surfaceLowest,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: "#ECECEC",
  },
  welcomeIcon: {
    width: 60,
    height: 60,
    borderRadius: 16,
    backgroundColor: "#FFF2F0",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  welcomeText: {
    flex: 1,
  },
  welcomeTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: colors.text,
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: colors.textMuted,
    marginTop: 4,
  },
  sectionLabel: {
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: 1,
    color: "#8A8A8A",
    fontWeight: "800",
    paddingHorizontal: 4,
  },
  menuGrid: {
    flexDirection: "column",
    gap: 12,
  },
  menuGridTablet: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  menuCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surfaceLowest,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: "#ECECEC",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  menuCardTablet: {
    width: "100%",
  },
  menuIcon: {
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  menuText: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: colors.text,
  },
  menuSubtitle: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 2,
  },
});