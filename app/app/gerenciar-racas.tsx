import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AppHeader from "@/components/AppHeader";
import AppModal from "@/components/AppModal";
import Skeleton from "@/components/Skeleton";
import { useAlert } from "@/components/CustomAlert";
import { colors } from "@/styles/variables";
import adminService, { type EspecieAdminDTO, type RacaAdminDTO } from "@/services/adminService";
import { useFocusEffect } from "@react-navigation/native";

export default function GerenciarRacasScreen() {
  const router = useRouter();
  const { alert, confirm, alertComponent } = useAlert();
  const [tab, setTab] = useState<Tab>("caes");

  const [racas, setRacas] = useState<RacaAdminDTO[]>([]);
  const [especies, setEspecies] = useState<EspecieAdminDTO[]>([]);
  const [especiePorNome, setEspeciePorNome] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [nome, setNome] = useState("");

  const loadData = useCallback(async () => {
    try {
      const [racasData, especiesData] = await Promise.all([
        adminService.listarRacas(),
        adminService.listarEspecies(),
      ]);
      setRacas(racasData);
      setEspecies(especiesData);
      const mapa: Record<string, string> = {};
      especiesData.forEach((e) => {
        const chave = e.nome.toLowerCase();
        mapa[chave] = e.id;
      });
      setEspeciePorNome(mapa);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }, [loadData]);

  const especieIdAtual = tab === "caes" ? especiePorNome["cão"] ?? especiePorNome["cao"] : especiePorNome["gato"];

  const racasFiltradas = especieIdAtual
    ? racas.filter((r) => r.especieId === especieIdAtual)
    : racas;

  const openCreateModal = () => {
    setEditingId(null);
    setNome("");
    setShowModal(true);
  };

  const openEditModal = (item: RacaAdminDTO) => {
    setEditingId(item.id);
    setNome(item.nome);
    setShowModal(true);
  };

  const getEspecieNome = (especieId: string) => {
    return especies.find((e) => e.id === especieId)?.nome || "Desconhecida";
  };

  const handleSave = async () => {
    if (!nome.trim()) {
      await alert("Erro", "O nome da raça é obrigatório.");
      return;
    }
    if (!especieIdAtual) {
      await alert("Erro", "Nenhuma espécie encontrada para esta aba.");
      return;
    }
    setIsProcessing(true);
    try {
      if (editingId) {
        await adminService.atualizarRaca(editingId, {
          nome: nome.trim(),
          especieId: especieIdAtual,
        });
      } else {
        await adminService.criarRaca({
          nome: nome.trim(),
          especieId: especieIdAtual,
        });
      }
      setShowModal(false);
      setNome("");
      setEditingId(null);
      await loadData();
    } catch (error: any) {
      const msg = error?.response?.data?.message || "Erro ao salvar raça.";
      await alert("Erro", msg);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = async (item: RacaAdminDTO) => {
    const ok = await confirm("Excluir Raça", `Tem certeza que deseja excluir "${item.nome}"?`);
    if (!ok) return;
    try {
      await adminService.excluirRaca(item.id);
      await loadData();
    } catch (error: any) {
      const msg = error?.response?.data?.message || "Erro ao excluir raça.";
      await alert("Erro", msg);
    }
  };

  const renderItem = ({ item }: { item: RacaAdminDTO }) => (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <Text style={styles.itemNome}>{item.nome}</Text>
        <Text style={styles.itemEspecie}>{getEspecieNome(item.especieId)}</Text>
      </View>
      <View style={styles.cardActions}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => openEditModal(item)}
        >
          <Ionicons name="pencil" size={20} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDelete(item)}
        >
          <Ionicons name="trash-outline" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.screen}>
        <AppHeader title="Gerenciar Raças" onBackPress={() => router.back()} />
        <FlatList
          data={Array.from({ length: 5 }).map((_, i) => i)}
          keyExtractor={(i) => `sk-${i}`}
          renderItem={() => <Skeleton.AdminPetCard />}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      <AppHeader title="Gerenciar Raças" onBackPress={() => router.back()} />

      <FlatList
        data={racasFiltradas}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        refreshing={refreshing}
        onRefresh={onRefresh}
        ListHeaderComponent={
          <View style={{ marginBottom: 12, display: "flex", flexDirection: "column", justifyContent: "space-between", alignItems: "center", width: "100%", gap: 12}}>
            <View style={styles.tabsWrap}>
              <TouchableOpacity
                style={[styles.tab, tab === "caes" && styles.tabActive]}
                onPress={() => setTab("caes")}
              >
                <Text style={[styles.tabText, tab === "caes" && styles.tabTextActive]}>
                  Cachorros
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.tab, tab === "gatos" && styles.tabActive]}
                onPress={() => setTab("gatos")}
              >
                <Text style={[styles.tabText, tab === "gatos" && styles.tabTextActive]}>
                  Gatos
                </Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.addButton} onPress={openCreateModal}>
              <Ionicons name="add-circle-outline" size={22} color={colors.primary} />
              <Text style={styles.addButtonText}>Nova raça</Text>
            </TouchableOpacity>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="git-network-outline" size={64} color={colors.textMuted} />
            <Text style={styles.emptyText}>Nenhuma raça encontrada</Text>
          </View>
        }
      />

      <AppModal
        visible={showModal}
        onClose={() => {
          setShowModal(false);
          setNome("");
          setEditingId(null);
        }}
        title={editingId ? "Editar Raça" : "Nova Raça"}
        footer={
          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => {
                setShowModal(false);
                setNome("");
                setEditingId(null);
              }}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSave}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.saveButtonText}>Salvar</Text>
              )}
            </TouchableOpacity>
          </View>
        }
      >
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Nome da Raça</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Ex: Labrador, Persa"
              placeholderTextColor={colors.textMuted}
              value={nome}
              onChangeText={setNome}
              autoCapitalize="sentences"
            />
          </View>
        </View>
      </AppModal>
      {alertComponent}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.surface,
    paddingTop: 100,
  },
  list: {
    padding: 16,
    paddingTop: 4,
  },
  tabsWrap: {
    marginTop: 16,
    marginHorizontal: 20,
    flexDirection: "row",
    backgroundColor: "#eceff3",
    borderRadius: 14,
    padding: 4,
    gap: 4,
    width: "100%",
  },
  tab: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  tabActive: {
    backgroundColor: "#fff",
  },
  tabText: {
    color: "#777",
    fontWeight: "700",
    fontSize: 14,
    userSelect: "none",
  },
  tabTextActive: {
    color: colors.primary,
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
    width: "100%",
  },
  addButtonText: {
    color: colors.primary,
    fontWeight: "800",
    fontSize: 17,
    userSelect: "none",
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surfaceLowest,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#ECECEC",
  },
  cardContent: {
    flex: 1,
  },
  itemNome: {
    fontSize: 17,
    fontWeight: "700",
    color: colors.text,
  },
  itemEspecie: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 2,
  },
  cardActions: {
    flexDirection: "row",
    gap: 8,
  },
  editButton: {
    backgroundColor: "#4CAF50",
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  deleteButton: {
    backgroundColor: "#A31A14",
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
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
    userSelect: "none",
  },
  saveButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: "center",
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
    userSelect: "none",
  },
  inputContainer: {
    marginTop: 8,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 8,
  },
  inputWrapper: {
    borderWidth: 1,
    borderColor: "#ECECEC",
    borderRadius: 12,
    backgroundColor: colors.surface,
  },
  input: {
    padding: 12,
    fontSize: 16,
    color: colors.text,
  },
});
