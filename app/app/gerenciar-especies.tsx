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
import adminService, { type EspecieAdminDTO } from "@/services/adminService";
import { useFocusEffect } from "@react-navigation/native";

export default function GerenciarEspeciesScreen() {
  const router = useRouter();
  const { alert, confirm, alertComponent } = useAlert();
  const [especies, setEspecies] = useState<EspecieAdminDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [nome, setNome] = useState("");

  const loadEspecies = useCallback(async () => {
    try {
      const data = await adminService.listarEspecies();
      setEspecies(data);
    } catch (error) {
      console.error("Erro ao carregar espécies:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadEspecies();
    }, [loadEspecies])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadEspecies();
    setRefreshing(false);
  }, [loadEspecies]);

  const openCreateModal = () => {
    setEditingId(null);
    setNome("");
    setShowModal(true);
  };

  const openEditModal = (item: EspecieAdminDTO) => {
    setEditingId(item.id);
    setNome(item.nome);
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!nome.trim()) {
      await alert("Erro", "O nome da espécie é obrigatório.");
      return;
    }
    setIsProcessing(true);
    try {
      if (editingId) {
        await adminService.atualizarEspecie(editingId, { nome: nome.trim() });
      } else {
        await adminService.criarEspecie({ nome: nome.trim() });
      }
      setShowModal(false);
      setNome("");
      setEditingId(null);
      await loadEspecies();
    } catch (error: any) {
      const msg = error?.response?.data?.message || "Erro ao salvar espécie.";
      await alert("Erro", msg);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = async (item: EspecieAdminDTO) => {
    const ok = await confirm("Excluir Espécie", `Tem certeza que deseja excluir "${item.nome}"?`);
    if (!ok) return;
    try {
      await adminService.excluirEspecie(item.id);
      loadEspecies();
    } catch (error: any) {
      const msg = error?.response?.data?.message || "Erro ao excluir espécie.";
      await alert("Erro", msg);
    }
  };

  const renderItem = ({ item }: { item: EspecieAdminDTO }) => (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <Text style={styles.itemNome}>{item.nome}</Text>
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
        <AppHeader title="Gerenciar Espécies" onBackPress={() => router.back()} />
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
      <AppHeader title="Gerenciar Espécies" onBackPress={() => router.back()} />

      <FlatList
        data={especies}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        refreshing={refreshing}
        onRefresh={onRefresh}
        ListHeaderComponent={
          <TouchableOpacity style={styles.addButton} onPress={openCreateModal}>
            <Ionicons name="add-circle-outline" size={22} color={colors.primary} />
            <Text style={styles.addButtonText}>Nova espécie</Text>
          </TouchableOpacity>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="leaf-outline" size={64} color={colors.textMuted} />
            <Text style={styles.emptyText}>Nenhuma espécie cadastrada</Text>
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
        title={editingId ? "Editar Espécie" : "Nova Espécie"}
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
          <Text style={styles.inputLabel}>Nome da Espécie</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Ex: Cão, Gato"
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
    paddingTop: 80,
  },
  list: {
    padding: 16,
    paddingTop: 4,
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
    userSelect: "none",
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
