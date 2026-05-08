import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import colors from "@/styles/colors";
import { getFormularioTemplateById } from "@/services/formularioService";
import { submitSolicitacaoRespostas } from "@/services/solicitacaoService";
import type { FormularioTemplateDTO } from "@/types/Formulario";

export default function ResponderFormulario() {
  const router = useRouter();
  const params = useLocalSearchParams<{ formularioId?: string; solicitacaoId?: string }>();
  const formularioId = Array.isArray(params.formularioId) ? params.formularioId[0] : params.formularioId;
  const solicitacaoId = Array.isArray(params.solicitacaoId) ? params.solicitacaoId[0] : params.solicitacaoId;

  const [formulario, setFormulario] = useState<FormularioTemplateDTO | null>(null);
  const [respostas, setRespostas] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!formularioId) {
      setError("Formulario nao informado.");
      return;
    }

    let isMounted = true;

    async function loadFormulario() {
      setIsLoading(true);
      setError(null);

      try {
        const response = await getFormularioTemplateById(formularioId);
        if (isMounted) {
          setFormulario(response);
        }
      } catch {
        if (isMounted) {
          setError("Nao foi possivel carregar o formulario.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadFormulario();

    return () => {
      isMounted = false;
    };
  }, [formularioId]);

  const handleAnswerChange = (id: string, value: string) => {
    setRespostas((current) => ({ ...current, [id]: value }));
  };

  const handleSubmit = async () => {
    if (!solicitacaoId) {
      Alert.alert("Erro", "Solicitacao nao informada.");
      return;
    }

    if (!formulario?.perguntas?.length) {
      Alert.alert("Erro", "Formulario vazio.");
      return;
    }

    const unanswered = formulario.perguntas.filter((pergunta) => !respostas[pergunta.id]?.trim());
    if (unanswered.length > 0) {
      Alert.alert("Campos obrigatorios", "Responda todas as perguntas antes de enviar.");
      return;
    }

    setIsSubmitting(true);

    try {
      await submitSolicitacaoRespostas(
        formulario.perguntas.map((pergunta) => ({
          solicitacaoId,
          perguntaId: pergunta.id,
          resposta: respostas[pergunta.id],
        }))
      );
      router.back();
    } catch {
      Alert.alert("Erro", "Nao foi possivel enviar suas respostas.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.screen} edges={["top", "left", "right", "bottom"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Responder formulario</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {isLoading && (
          <View style={styles.feedbackWrap}>
            <ActivityIndicator size="small" color={colors.primary} />
            <Text style={styles.feedbackText}>Carregando formulario...</Text>
          </View>
        )}

        {!isLoading && error && (
          <Text style={styles.errorText}>{error}</Text>
        )}

        {!isLoading && !error && formulario?.perguntas?.map((pergunta, index) => (
          <View key={pergunta.id} style={styles.card}>
            <Text style={styles.questionLabel}>Pergunta {index + 1}</Text>
            <Text style={styles.questionText}>{pergunta.texto}</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite sua resposta"
              value={respostas[pergunta.id] || ""}
              onChangeText={(value) => handleAnswerChange(pergunta.id, value)}
              multiline
            />
          </View>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          <Text style={styles.submitButtonText}>{isSubmitting ? "Enviando..." : "Enviar respostas"}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#f6f7f9",
  },
  header: {
    width: "100%",
    backgroundColor: "#fff",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    paddingTop: 42,
    paddingBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  backButton: {
    position: "absolute",
    left: 16,
    top: 44,
    zIndex: 2,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: colors.primary,
    textAlign: "center",
  },
  content: {
    padding: 16,
    paddingBottom: 120,
    gap: 12,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: "#ebedf0",
    gap: 8,
  },
  questionLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#888",
    textTransform: "uppercase",
  },
  questionText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
  },
  input: {
    minHeight: 64,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#fdfdfd",
    fontSize: 14,
    color: "#333",
  },
  footer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    padding: 16,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  submitButton: {
    minHeight: 48,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "800",
  },
  feedbackWrap: {
    alignItems: "center",
    gap: 6,
    marginTop: 12,
  },
  feedbackText: {
    fontSize: 13,
    color: "#666",
  },
  errorText: {
    textAlign: "center",
    color: "#b00020",
    fontSize: 14,
    marginTop: 12,
  },
});
