import AppHeader from "@/components/AppHeader";
import { solicitacaoService } from "@/services/solicitacaoService";
import { colors } from "@/styles/variables";
import { FormularioDetalhadoDTO } from "@/types/solicitacao";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

type RespostasMap = Record<string, string>;

export default function ResponderFormularioScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ solicitacaoId?: string | string[] }>();
  const solicitacaoId = Array.isArray(params.solicitacaoId) ? params.solicitacaoId[0] : params.solicitacaoId;

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [details, setDetails] = useState<FormularioDetalhadoDTO | null>(null);
  const [respostas, setRespostas] = useState<RespostasMap>({});

  useEffect(() => {
    async function loadDetails() {
      if (!solicitacaoId) {
        setError("Solicitação não informada.");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const data = await solicitacaoService.detalhar(solicitacaoId);
        setDetails(data);

        const initialAnswers = Object.fromEntries(
          data.perguntasRespostas.map((item) => [item.perguntaId, item.respostaTexto || ""])
        );
        setRespostas(initialAnswers);
      } catch {
        setError("Não foi possível carregar o formulário para resposta.");
      } finally {
        setIsLoading(false);
      }
    }

    void loadDetails();
  }, [solicitacaoId]);

  const perguntas = details?.perguntasRespostas || [];

  const allAnswered = useMemo(() => {
    if (perguntas.length === 0) {
      return false;
    }

    return perguntas.every((item) => (respostas[item.perguntaId] || "").trim().length > 0);
  }, [perguntas, respostas]);

  async function submitRespostas() {
    if (!solicitacaoId || !details) {
      return;
    }

    if (!allAnswered) {
      Alert.alert("Formulário", "Responda todas as perguntas antes de enviar.");
      return;
    }

    setIsSaving(true);
    try {
      for (const pergunta of perguntas) {
        await solicitacaoService.responder({
          solicitacaoId,
          perguntaId: pergunta.perguntaId,
          resposta: (respostas[pergunta.perguntaId] || "").trim(),
        });
      }

      Alert.alert("Sucesso", "Respostas enviadas com sucesso!");
      router.replace("/solicitacoes");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Não foi possível enviar as respostas.";
      Alert.alert("Erro", message);
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return (
      <View style={styles.screen}>
        <AppHeader title="Responder formulário" />
        <View style={styles.feedbackWrap}>
          <ActivityIndicator color={colors.primary} />
          <Text style={styles.feedbackText}>Carregando formulário...</Text>
        </View>
      </View>
    );
  }

  if (error || !details) {
    return (
      <View style={styles.screen}>
        <AppHeader title="Responder formulário" />
        <View style={styles.feedbackWrap}>
          <Text style={styles.feedbackText}>{error || "Formulário indisponível."}</Text>
          <TouchableOpacity style={styles.secondaryButton} onPress={() => router.back()}>
            <Text style={styles.secondaryButtonText}>Voltar</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <AppHeader title="Responder formulário" />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Text style={styles.subtitle}>Publicado por: {details.usuarioCriadorNome}</Text>
          <Text style={styles.helper}>Responda todas as perguntas para concluir sua solicitação.</Text>
        </View>

        {perguntas.map((item, index) => (
          <View key={item.perguntaId} style={styles.card}>
            <Text style={styles.questionTitle}>Pergunta {index + 1}</Text>
            <Text style={styles.questionText}>{item.perguntaTexto}</Text>
            <TextInput
              value={respostas[item.perguntaId] || ""}
              onChangeText={(text) => setRespostas((current) => ({ ...current, [item.perguntaId]: text }))}
              multiline
              style={styles.input}
              placeholder="Digite sua resposta"
              placeholderTextColor="#8c8c8c"
            />
          </View>
        ))}

        <TouchableOpacity
          style={[styles.primaryButton, (!allAnswered || isSaving) && { opacity: 0.7 }]}
          disabled={!allAnswered || isSaving}
          onPress={submitRespostas}
        >
          <Text style={styles.primaryButtonText}>{isSaving ? "Enviando..." : "Enviar respostas"}</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  content: {
    paddingTop: 114,
    paddingHorizontal: 16,
    paddingBottom: 26,
    gap: 10,
  },
  feedbackWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingHorizontal: 20,
  },
  feedbackText: {
    color: "#666",
    textAlign: "center",
    fontWeight: "600",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#ececec",
    padding: 12,
    gap: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#222",
    fontWeight: "700",
  },
  helper: {
    color: "#666",
    fontSize: 13,
  },
  questionTitle: {
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    color: colors.primary,
    fontWeight: "800",
  },
  questionText: {
    color: "#222",
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "600",
  },
  input: {
    minHeight: 100,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e6e6e6",
    backgroundColor: "#fafafa",
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: "#222",
    textAlignVertical: "top",
  },
  primaryButton: {
    marginTop: 4,
    minHeight: 52,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary,
  },
  primaryButtonText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 16,
  },
  secondaryButton: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  secondaryButtonText: {
    color: colors.primary,
    fontWeight: "700",
  },
});
