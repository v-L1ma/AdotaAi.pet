import AppHeader from "@/components/AppHeader";
import { formularioService } from "@/services/formularioService";
import { colors } from "@/styles/variables";
import { FormularioTemplateDTO } from "@/types/formulario";
import { useRouter } from "expo-router";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View, Alert, ActivityIndicator } from "react-native";
import React, { useCallback, useEffect, useState } from "react";

export default function GerenciarFormularios() {
  const router = useRouter();
  const [formularios, setFormularios] = useState<FormularioTemplateDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadFormularios = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const forms = await formularioService.listMine();
      setFormularios(forms);
    } catch {
      setError("Não foi possível carregar seus formulários.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadFormularios();
  }, [loadFormularios]);

  function getFormTitle(item: FormularioTemplateDTO) {
    const firstQuestion = item.perguntas?.[0]?.texto?.trim();
    if (firstQuestion) {
      return firstQuestion.length > 42 ? `${firstQuestion.slice(0, 42)}...` : firstQuestion;
    }

    return `Formulário #${item.id.slice(0, 8)}`;
  }

  function handleDelete(id: string) {
    Alert.alert(
      "Excluir formulário",
      "Deseja realmente excluir este formulário?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              await formularioService.remove(id);
              setFormularios((current) => current.filter((item) => item.id !== id));
            } catch {
              Alert.alert("Erro", "Não foi possível excluir o formulário agora.");
            }
          },
        },
      ]
    );
  }

  return (
    <View style={styles.screen}>
      <AppHeader title={"Gerenciar\nFormulários"} titleFontSize={20} titleNumberOfLines={2} />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <Text style={styles.heroSubtitle}>Edite e organize os formulários que os candidatos irão responder.</Text>
        </View>

        {isLoading ? (
          <View style={styles.feedbackWrap}>
            <ActivityIndicator color={colors.primary} />
            <Text style={styles.feedbackText}>Carregando formulários...</Text>
          </View>
        ) : error ? (
          <View style={styles.feedbackWrap}>
            <Text style={styles.feedbackText}>{error}</Text>
            <TouchableOpacity style={styles.secondaryButton} onPress={() => void loadFormularios()}>
              <Text style={styles.secondaryText}>Tentar novamente</Text>
            </TouchableOpacity>
          </View>
        ) : formularios.length === 0 ? (
          <View style={styles.feedbackWrap}>
            <Text style={styles.feedbackText}>Você ainda não possui formulários cadastrados.</Text>
          </View>
        ) : formularios.map((item, index) => (
          <View key={item.id} style={styles.card}>
            <Image
              source={{ uri: index % 2 === 0 ? "https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?w=1200" : "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=1200" }}
              style={styles.cover}
            />

            <View style={styles.headerRow}>
              <Text style={styles.title}>{getFormTitle(item)}</Text>
              <View style={[styles.badge, styles.badgePublished]}>
                <Text style={styles.badgeText}>Publicado</Text>
              </View>
            </View>

            <Text style={styles.info}>{item.perguntas?.length || 0} perguntas</Text>

            <View style={styles.actions}>
              <TouchableOpacity style={styles.secondaryButton} onPress={() => handleDelete(item.id)}>
                <Text style={styles.secondaryText}>Excluir</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.primaryButton} onPress={() => router.push("/criarAnuncio") }>
                <Text style={styles.primaryText}>Vincular anúncio</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        <TouchableOpacity style={styles.cta} onPress={() => router.push("/criarFormulario") }>
          <Text style={styles.ctaText}>Criar novo formulário</Text>
        </TouchableOpacity>
      </ScrollView>
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
  feedbackWrap: {
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginTop: 10,
    marginBottom: 10,
  },
  feedbackText: {
    color: colors.textMuted,
    fontSize: 14,
    textAlign: "center",
    fontWeight: "600",
  },
});
