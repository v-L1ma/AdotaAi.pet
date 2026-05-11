import { Entypo, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import colors from "../styles/colors";
import { useTabNavigation } from "@/hooks/useTabNavigation";
import { getSession } from "@/lib/session";
import { getPetImageUrl, petService } from "@/services/petService";
import { PetDTO } from "@/types/pet";

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

  const [pets, setPets] = useState<PetDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPets = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const allPets = await petService.listAll();
      const userId = getSession()?.userId;
      const filteredPets = userId
        ? allPets.filter((pet) => pet.user_id === userId)
        : allPets;

      setPets(filteredPets);
    } catch {
      setError("Não foi possível carregar seus pets.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadPets();
  }, [loadPets]);

  const handleDelete = (id: string) => {
    Alert.alert(
      'Excluir anúncio',
      'Deseja realmente apagar este anúncio de animal?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await petService.remove(id);
              setPets((current) => current.filter((pet) => pet.id !== id));
            } catch {
              Alert.alert("Erro", "Não foi possível excluir este anúncio agora.");
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

        {isLoading ? (
          <Text style={styles.feedbackText}>Carregando seus pets...</Text>
        ) : error ? (
          <View style={styles.feedbackWrap}>
            <Text style={styles.feedbackText}>{error}</Text>
            <TouchableOpacity style={styles.feedbackButton} onPress={() => void loadPets()}>
              <Text style={styles.feedbackButtonText}>Tentar novamente</Text>
            </TouchableOpacity>
          </View>
        ) : pets.length === 0 ? (
          <Text style={styles.feedbackText}>Você ainda não possui pets anunciados.</Text>
        ) : pets.map((pet) => (
            <View
              key={pet.id || pet.nome}
              style={[styles.card, { width: metrics.cardWidth }]}
            >
              <Image
                source={{ uri: getPetImageUrl(pet.link_foto) }}
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
                <Text numberOfLines={1} style={[styles.petAge, { fontSize: metrics.subtitleSize }]}>{pet.raca || "Raça não informada"}</Text>
                <View style={styles.speciesBadge}>
                  <Text style={[styles.speciesText, { fontSize: metrics.speciesSize }]}>{pet.especie || "N/A"}</Text>
                </View>
              </View>

              <View style={styles.actionsColumn}>
                <TouchableOpacity
                  onPress={() => pet.id && router.push({ pathname: "/criar-anuncio", params: { id: pet.id } })}
                  style={[styles.actionButton, { width: metrics.actionSize, height: metrics.actionSize }]}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Entypo name="dots-three-vertical" size={metrics.iconSize} color={colors.primary} />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => pet.id && handleDelete(pet.id)}
                  style={[styles.actionButton, { width: metrics.actionSize, height: metrics.actionSize }]}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <MaterialIcons name="delete" size={metrics.iconSize + 1} color={colors.primary} />
                </TouchableOpacity>
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
  feedbackWrap: {
    alignItems: "center",
    marginTop: 24,
    gap: 10,
  },
  feedbackText: {
    textAlign: "center",
    color: "#777",
    fontSize: 15,
    marginTop: 10,
    fontWeight: "600",
  },
  feedbackButton: {
    borderRadius: 12,
    borderColor: "#f0c4bf",
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: "#fff3f1",
  },
  feedbackButtonText: {
    color: colors.primary,
    fontWeight: "700",
  },
  actionButton: {
    borderRadius: 999,
    backgroundColor: `${colors.secondary}55`,
    alignItems: "center",
    justifyContent: "center",
  },
});