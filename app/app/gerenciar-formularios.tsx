import AppHeader from "@/components/AppHeader";
import CardFormulario from "@/components/CardFormulario";
import SelecionarPetModal from "@/components/SelecionarPetModal";
import Skeleton from "@/components/Skeleton";
import { colors } from "@/styles/variables";
import { Formulario } from "@/types/Formulario";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, RefreshControl } from "react-native";
import { getFormularios } from "@/services/formularioService";

export default function GerenciarFormularios() {
  const router = useRouter();
  const [formularios, setFormularios] = useState<Formulario[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPetModalVisible, setIsPetModalVisible] = useState(false);
  const [formularioSelecionado, setFormularioSelecionado] = useState<Formulario | null>(null);

  const carregarFormularios = useCallback(() => {
    let isActive = true;
    setIsLoading(true);
    setError(null);

    getFormularios()
      .then((data) => {
        if (!isActive) return;
        setFormularios(data);
      })
      .catch(() => {
        if (!isActive) return;
        setError("Nao foi possivel carregar os formularios.");
        setFormularios([]);
      })
      .finally(() => {
        if (!isActive) return;
        setIsLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, []);

  useFocusEffect(
    useCallback(() => {
      const cleanup = carregarFormularios();
      return () => cleanup?.();
    }, [carregarFormularios])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await carregarFormularios();
    setRefreshing(false);
  }, [carregarFormularios]);

  const handleAbrirModal = (formulario: Formulario) => {
    setFormularioSelecionado(formulario);
    setIsPetModalVisible(true);
  };

  const handleFecharModal = () => {
    setIsPetModalVisible(false);
    setFormularioSelecionado(null);
  };

  return (
    <View style={styles.screen}>
      <AppHeader title={"Gerenciar\nFormulários"} titleFontSize={20} titleNumberOfLines={2} />

      <ScrollView 
        contentContainerStyle={styles.content} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.hero}>
          <Text style={styles.heroSubtitle}>Edite e organize os formulários que os candidatos irão responder.</Text>
        </View>

        {isLoading && (
          <View>
            {[1, 2, 3].map((i) => (
              <Skeleton.FormularioCard key={i} />
            ))}
          </View>
        )}
        {!isLoading && error && <Text style={styles.feedbackText}>{error}</Text>}
        {!isLoading && !error && formularios.length === 0 && (
          <Text style={styles.feedbackText}>Nenhum formulario encontrado.</Text>
        )}
        {!isLoading && !error && formularios.map((item) => (
          <CardFormulario
            key={item.id}
            item={item}
            index={item.id}
            onVicularAnuncio={handleAbrirModal}
            showEditButton={true}
          />
        ))}

        <TouchableOpacity style={styles.cta} onPress={() => router.push("/criarFormulario") }>
          <Text style={styles.ctaText}>Criar novo formulário</Text>
        </TouchableOpacity>
      </ScrollView>

      <SelecionarPetModal
        visible={isPetModalVisible}
        onClose={handleFecharModal}
        formulario={formularioSelecionado}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F9F9F9",
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 126,
    paddingBottom: 68,
    gap: 14,
  },
  hero: {
    marginBottom: 4,
  },
  heroSubtitle: {
    marginTop: 2,
    color: colors.textMuted,
    fontSize: 15,
    lineHeight: 21,
  },
  card: {
    backgroundColor: colors.surfaceLowest,
    borderRadius: 18,
    overflow: "hidden",
    shadowColor: "#191C1D",
    shadowOpacity: 0.07,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    elevation: 3,
  },
  cover: {
    width: "100%",
    height: 145,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    alignItems: "center",
    paddingHorizontal: 14,
    paddingTop: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.text,
    flex: 1,
  },
  info: {
    color: colors.textMuted,
    fontSize: 13,
    paddingHorizontal: 14,
    marginTop: 4,
  },
  badge: {
    borderRadius: 99,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgePublished: {
    backgroundColor: "#D9F4DF",
  },
  badgeDraft: {
    backgroundColor: "#FFE8CE",
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.text,
  },
  actions: {
    marginTop: 12,
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 14,
    paddingBottom: 14,
  },
  primaryButton: {
    flex: 1.2,
    backgroundColor: colors.primary,
    borderRadius: 12,
    minHeight: 44,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  secondaryButton: {
    flex: 1,
    borderRadius: 12,
    backgroundColor: colors.secondaryContainer,
    minHeight: 44,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  primaryText: {
    color: "white",
    fontWeight: "700",
    fontSize: 13,
    textAlign: "center",
    width: "100%",
    includeFontPadding: false,
    lineHeight: 16,
  },
  secondaryText: {
    color: colors.text,
    fontWeight: "700",
    fontSize: 13,
    textAlign: "center",
    width: "100%",
    includeFontPadding: false,
    lineHeight: 16,
  },
  cta: {
    marginTop: 4,
    backgroundColor: colors.primary,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    shadowColor: colors.primary,
    shadowOpacity: 0.24,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 14,
    elevation: 5,
  },
  ctaText: {
    color: "white",
    fontSize: 17,
    fontWeight: "700",
  },
  feedbackText: {
    color: colors.textMuted,
    fontSize: 14,
    textAlign: "center",
    marginVertical: 8,
  },
});
