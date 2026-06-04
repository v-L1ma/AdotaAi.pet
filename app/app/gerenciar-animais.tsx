import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
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
import { colors } from "@/styles/variables";
import adminService, { type PetAdminDTO } from "@/services/adminService";
import StatusBadge from "@/components/StatusBadgeFactory";
import { useFocusEffect } from "@react-navigation/native";
// import placeholderPet from "@/assets/images/pets.png";

export default function GerenciarAnimaisScreen() {
  const router = useRouter();
  const [pets, setPets] = useState<PetAdminDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPet, setSelectedPet] = useState<PetAdminDTO | null>(null);
  const [showReprovarModal, setShowReprovarModal] = useState(false);
  const [motivo, setMotivo] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const loadPets = useCallback(async () => {
    try {
      const data = await adminService.listarPetsPendentes();
      setPets(data);
    } catch (error) {
      console.error("Erro ao carregar pets pendentes:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadPets();
    }, [loadPets])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadPets();
    setRefreshing(false);
  }, [loadPets]);

  const handleAprovar = async (petId: string) => {
    setIsProcessing(true);
    try {
      await adminService.aprovarPet(petId);
      loadPets();
    } catch (error) {
      console.error("Erro ao aprovar pet:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReprovar = async () => {
    if (!selectedPet) return;
    setIsProcessing(true);
    try {
      await adminService.reprovarPet(selectedPet.id, motivo);
      setShowReprovarModal(false);
      setMotivo("");
      setSelectedPet(null);
      loadPets();
    } catch (error) {
      console.error("Erro ao reprovar pet:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const openReprovarModal = (pet: PetAdminDTO) => {
    setSelectedPet(pet);
    setShowReprovarModal(true);
  };

  const renderPet = ({ item }: { item: PetAdminDTO }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.7}
      onPress={() => router.push(`/perfil-pet?id=${item.id}`)}
    >
      <Image
        source={item.link_foto ? { uri: item.link_foto } : { uri: "assets/images/pets.png" }}
        style={styles.petImage}
      />
      <View style={styles.cardContent}>
        <Text style={styles.petName}>{item.nome}</Text>
        <Text style={styles.petInfo}>
          {item.especie} • {item.raca} • {item.porte}
        </Text>
        <StatusBadge status={item.status} />
        <View style={styles.cardActions}>
          {item.status.toLocaleUpperCase() !== "APROVADO" && (
            <TouchableOpacity
              style={[styles.actionButton, styles.aprovarButton]}
              onPress={() => handleAprovar(item.id)}
              disabled={isProcessing}
            >
              <Ionicons name="checkmark-circle" size={20} color="#fff" />
              <Text style={styles.actionButtonText}>Aprovar</Text>
            </TouchableOpacity>
          )}
          {item.status.toLocaleUpperCase() !== "REPROVADO" && (
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
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.screen}>
        <AppHeader title="Gerenciar Animais" onBackPress={() => router.back()} />
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
      <AppHeader title="Gerenciar Animais" onBackPress={() => router.back()} />
      <FlatList
        data={pets}
        renderItem={renderPet}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        refreshing={refreshing}
        onRefresh={onRefresh}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="paw" size={64} color={colors.textMuted} />
            <Text style={styles.emptyText}>Nenhum animal pendente</Text>
          </View>
        }
      />

      <AppModal
        visible={showReprovarModal}
        onClose={() => {
          setShowReprovarModal(false);
          setMotivo("");
          setSelectedPet(null);
        }}
        title="Reprovar Animal"
        message="Informe o motivo da reprovação:"
        footer={
          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => {
                setShowReprovarModal(false);
                setMotivo("");
                setSelectedPet(null);
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
    paddingTop: 100,
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
    flexDirection: "row",
    backgroundColor: colors.surfaceLowest,
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#ECECEC",
  },
  petImage: {
    width: 90,
    height: "100%",
    borderRadius: 12,
    backgroundColor: colors.surface,
  },
  cardContent: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "center",
  },
  petName: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.text,
  },
  petInfo: {
    fontSize: 14,
    color: colors.textMuted,
    marginTop: 2,
    marginBottom: 4,
  },
  petStatus: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: "600",
    marginTop: 4,
  },
  cardActions: {
    flexDirection: "row",
    marginTop: 8,
    gap: 8,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 4,
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