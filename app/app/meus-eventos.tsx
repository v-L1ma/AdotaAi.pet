import AppHeader from "@/components/AppHeader";
import Skeleton from "@/components/Skeleton";
import { colors } from "@/styles/variables";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useState, useCallback } from "react";
import { Alert, FlatList, Image, Pressable, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View, RefreshControl } from "react-native";
import { deleteEvento, EventoDTO, getEventosUsuario } from "@/services/eventoService";
import Ionicons from "@expo/vector-icons/build/Ionicons";
import { useFocusEffect } from "@react-navigation/native";

const timeRegex = /^([01]\d|2[0-3]):[0-5]\d$/;

export default function MeusEventos() {
  const router = useRouter();
  const [eventos, setEventos] = useState<EventoDTO[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [menuVisible, setMenuVisible] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

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

  const loadEventos = useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);

    try {
      const response = await getEventosUsuario();
      setEventos(response ?? []);
    } catch {
      setLoadError("Nao foi possivel carregar os eventos.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadEventos();
    }, [loadEventos])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadEventos();
    setRefreshing(false);
  }, [loadEventos]);

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

  const handleEdit = (evento: EventoDTO) => {
    setMenuVisible(null);
    router.push({
      pathname: "/criar-evento",
      params: { id: evento.id },
    });
  };

  const handleDelete = (evento: EventoDTO) => {
    setMenuVisible(null);
    Alert.alert(
      "Remover Evento",
      `Tem certeza que deseja remover "${evento.nome}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Remover",
          style: "destructive",
          onPress: async () => {
            setIsDeleting(evento.id ?? null);
            try {
              await deleteEvento(evento.id ?? "");
              setEventos((prev) => prev.filter((e) => e.id !== evento.id));
            } catch {
              Alert.alert("Erro", "Nao foi possivel remover o evento.");
            } finally {
              setIsDeleting(null);
            }
          },
        },
      ]
    );
  };

  const closeMenu = () => setMenuVisible(null);

  return (
    <View style={styles.screen}>
      <AppHeader title="Meus Eventos" titleFontSize={20} />

      <View style={styles.hero}>
        <Text style={styles.heroTitle}>Participe de eventos de adocao e bem-estar animal</Text>
        <Text style={styles.heroSubtitle}>Encontros, campanhas e acoes para conectar familias e pets.</Text>
      </View>

      <TouchableOpacity
          onPress={() => {router.push("/criar-evento")}}
          style={[styles.addButton, { width: metrics.cardWidth }]}
        >
        <Ionicons name="add-circle-outline" size={metrics.iconSize + 2} color={colors.primary} />
        <Text style={[styles.addButtonText, { fontSize: isSmall ? 16 : 17 }]}>Adicionar novo evento</Text>
      </TouchableOpacity>

      <FlatList
        data={eventos}
        keyExtractor={(item) => item.id ?? ""}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        style={{ width: metrics.cardWidth }}
        refreshing={refreshing}
        onRefresh={onRefresh}
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
              disabled={!!menuVisible}
            >
              <Image
                source={{ uri: item.link_foto || "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=1200" }}
                style={styles.cardImage}
              />

              <View style={styles.cardBody}>
                {item.mensagemReprovado && (
                  <View style={styles.warningBox}>
                    <Ionicons name="warning" size={14} color="#856404" />
                    <Text style={styles.warningText}>Atenção: {item.mensagemReprovado}</Text>
                  </View>
                )}
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

          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => setMenuVisible(menuVisible === (item.id ?? "") ? null : item.id ?? "")}
          >
            <Ionicons name="ellipsis-vertical" size={18} color={colors.text} />
          </TouchableOpacity>

          {menuVisible === item.id && (
            <View style={styles.menuPopup}>
              <TouchableOpacity style={styles.menuOption} onPress={() => handleEdit(item)}>
                <Ionicons name="create-outline" size={16} color={colors.text} />
                <Text style={styles.menuOptionText}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.menuOption}
                onPress={() => handleDelete(item)}
                disabled={isDeleting === item.id}
              >
                <Ionicons name="trash-outline" size={16} color="#b00020" />
                <Text style={[styles.menuOptionText, { color: "#b00020" }]}>
                  {isDeleting === item.id ? "Removendo..." : "Remover"}
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {menuVisible && menuVisible !== item.id && (
            <Pressable style={styles.menuOverlay} onPress={closeMenu} />
          )}
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
  cardWrap: {
    position: "relative",
  },
  menuButton: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.9)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  menuPopup: {
    position: "absolute",
    top: 42,
    right: 8,
    backgroundColor: colors.surfaceLowest,
    borderRadius: 10,
    shadowColor: "#191C1D",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 5,
    zIndex: 20,
    minWidth: 120,
    overflow: "hidden",
  },
  menuOption: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceLow,
  },
  menuOptionText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
  },
  menuOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 15,
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
  warningBox: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#FFF3CD",
    borderRadius: 2,
    paddingHorizontal: 8,
    paddingVertical: 6,
    marginBottom: 6,
    borderLeftWidth: 3,
    borderLeftColor: "#FFC107",
  },
  warningText: {
    color: "#856404",
    fontSize: 12,
    fontWeight: "600",
  },
});
