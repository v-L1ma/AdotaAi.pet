import AppHeader from "@/components/AppHeader";
import { colors } from "@/styles/variables";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { getEventoById, registrarPresenca } from "@/services/eventoService";
import Ionicons from "@expo/vector-icons/build/Ionicons";

const timeRegex = /^([01]\d|2[0-3]):[0-5]\d$/;

const formatarHoraDisplay = (hora: string | undefined): string => {
    if (!hora) return "";
    if (timeRegex.test(hora)) return hora;
    const parsed = new Date(hora);
    if (Number.isNaN(parsed.getTime())) return "";
    return parsed.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
};

type EventoDTO = {
  id?: string;
  nome: string;
  endereco?: string;
  bairro?: string;
  cidade?: string;
  cep?: string;
  hrinicio?: string;
  hrfim?: string;
  descricao?: string;
  data?: string;
  status?: string;
  nmorganizador?: string;
  isInscrito?: boolean;
};

export default function DetalhesEvento() {
  const params = useLocalSearchParams<{ id?: string }>();
  const eventoId = Array.isArray(params.id) ? params.id[0] : params.id;

  const [evento, setEvento] = useState<EventoDTO | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isInscritoLoading, setIsInscritoLoading] = useState(false);
  const [isInscrito, setIsInscrito] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!eventoId) {
      setLoadError("Evento nao informado.");
      return;
    }

    let isMounted = true;

    async function loadEvento() {
      setIsLoading(true);
      setLoadError(null);

      try {
        const response = await getEventoById(eventoId);
        if (isMounted) {
          setEvento(response);
          setIsInscrito(response.isInscrito ?? false);
        }
      } catch {
        if (isMounted) {
          setLoadError("Nao foi possivel carregar o evento.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadEvento();

    return () => {
      isMounted = false;
    };
  }, [eventoId]);

  const dataLabel = useMemo(() => {
    if (!evento?.data) {
      return "Data nao informada";
    }

    const parsed = new Date(evento.data);
    if (Number.isNaN(parsed.getTime())) {
      return "Data nao informada";
    }

    return parsed.toLocaleDateString("pt-BR", {
      weekday: "long",
      day: "2-digit",
      month: "short",
    });
  }, [evento?.data]);

const horarioLabel = useMemo(() => {
    if (!evento) {
      return "Horario nao informado";
    }

    const inicio = evento.hrinicio ? formatarHoraDisplay(evento.hrinicio) : "";
    const fim = evento.hrfim ? formatarHoraDisplay(evento.hrfim) : "";

    if (inicio && fim) {
      return `${inicio} - ${fim}`;
    }

    return inicio || fim || "Horario nao informado";
  }, [evento]);

  const localLabel = useMemo(() => {
    if (!evento) {
      return "Localizacao nao informada";
    }

    const parts = [evento.endereco, evento.bairro, evento.cidade].filter(Boolean);
    if (parts.length > 0) {
      return parts.join(", ");
    }

    return "Localizacao nao informada";
  }, [evento]);

  return (
    <View style={styles.screen}>
      <AppHeader title="Detalhes do Evento" titleFontSize={20} />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.heroWrap}>
          <Image source={{ uri: "https://images.unsplash.com/photo-1517849845537-4d257902454a?w=1400" }} style={styles.heroImage} />
          <View style={styles.heroOverlay} />
        </View>

        <View style={styles.coverCard}>
          {isLoading && (
            <View style={styles.loadingWrap}>
              <ActivityIndicator size="small" color={colors.primary} />
              <Text style={styles.loadingText}>Carregando evento...</Text>
            </View>
          )}

          {!isLoading && loadError && (
            <Text style={styles.errorText}>{loadError}</Text>
          )}

          {!isLoading && !loadError && evento && (
            <>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{evento.status || "Evento"}</Text>
              </View>

              <Text style={styles.title}>{evento.nome}</Text>

              <View style={styles.infoGrid}>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Data</Text>
                  <Text style={styles.infoValue}>{dataLabel}</Text>
                </View>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Horario</Text>
                  <Text style={styles.infoValue}>{horarioLabel}</Text>
                </View>
                <View style={[styles.infoItem, styles.infoFull]}>
                  <Text style={styles.infoLabel}>Localizacao</Text>
                  <Text style={styles.infoValue}>{localLabel}</Text>
                </View>
              </View>
            </>
          )}
        </View>

        {isInscrito ? (
          <>
            <TouchableOpacity style={[styles.button, styles.buttonDisabled]} disabled>
              <Ionicons name="checkmark-circle" size={20} color="white" />
              <Text style={styles.buttonText}>Inscrito</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.linkButton}
              onPress={() => router.push("/eventos-inscritos")}
            >
              <Text style={styles.linkText}>Gostaria de desmarcar sua presença? Gerencie seus eventos inscritos</Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity
            style={styles.button}
            onPress={async () => {
              if (!eventoId || isInscritoLoading) return;
              setIsInscritoLoading(true);
              try {
                await registrarPresenca(eventoId);
                setIsInscrito(true);
              } catch {
                alert("Não foi possível confirmar presença. Tente novamente.");
              } finally {
                setIsInscritoLoading(false);
              }
            }}
            disabled={isInscritoLoading}
          >
            {isInscritoLoading ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text style={styles.buttonText}>Quero participar!</Text>
            )}
          </TouchableOpacity>
        )}

        {evento && (
          <>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Sobre o evento</Text>
              <Text style={styles.sectionText}>
                {evento.descricao ||
                  "Participe desta acao para apoiar a adocao responsavel. O evento reune protetores, voluntarios e pessoas interessadas em adotar com consciencia."}
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Informacoes importantes</Text>
              <Text style={styles.sectionText}>• Leve documento com foto</Text>
              <Text style={styles.sectionText}>• Chegue com 15 minutos de antecedencia</Text>
              <Text style={styles.sectionText}>• Havera equipe para tirar duvidas sobre adocao</Text>
            </View>

            <View style={styles.mapSection}>
              <Text style={styles.sectionTitle}>Localizacao</Text>
              <Image source={{ uri: "https://images.unsplash.com/photo-1524661135-423995f22d0b?w=1400" }} style={styles.mapImage} />
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  content: {
    paddingTop: 112,
    paddingBottom: 28,
    gap: 12,
  },
  heroWrap: {
    width: "100%",
    height: 200,
    position: "relative",
  },
  heroImage: {
    width: "100%",
    height: "100%",
  },
  heroOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: "rgba(25, 28, 29, 0.28)",
  },
  coverCard: {
    marginHorizontal: 14,
    marginTop: -32,
    backgroundColor: colors.surfaceLowest,
    borderRadius: 16,
    padding: 12,
    shadowColor: "#191C1D",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 2,
    gap: 8,
  },
  badge: {
    alignSelf: "flex-start",
    backgroundColor: "#FFE5E3",
    borderRadius: 99,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeText: {
    color: colors.primary,
    fontWeight: "700",
    fontSize: 11,
  },
  title: {
    fontSize: 30,
    lineHeight: 30,
    fontWeight: "800",
    color: colors.text,
  },
  infoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  infoItem: {
    width: "48%",
    backgroundColor: colors.surfaceLow,
    borderRadius: 12,
    padding: 9,
    gap: 2,
  },
  infoFull: {
    width: "100%",
  },
  infoLabel: {
    fontSize: 10,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    color: colors.textMuted,
  },
  infoValue: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.text,
  },
  section: {
    marginHorizontal: 14,
    borderRadius: 12,
    backgroundColor: colors.surfaceLowest,
    padding: 12,
    gap: 6,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.text,
  },
  sectionText: {
    fontSize: 13,
    color: colors.textMuted,
    lineHeight: 18,
  },
  mapSection: {
    marginHorizontal: 14,
    gap: 8,
  },
  mapImage: {
    width: "100%",
    height: 150,
    borderRadius: 14,
  },
  loadingWrap: {
    alignItems: "center",
    gap: 6,
  },
  loadingText: {
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: "600",
  },
  errorText: {
    fontSize: 13,
    color: "#b00020",
    fontWeight: "600",
  },
  button: {
    marginTop: 4,
    backgroundColor: colors.primary,
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: "center",
    shadowColor: colors.primary,
    shadowOpacity: 0.24,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 14,
    elevation: 5,
    width: "95%",
    alignSelf: "center",
  },
  buttonDisabled: {
    backgroundColor: "#4CAF50",
    shadowColor: "#4CAF50",
  },
  buttonText: {
    color: "white",
    fontSize: 17,
    fontWeight: "700",
  },
  linkButton: {
    marginTop: 8,
    alignSelf: "center",
    paddingVertical: 8,
  },
  linkText: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
    textDecorationLine: "underline",
  },
});
