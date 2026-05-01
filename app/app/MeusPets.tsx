import { Entypo, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Alert, Image, Modal, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import colors from "../styles/colors";
import { useTabNavigation } from "@/hooks/useTabNavigation";
import apiService from "@/services/apiService";
import { animal } from "@/types/TAnimal";

export default function MeusPets() {
  const router = useRouter();
  const { navigateToTab } = useTabNavigation();
  const { width } = useWindowDimensions();
  const isSmall = width < 360;
  const isTablet = width >= 768;

  const metrics = useMemo(() => {
    const horizontalPadding = isTablet ? 24 : 16;
    const maxContentWidth = isTablet ? 760 : width - horizontalPadding * 2;
    const cardWidth = Math.min(maxContentWidth, width - horizontalPadding * 2);

    return {
      horizontalPadding,
      cardWidth,
      imageSize: isSmall ? 62 : 72,
      titleSize: isSmall ? 17 : 19,
      subtitleSize: isSmall ? 13 : 14,
      speciesSize: isSmall ? 10 : 11,
      iconSize: isSmall ? 18 : 20,
      actionSize: isSmall ? 34 : 38,
    };
  }, [isSmall, isTablet, width]);

  const [pets, setPets] = useState<animal[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [popoverPetId, setPopoverPetId] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadPets() {
      setIsLoading(true);
      setLoadError(null);

      try {
        const response = await apiService.get<animal[]>("/usuario/pets");
        if (isMounted) {
          setPets(response.data ?? []);
        }
      } catch {
        if (isMounted) {
          setLoadError("Nao foi possivel carregar seus pets.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadPets();

    return () => {
      isMounted = false;
    };
  }, []);

  const formatarIdade = (dtNasc?: string) => {
    if (!dtNasc) {
      return "Idade nao informada";
    }

    const date = new Date(dtNasc);
    if (Number.isNaN(date.getTime())) {
      return "Idade nao informada";
    }

    const diffMs = Date.now() - date.getTime();
    const diffYears = Math.floor(diffMs / (1000 * 60 * 60 * 24 * 365.25));
    if (diffYears > 0) {
      return `${diffYears} ano${diffYears > 1 ? "s" : ""}`;
    }

    const diffMonths = Math.max(1, Math.floor(diffMs / (1000 * 60 * 60 * 24 * 30.5)));
    return `${diffMonths} mes${diffMonths > 1 ? "es" : ""}`;
  };

  const handleDelete = (id: string) => {
    Alert.alert(
      "Excluir anuncio",
      "Deseja realmente apagar este anuncio de animal?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              await apiService.delete(`/pets/${id}`);
              setPets((current) => current.filter((pet) => pet.id !== id));
            } catch {
              Alert.alert("Erro", "Nao foi possivel excluir este pet.");
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.screen} edges={["top", "left", "right", "bottom"]}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
            <Ionicons name="arrow-back" size={28} color={colors.primary} />
        </TouchableOpacity>
        <View style={styles.headerTitleWrap}>
          <Text style={styles.headerTitle}>Meus Pets</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingHorizontal: metrics.horizontalPadding },
          isTablet && styles.contentTablet,
        ]}
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity
          onPress={() => navigateToTab("/criar-anuncio")}
          style={[styles.addButton, { width: metrics.cardWidth }]}
        >
          <Ionicons name="add-circle-outline" size={metrics.iconSize + 2} color={colors.primary} />
          <Text style={[styles.addButtonText, { fontSize: isSmall ? 16 : 17 }]}>Adicionar novo pet</Text>
        </TouchableOpacity>

        {isLoading && (
          <View style={styles.loadingWrap}>
            <ActivityIndicator size="small" color={colors.primary} />
            <Text style={styles.loadingText}>Carregando seus pets...</Text>
          </View>
        )}

        {!isLoading && loadError && (
          <Text style={styles.errorText}>{loadError}</Text>
        )}

        {!isLoading && !loadError && pets.length === 0 && (
          <Text style={styles.emptyText}>Voce ainda nao cadastrou pets.</Text>
        )}

        {pets.map((pet) => (
            <View
              key={pet.id}
              style={[styles.card, { width: metrics.cardWidth }]}
            >
              <Image
                source={{ uri: pet.link_foto }}
                style={[
                  styles.petImage,
                  {
                    width: metrics.imageSize,
                    height: metrics.imageSize,
                    borderRadius: isSmall ? 14 : 16,
                  },
                ]}
                resizeMode="cover"
              />
              <View style={styles.petInfo}>
                <Text numberOfLines={1} style={[styles.petName, { fontSize: metrics.titleSize }]}>{pet.nome}</Text>
                <Text numberOfLines={1} style={[styles.petAge, { fontSize: metrics.subtitleSize }]}>{formatarIdade(pet.dt_nasc)}</Text>
                <View style={styles.speciesBadge}>
                  <Text style={[styles.speciesText, { fontSize: metrics.speciesSize }]}>{pet.especie}</Text>
                </View>
              </View>

              <View style={styles.actionsColumn}>
                <View style={{ position: "relative" }}>
                  <TouchableOpacity
                    onPress={() => setPopoverPetId(popoverPetId === pet.id ? null : pet.id)}
                    style={[styles.actionButton, { width: metrics.actionSize, height: metrics.actionSize }]}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Entypo name="dots-three-vertical" size={metrics.iconSize} color={colors.primary} />
                  </TouchableOpacity>

                  {popoverPetId === pet.id && (
                    <View style={styles.popover}>
                      <TouchableOpacity
                        style={styles.popoverItem}
                        onPress={() => {
                          setPopoverPetId(null);
                          navigateToTab(`/criar-anuncio?petId=${pet.id}`);
                        }}
                      >
                        <Ionicons name="create-outline" size={18} color={colors.primary} />
                        <Text style={styles.popoverText}>Editar</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.popoverItem}
                        onPress={() => {
                          setPopoverPetId(null);
                          handleDelete(pet.id);
                        }}
                      >
                        <MaterialIcons name="delete" size={18} color="#E74C3C" />
                        <Text style={[styles.popoverText, { color: "#E74C3C" }]}>Excluir</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              </View>
            </View>
          ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F3F3F3",
  },
  header: {
    width: "100%",
    backgroundColor: "#fff",
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    paddingTop: 18,
    paddingBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF4F2",
  },
  headerTitleWrap: {
    flex: 1,
    alignItems: "center",
    paddingRight: 40,
  },
  headerTitle: {
    fontSize: 30,
    fontWeight: "800",
    color: "#E74C3C",
  },
  content: {
    paddingTop: 20,
    paddingBottom: 28,
    alignItems: "center",
    gap: 12,
  },
  contentTablet: {
    alignSelf: "center",
    width: "100%",
    maxWidth: 960,
  },
  loadingWrap: {
    alignItems: "center",
    gap: 6,
    marginTop: 12,
  },
  loadingText: {
    fontSize: 13,
    color: "#6b6b6b",
    fontWeight: "600",
  },
  errorText: {
    textAlign: "center",
    color: "#b00020",
    fontSize: 13,
    marginTop: 12,
    fontWeight: "600",
  },
  emptyText: {
    textAlign: "center",
    color: "#6b6b6b",
    fontSize: 14,
    marginTop: 12,
    fontWeight: "600",
  },
  addButton: {
    minHeight: 58,
    borderRadius: 18,
    backgroundColor: "#FFE8E5",
    borderColor: "#FFD0CC",
    borderWidth: 1,
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  addButtonText: {
    color: colors.primary,
    fontWeight: "800",
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 18,
    minHeight: 96,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
    padding: 12,
    borderWidth: 1,
    borderColor: "#ECECEC",
    gap: 12,
  },
  petImage: {
    backgroundColor: colors.buttonBackground,
  },
  petInfo: {
    flex: 1,
    minWidth: 0,
  },
  petName: {
    fontWeight: "800",
    color: colors.primary,
    marginBottom: 2,
  },
  petAge: {
    color: colors.textPrimary,
  },
  speciesBadge: {
    marginTop: 8,
    alignSelf: "flex-start",
    backgroundColor: "#F5F5F5",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  speciesText: {
    color: "#666",
    fontWeight: "700",
    textTransform: "uppercase",
  },
  actionsColumn: {
    gap: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  actionButton: {
    borderRadius: 999,
    backgroundColor: `${colors.secondary}55`,
    alignItems: "center",
    justifyContent: "center",
  },
  modalOverlay: {
    flex: 1,
    zIndex:0,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  popover: {
    position: "absolute",
    right: 0,
    top: "100%",
    marginTop: 8,
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 6,
    minWidth: 120,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 10,
    zIndex: 150,
  },
  popoverItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
    elevation: 8,
  },
  popoverText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.primary,
  },
});