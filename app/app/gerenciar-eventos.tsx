import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  Touchable,
  TouchableOpacity,
  View,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AppHeader from "@/components/AppHeader";
import AppModal from "@/components/AppModal";
import Skeleton from "@/components/Skeleton";
import { colors } from "@/styles/variables";
import adminService, { type EventoAdminDTO } from "@/services/adminService";
import StatusBadge from "@/components/StatusBadgeFactory";
import { useFocusEffect } from "@react-navigation/native";

export default function GerenciarEventosScreen() {
  const router = useRouter();
  const [eventos, setEventos] = useState<EventoAdminDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedEvento, setSelectedEvento] = useState<EventoAdminDTO | null>(null);
  const [showReprovarModal, setShowReprovarModal] = useState(false);
  const [motivo, setMotivo] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const loadEventos = useCallback(async () => {
    try {
      const data = await adminService.listarEventosPendentes();
      setEventos(data);
    } catch (error) {
      console.error("Erro ao carregar eventos pendentes:", error);
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

  const handleAprovar = async (eventoId: string) => {
    setIsProcessing(true);
    try {
      await adminService.aprovarEvento(eventoId);
      loadEventos();
    } catch (error) {
      console.error("Erro ao aprovar evento:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReprovar = async () => {
    if (!selectedEvento) return;
    setIsProcessing(true);
    try {
      await adminService.reprovarEvento(selectedEvento.id, motivo);
      setShowReprovarModal(false);
      setMotivo("");
      setSelectedEvento(null);
      loadEventos();
    } catch (error) {
      console.error("Erro ao reprovar evento:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const openReprovarModal = (evento: EventoAdminDTO) => {
    setSelectedEvento(evento);
    setShowReprovarModal(true);
  };

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("pt-BR");
    } catch {
      return dateStr;
    }
  };

  const formatTime = (timeStr: string) => {
    if (!timeStr) return "";
    try {
      const [hours, minutes] = timeStr.split(":");
      return `${hours}:${minutes}`;
    } catch {
      return timeStr;
    }
  };

  const renderEvento = ({ item }: { item: EventoAdminDTO }) => (
    <View style={styles.card}>
      <TouchableOpacity onPress={()=> router.push({
                  pathname: "/detalhes-evento" as never,
                  params: {
                    id: item.id,
                  },
                })} >
        <View style={styles.cardHeader}>
          <Text style={styles.eventoName}>{item.nome}</Text>
          <StatusBadge status={item.status} />
        </View>
        <Text style={styles.eventoInfo}>{item.descricao}</Text>
        <View style={styles.eventoDetails}>
          <View style={styles.detailRow}>
            <Ionicons name="calendar-outline" size={16} color={colors.textMuted} />
            <Text style={styles.detailText}>{formatDate(item.data)}</Text>
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="time-outline" size={16} color={colors.textMuted} />
            <Text style={styles.detailText}>
              {formatTime(item.hrInicio)} - {formatTime(item.hrFim)}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="location-outline" size={16} color={colors.textMuted} />
            <Text style={styles.detailText}>{item.cidade}</Text>
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="person-outline" size={16} color={colors.textMuted} />
            <Text style={styles.detailText}>Organizador: {item.nmorganizador}</Text>
          </View>
        </View>
      </TouchableOpacity>
      <View style={styles.cardActions}>
        {item.status != "APROVADO" && (
        <TouchableOpacity
          style={[styles.actionButton, styles.aprovarButton]}
          onPress={() => handleAprovar(item.id)}
          disabled={isProcessing}
        >
          <Ionicons name="checkmark-circle" size={20} color="#fff" />
          <Text style={styles.actionButtonText}>Aprovar</Text>
        </TouchableOpacity>
        )}
        {item.status != "REPROVADO" && (
        <TouchableOpacity
          style={[styles.actionButton, styles.reprovarButton]}
          onPress={() => openReprovarModal(item)}
          disabled={isProcessing}
        >
          <Ionicons name="close-circle" size={20} color="#fff" />
          <Text style={styles.actionButtonText}>Reprovar</Text>
        </TouchableOpacity>
        )}
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.screen}>
        <AppHeader title="Gerenciar Eventos" onBackPress={() => router.back()} />
        <FlatList
          data={Array.from({ length: 4 }).map((_, i) => i)}
          keyExtractor={(i) => `sk-${i}`}
          renderItem={() => <Skeleton.AdminEventoCard />}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={styles.screen}>
      <AppHeader title="Gerenciar Eventos" onBackPress={() => router.back()} />
      <FlatList
        data={eventos}
        renderItem={renderEvento}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        refreshing={refreshing}
        onRefresh={onRefresh} 
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="calendar-outline" size={64} color={colors.textMuted} />
            <Text style={styles.emptyText}>Nenhum evento pendente</Text>
          </View>
        }
      />

      <AppModal
        visible={showReprovarModal}
        onClose={() => {
          setShowReprovarModal(false);
          setMotivo("");
          setSelectedEvento(null);
        }}
        title="Reprovar Evento"
        message="Informe o motivo da reprovação:"
        footer={
          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => {
                setShowReprovarModal(false);
                setMotivo("");
                setSelectedEvento(null);
              }}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.confirmReprovarButton}
              onPress={handleReprovar}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.confirmButtonText}>Reprovar</Text>
              )}
            </TouchableOpacity>
          </View>
        }
      >
        <View style={styles.inputContainer}>
          <Text style={styles.textAreaLabel}>Motivo:</Text>
          <View style={styles.textAreaContainer}>
            <TextInput
              style={styles.textArea}
              multiline
              numberOfLines={4}
              placeholder="Descreva o motivo da reprovação..."
              placeholderTextColor={colors.textMuted}
              value={motivo}
              onChangeText={setMotivo}
            />
          </View>
        </View>
      </AppModal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.surface,
    paddingTop: 50,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  list: {
    padding: 16,
  },
  card: {
    backgroundColor: colors.surfaceLowest,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#ECECEC",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  eventoName: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.text,
    flex: 1,
  },
  statusBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  eventoInfo: {
    fontSize: 14,
    color: colors.textMuted,
    marginBottom: 12,
  },
  eventoDetails: {
    gap: 6,
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  detailText: {
    fontSize: 14,
    color: colors.text,
  },
  cardActions: {
    flexDirection: "row",
    gap: 8,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 4,
    flex: 1,
    justifyContent: "center",
  },
  aprovarButton: {
    backgroundColor: colors.primary,
  },
  reprovarButton: {
    backgroundColor: "#A31A14",
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  emptyContainer: {
    alignItems: "center",
    marginTop: 60,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textMuted,
    marginTop: 12,
  },
  modalFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ECECEC",
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
  },
  confirmReprovarButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: "#A31A14",
    alignItems: "center",
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  inputContainer: {
    marginTop: 8,
  },
  textAreaLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 8,
  },
  textAreaContainer: {
    borderWidth: 1,
    borderColor: "#ECECEC",
    borderRadius: 12,
    backgroundColor: colors.surface,
    minHeight: 100,
  },
  textArea: {
    padding: 12,
    fontSize: 16,
    color: colors.text,
    minHeight: 100,
    textAlignVertical: "top",
  },
});