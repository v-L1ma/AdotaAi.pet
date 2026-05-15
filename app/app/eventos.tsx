import AppHeader from "@/components/AppHeader";
import Skeleton from "@/components/Skeleton";
import { colors } from "@/styles/variables";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { EventoDTO, getEventos } from "@/services/eventoService";
import NavBar from "@/components/NavBar";
import { Ionicons } from "@expo/vector-icons";

const timeRegex = /^([01]\d|2[0-3]):[0-5]\d$/;

const formatarHoraDisplay = (hora: string | undefined): string => {
    if (!hora) return "";
    if (timeRegex.test(hora)) return hora;
    const parsed = new Date(hora);
    if (Number.isNaN(parsed.getTime())) return "";
    return parsed.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
};

export default function Eventos() {
  const router = useRouter();
  const [eventos, setEventos] = useState<EventoDTO[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadEventos() {
      setIsLoading(true);
      setLoadError(null);

      try {
        const response = await getEventos();
        if (isMounted) {
          setEventos(response ?? []);
        }
      } catch {
        if (isMounted) {
          setLoadError("Nao foi possivel carregar os eventos.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadEventos();

    return () => {
      isMounted = false;
    };
  }, []);

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

  const formatarLocal = (evento: EventoDTO) => {
    const parts = [evento.endereco, evento.bairro, evento.cidade].filter(Boolean);
    if (parts.length > 0) {
      return parts.join(", ");
    }

    return "Local nao informado";
  };

  const listHeader = useMemo(() => <Hero />, []);

  return (
    <View style={styles.screen}>
      <AppHeader title="Eventos" titleFontSize={20} />

      <FlatList
        data={eventos}
        keyExtractor={(item) => item.id ?? ""}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={listHeader}
        ListEmptyComponent={
          isLoading ? (
            <View style={styles.loadingWrap}>
              {[1, 2, 3, 4].map((i) => (
                <Skeleton.EventoCard key={i} />
              ))}
            </View>
          ) : loadError ? (
            <Text style={styles.emptyText}>{loadError}</Text>
          ) : (
            <Text style={styles.emptyText}>Nenhum evento encontrado.</Text>
          )
        }
        renderItem={({ item }) => (
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
            </View>
          </TouchableOpacity>
        )}
      />
      <NavBar></NavBar>
    </View>
  );
}

function Hero() {
  return (
    <View style={styles.hero}>
      <Text style={styles.heroTitle}>Participe de eventos de adocao e bem-estar animal</Text>
      <Text style={styles.heroSubtitle}>Encontros, campanhas e acoes para conectar familias e pets.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F8F8F8",
  },
  list: {
    paddingTop: 110,
    paddingHorizontal: 14,
    paddingBottom: 32,
    gap: 12,
  },
  hero: {
    marginBottom: 4,
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
});
