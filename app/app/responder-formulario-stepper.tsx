import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import colors from "@/styles/colors";
import { getFormularioTemplateById } from "@/services/formularioService";
import { createSolicitacaoComRespostas } from "@/services/solicitacaoService";
import type { FormularioTemplateDTO } from "@/types/Formulario";

export default function ResponderFormularioStepper() {
  const router = useRouter();
  const params = useLocalSearchParams<{ formularioId?: string; solicitacaoId?: string; petId?: string }>();
  const formularioId = Array.isArray(params.formularioId) ? params.formularioId[0] : params.formularioId;
  const solicitacaoId = Array.isArray(params.solicitacaoId) ? params.solicitacaoId[0] : params.solicitacaoId;
  const petId = Array.isArray(params.petId) ? params.petId[0] : params.petId;

  const [formulario, setFormulario] = useState<FormularioTemplateDTO | null>(null);
  const [respostas, setRespostas] = useState<Record<string, string>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
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

  const handleNext = () => {
    const total = formulario?.perguntas?.length || 0;
    if (currentIndex < total - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleSubmit = async () => {
    if (!petId) {
      Alert.alert("Erro", "Pet não informado.");
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
      await createSolicitacaoComRespostas({
        petId,
        respostas: formulario.perguntas.map((pergunta) => ({
          perguntaId: pergunta.id,
          perguntaTexto: pergunta.texto,
          respostaTexto: respostas[pergunta.id],
        })),
      });
      router.back();
    } catch {
      Alert.alert("Erro", "Nao foi possivel enviar suas respostas.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalQuestions = formulario?.perguntas?.length || 0;
  const currentQuestion = formulario?.perguntas?.[currentIndex] || null;
  const progress = totalQuestions > 0 ? (currentIndex + 1) / totalQuestions : 0;

  return (
    <SafeAreaView style={styles.screen} edges={["top", "left", "right", "bottom"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.primary} />
        </TouchableOpacity>
        {/* <Ionicons name="pets" size={24} color={colors.primary} style={{ marginRight: 8 }} /> */}
        <Text style={styles.headerTitle}>Formulário</Text>
       
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Barra de Progresso */}
        <View style={styles.progressContainer}>
          <View style={styles.progressInfo}>
            <Text style={styles.progressLabel}>Progresso da Adoção</Text>
            <Text style={styles.progressPercentage}>{Math.round(progress * 100)}% completo</Text>
          </View>
          <View style={styles.progressBarBackground}>
            <View style={[styles.progressBarFill, { width: `${progress * 100}%` }]} />
          </View>
        </View>

        {isLoading && (
          <View style={styles.feedbackWrap}>
            <ActivityIndicator size="small" color={colors.primary} />
            <Text style={styles.feedbackText}>Carregando formulario...</Text>
          </View>
        )}

        {!isLoading && error && (
          <Text style={styles.errorText}>{error}</Text>
        )}

        {!isLoading && !error && formulario?.perguntas && currentQuestion && (
          <View style={styles.questionSection}>

            <View style={styles.textContainer}>
              <Text style={styles.questionTitle}>{currentQuestion.texto}</Text>
              <Text style={styles.questionDescription}>
                Compartilhe sua motivação para darmos o próximo passo juntos.
              </Text>
            </View>

            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Coloque sua resposta aqui..."
                value={respostas[currentQuestion.id] || ""}
                onChangeText={(value) => handleAnswerChange(currentQuestion.id, value)}
                multiline
                numberOfLines={6}
                textAlignVertical="top"
              />
            </View>
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        {currentIndex < totalQuestions - 1 ? (
          <TouchableOpacity style={styles.primaryButton} onPress={handleNext}>
            <Text style={styles.primaryButtonText}>Próximo</Text>
            <Ionicons name="arrow-forward" size={20} color="#fff" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.primaryButton, isSubmitting && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            <Text style={styles.primaryButtonText}>
              {isSubmitting ? "Enviando..." : "Enviar respostas"}
            </Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.secondaryButton} onPress={currentIndex > 0 ? handleBack : () => router.back()}>
          <Ionicons name="arrow-back" size={20} color="#6f595a" />
          <Text style={styles.secondaryButtonText}>Voltar</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#fff8f7",
  },
  header: {
    width: "100%",
    backgroundColor: "#fff",
    paddingTop: 42,
    paddingBottom: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  backButton: {
    position: "absolute",
    left: 16,
    top: 44,
  },
  profileButton: {
    position: "absolute",
    right: 16,
    top: 42,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.primary,
    letterSpacing: -0.5,
  },
  content: {
    padding: 16,
    paddingBottom: 160,
  },
  progressContainer: {
    marginBottom: 32,
  },
  progressInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.primary,
  },
  progressPercentage: {
    fontSize: 12,
    color: "#6B6B6B",
  },
  progressBarBackground: {
    height: 12,
    backgroundColor: "#f6dddc",
    borderRadius: 6,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: colors.primary,
    borderRadius: 6,
  },
  questionSection: {
    gap: 24,
  },
  imageCard: {
    width: "100%",
    aspectRatio: 4 / 3,
    borderRadius: 28,
    backgroundColor: "#ce434b",
    overflow: "hidden",
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  imagePlaceholder: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ac2a35",
  },
  imageOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  imageTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#fff",
  },
  imageSubtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.9)",
  },
  textContainer: {
    gap: 8,
  },
  questionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#251818",
  },
  questionDescription: {
    fontSize: 14,
    color: "#594140",
    lineHeight: 20,
  },
  inputWrapper: {
    position: "relative",
  },
  input: {
    minHeight: 160,
    backgroundColor: "#fff",
    borderRadius: 28,
    borderWidth: 1,
    borderColor: "#ECECEC",
    padding: 24,
    fontSize: 16,
    color: "#251818",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  inputIcon: {
    position: "absolute",
    bottom: 16,
    right: 16,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    paddingBottom: 40,
    backgroundColor: "#fff8f7",
    gap: 12,
  },
  primaryButton: {
    paddingVertical: 6,
    backgroundColor: colors.primary,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    shadowColor: colors.primary,
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "600",
  },
  secondaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  secondaryButtonText: {
    color: "#6f595a",
    fontSize: 18,
    fontWeight: "400",
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  feedbackWrap: {
    alignItems: "center",
    gap: 6,
    marginTop: 24,
  },
  feedbackText: {
    fontSize: 13,
    color: "#666",
  },
  errorText: {
    textAlign: "center",
    color: "#b00020",
    fontSize: 14,
    marginTop: 24,
  },
});