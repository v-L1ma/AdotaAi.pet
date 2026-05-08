import React, { useEffect, useMemo, useState } from "react";
import { Alert, Image, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import AppModal from "./AppModal";
import { Formulario } from "@/types/Formulario";
import { getApiErrorMessage } from "@/services/apiErrorService";
import { colors } from "@/styles/variables";
import { getUserPets, linkFormToPet, type PetUpsertData } from "@/services/petService";
import type { animal } from "@/types/TAnimal";

type SelecionarPetModalProps = {
  visible: boolean;
  onClose: () => void;
  formulario: Formulario | null;
};

type PetApi = animal & {
  formularioId?: string | null;
};

function normalizeDate(value: string): string {
  if (!value) return value;
  return value.slice(0, 10);
}

export default function SelecionarPetModal({ visible, onClose, formulario }: SelecionarPetModalProps) {
  const [pets, setPets] = useState<PetApi[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savingPetId, setSavingPetId] = useState<string | null>(null);

  const headerMessage = useMemo(() => {
    if (!formulario) {
      return "Selecione um formulario antes de vincular a um pet.";
    }

    return `Vincule o formulario "${formulario.titulo}" ao pet desejado.`;
  }, [formulario]);

  useEffect(() => {
    if (!visible) return;

    let isActive = true;
    setIsLoading(true);
    setError(null);

    getUserPets()
      .then((data) => {
        if (!isActive) return;
        setPets(data);
      })
      .catch((err) => {
        if (!isActive) return;
        setError(getApiErrorMessage(err, "Nao foi possivel carregar seus pets."));
        setPets([]);
      })
      .finally(() => {
        if (!isActive) return;
        setIsLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, [visible]);

  const handleUpdate = async (pet: PetApi, formularioId: string | null) => {
    if (!formulario) {
      setError("Selecione um formulario antes de vincular.");
      return;
    }

    setSavingPetId(pet.id);
    setError(null);

    try {
      const payload: PetUpsertData = {
        nome: pet.nome,
        descricao: pet.descricao,
        dtNasc: normalizeDate(pet.dt_nasc),
        porte: pet.porte,
        formularioId,
      };

      await linkFormToPet(pet.id, payload);

      setPets((prev) =>
        prev.map((item) =>
          item.id === pet.id
            ? {
                ...item,
                formularioId,
              }
            : item
        )
      );

      onClose();
    } catch (err) {
      setError(getApiErrorMessage(err, "Nao foi possivel atualizar o pet."));
    } finally {
      setSavingPetId(null);
    }
  };

  const confirmVinculo = (pet: PetApi) => {
    if (!formulario) {
      setError("Selecione um formulario antes de vincular.");
      return;
    }

    if(Platform.OS==="web"){
      handleUpdate(pet, formulario.id)
      return
    }
    
    Alert.alert(
      "Confirmar vinculo",
      `Vincular o formulario "${formulario.titulo}" ao pet "${pet.nome}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Vincular", onPress: () => handleUpdate(pet, formulario.id) },
      ]
    );
  };

  const confirmDesvinculo = (pet: PetApi) => {
    if(Platform.OS==="web"){
      handleUpdate(pet, null) 
    }

    Alert.alert(
      "Remover formulario",
      `Remover o formulario vinculado ao pet "${pet.nome}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Remover", onPress: () => handleUpdate(pet, null) },
      ]
    );
  };

  return (
    <AppModal
      visible={visible}
      onClose={onClose}
      title="Selecione um pet"
      message={headerMessage}
      footer={
        <View style={styles.buttonStack}>
          <TouchableOpacity style={styles.primaryButton} onPress={onClose}>
            <Text style={styles.primaryButtonText}>Fechar</Text>
          </TouchableOpacity>
        </View>
      }
    >
      <ScrollView>
        {isLoading && <Text style={styles.feedbackText}>Carregando pets...</Text>}
        {!isLoading && error && <Text style={styles.feedbackText}>{error}</Text>}
        {!isLoading && !error && pets.length === 0 && (
          <Text style={styles.feedbackText}>Nenhum pet encontrado.</Text>
        )}
        {!isLoading &&
          !error &&
          pets.map((pet) => {
            const isSaving = savingPetId === pet.id;
            const hasFormulario = Boolean(pet.formularioId);

            return (
              <View key={pet.id} style={styles.petCard}>
                <Image source={{ uri: pet.link_foto }} style={styles.petImage} />
                <View style={styles.petInfo}>
                  <Text style={styles.petName}>{pet.nome}</Text>
                  <Text style={styles.petMeta}>
                    {pet.especie} • {pet.porte}
                  </Text>
                  <Text style={styles.petFormStatus}>
                    {hasFormulario ? "Formulario vinculado" : "Sem formulario"}
                  </Text>
                </View>
                <View style={styles.petActions}>
                  {!hasFormulario && (
                    <TouchableOpacity
                      style={[styles.actionButton, styles.primaryAction]}
                      onPress={() => confirmVinculo(pet)}
                      disabled={isSaving || !formulario}
                    >
                      <Text style={styles.actionButtonText}>
                        {isSaving ? "Salvando..." : "Vincular"}
                      </Text>
                    </TouchableOpacity>
                  )
                  }
                  {hasFormulario && (
                    <TouchableOpacity
                      style={[styles.actionButton, styles.secondaryAction]}
                      onPress={() => confirmDesvinculo(pet)}
                      disabled={isSaving}
                    >
                      <Text style={styles.secondaryActionText}>Desvincular</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            );
          })}
      </ScrollView>
    </AppModal>
  );
}

const styles = StyleSheet.create({
  buttonStack: {
    gap: 10,
  },
  feedbackText: {
    color: colors.textMuted,
    fontSize: 14,
    textAlign: "center",
    marginVertical: 8,
  },
  primaryButton: {
    marginTop: 6,
    minHeight: 48,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 14,
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "800",
  },
  petCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    backgroundColor: "#fff",
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#ECECEC",
    shadowColor: "#191C1D",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 10,
    elevation: 2,
    gap: 12,
  },
  petImage: {
    width: 64,
    height: 64,
    borderRadius: 14,
    backgroundColor: "#F2F2F2",
  },
  petInfo: {
    flex: 1,
    gap: 4,
  },
  petName: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.text,
  },
  petMeta: {
    fontSize: 13,
    color: colors.textMuted,
  },
  petFormStatus: {
    fontSize: 12,
    color: colors.textMuted,
  },
  petActions: {
    gap: 8,
  },
  actionButton: {
    minHeight: 34,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  primaryAction: {
    backgroundColor: colors.primary,
  },
  secondaryAction: {
    backgroundColor: "#F3F3F3",
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
  },
  secondaryActionText: {
    color: colors.text,
    fontSize: 12,
    fontWeight: "700",
  },
});
