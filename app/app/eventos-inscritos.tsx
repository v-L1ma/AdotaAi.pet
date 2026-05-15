import AppHeader from "@/components/AppHeader";
import Skeleton from "@/components/Skeleton";
import { colors } from "@/styles/variables";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Alert, FlatList, Image, Platform, Pressable, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from "react-native";
import { EventoDTO, removerPresenca } from "@/services/eventoService";
import Ionicons from "@expo/vector-icons/build/Ionicons";
import { useEventosInscritos } from "@/hooks/useEventosInscritos";

const timeRegex = /^([01]\d|2[0-3]):[0-5]\d$/;

export default function EventosInscritos() {
  const router = useRouter();
  const {eventos, isLoading, error, refetch} = useEventosInscritos();
  const [isCancelling, setIsCancelling] = useState<string | null>(null);

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

  const formatarData = (data?: string, hora?: string) => {
    if (!data) {
      return "Data nao informada";
    }

    const parsed = new Date(data);
    if (Number.isNaN(parsed.getTime())) {
      return "Data nao informada";
    }

    const dia = parsed.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
    if (hora) {
      return `${dia} · ${hora}`;
    }

    return dia;
  };

  const formatarHoraDisplay = (hora: string | undefined): string => {
    if (!hora) return "";
    if (timeRegex.test(hora)) return hora;
    const parsed = new Date(hora);
    if (Number.isNaN(parsed.getTime())) return "";
    return parsed.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  };

  const formatarLocal = (evento: EventoDTO) => {
    const parts = [evento.endereco, evento.bairro, evento.cidade].filter(Boolean);
    if (parts.length > 0) {
      return parts.join(", ");
    }

    return "Local nao informado";
  };

  const handleCancelarInscricao = (evento: EventoDTO) => {
    if(Platform.OS === "web") {
      if(window.confirm(`Tem certeza que deseja cancelar sua presença em "${evento.nome}"?`)) {
        setIsCancelling(evento.id ?? null); 
        removerPresenca(evento.id ?? "").then(() => {
          refetch();
        });
      }
      return;
    }
    Alert.alert(
      "Cancelar Inscrição",
      `Tem certeza que deseja cancelar sua presença em "${evento.nome}"?`,
      [
        { text: "Não", style: "cancel" },
        {
          text: "Sim, cancelar",
          style: "destructive",
          onPress: async () => {
            setIsCancelling(evento.id ?? null);
            try {
              await removerPresenca(evento.id ?? "").then(() => {
                refetch();
                setIsCancelling(null);
              });
            } catch {
              Alert.alert("Erro", "Não foi possível cancelar a inscrição.");
            } finally {
              setIsCancelling(null);
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.screen}>
      <AppHeader title="Meus Eventos Inscritos" titleFontSize={20} />

      <View style={styles.hero}>
        <Text style={styles.heroTitle}>Eventos que você confirmou presença</Text>
        <Text style={styles.heroSubtitle}>Gerencie suas inscrições em eventos de adoção.</Text>
      </View>

      <FlatList
        data={eventos}
        keyExtractor={(item) => item.id ?? ""}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        style={{ width: metrics.cardWidth }}
        ListEmptyComponent={
          isLoading ? (
            <View style={styles.loadingWrap}>
              {[1, 2, 3, 4].map((i) => (
                <Skeleton.EventoCard key={i} />
              ))}
            </View>
          ) : error ? (
            <Text style={styles.emptyText}>{error}</Text>
          ) : (
            <View style={styles.emptyContainer}>
              <Ionicons name="calendar-outline" size={48} color={colors.textMuted} />
              <Text style={styles.emptyTitle}>Nenhum evento inscrito</Text>
              <Text style={styles.emptySubtitle}>
                Quando você confirmar presença em um evento, ele aparecerá aqui.
              </Text>
              <TouchableOpacity
                style={styles.exploreButton}
                onPress={() => router.push("/eventos")}
              >
                <Text style={styles.exploreButtonText}>Explorar Eventos</Text>
              </TouchableOpacity>
            </View>
          )
        }
        renderItem={({ item }) => (
          <View style={styles.cardWrap}>
            <TouchableOpacity
              style={styles.card}
              onPress={() =>
                router.push({
                  pathname: "/detalhes-evento" as never,
                  params: {
                    id: item.id,
                  },
                })
              }
            >
              <Image
                source={{ uri: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=1200" }}
                style={styles.cardImage}
              />

              <View style={styles.cardBody}>
                <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
                  <Text style={styles.title}>{item.nome}</Text>
                  <Text style={[styles.meta, {color: colors.primary}]}>
                    <Ionicons name="people" size={16} color={colors.primary} /> 
                    {item.contagemPresencas}
                  </Text>
                </View>
                <Text style={styles.meta}>{formatarData(item.data, formatarHoraDisplay(item.hrinicio))}</Text>
                <Text style={styles.meta}>{formatarLocal(item)}</Text>
                {item.contagemPresencas !== undefined && (
                  <Text style={styles.participantes}>
                    {item.contagemPresencas} participante{item.contagemPresencas !== 1 ? "s" : ""}
                  </Text>
                )}
                <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => handleCancelarInscricao(item)}
              disabled={isCancelling === item.id}
            >
              {isCancelling === item.id ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <>
                  <Ionicons name="close-circle-outline" size={16} color="white" />
                  <Text style={styles.cancelButtonText}>Cancelar Inscricao</Text>
                </>
              )}
            </TouchableOpacity>
              </View>
              
            </TouchableOpacity>

            
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F8F8F8",
    paddingTop: 130,
    alignItems: "center",
  },
  list: {
    paddingTop: 0,
    paddingHorizontal: 0,
    paddingBottom: 32,
    gap: 12,
  },
  hero: {
    marginBottom: 12,
    alignItems: "center",
  },
  heroTitle: {
    color: colors.text,
    fontSize: 19,
    lineHeight: 25,
    fontWeight: "800",
    marginTop: 4,
    textAlign: "center",
  },
  heroSubtitle: {
    marginTop: 4,
    color: colors.textMuted,
    fontSize: 12,
    lineHeight: 17,
    textAlign: "center",
  },
  loadingWrap: {
    alignItems: "center",
    gap: 6,
    marginTop: 12,
  },
  loadingText: {
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: "600",
  },
  emptyText: {
    textAlign: "center",
    color: colors.textMuted,
    fontSize: 13,
    marginTop: 12,
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyTitle: {
    marginTop: 12,
    fontSize: 18,
    fontWeight: "800",
    color: colors.text,
    textAlign: "center",
  },
  emptySubtitle: {
    marginTop: 8,
    fontSize: 14,
    color: colors.textMuted,
    textAlign: "center",
    lineHeight: 20,
  },
  exploreButton: {
    marginTop: 20,
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  exploreButtonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 15,
  },
  card: {
    backgroundColor: colors.surfaceLowest,
    borderRadius: 14,
    overflow: "hidden",
    shadowColor: "#191C1D",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 2,
  },
  cardImage: {
    width: "100%",
    height: 120,
  },
  cardBody: {
    paddingHorizontal: 12,
    paddingVertical: 9,
    gap: 4,
  },
  tag: {
    alignSelf: "flex-start",
    backgroundColor: "#FFE0DE",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 99,
  },
  tagText: {
    color: colors.primary,
    fontWeight: "700",
    fontSize: 11,
  },
  title: {
    fontSize: 18,
    lineHeight: 22,
    fontWeight: "800",
    color: colors.text,
  },
  meta: {
    fontSize: 12,
    lineHeight: 16,
    color: colors.textMuted,
  },
  participantes: {
    marginTop: 4,
    fontSize: 11,
    fontWeight: "600",
    color: colors.primary,
  },
  cardWrap: {
    position: "relative",
  },
  cancelButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#e0032c",
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: 10,
    gap: 4,
    shadowColor: "#191C1D",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  cancelButtonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 11,
  },
});