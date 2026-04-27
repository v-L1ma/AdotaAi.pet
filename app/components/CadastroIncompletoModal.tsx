import React from "react";
import { Modal, Pressable, StyleSheet, Text, TouchableOpacity } from "react-native";

type CadastroIncompletoModalProps = {
  visible: boolean;
  onClose: () => void;
  onConcluirCadastro: () => void;
};

export default function CadastroIncompletoModal({
  visible,
  onClose,
  onConcluirCadastro,
}: CadastroIncompletoModalProps) {
  return (
    <Modal transparent animationType="fade" visible={visible} onRequestClose={onClose}>
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        <Pressable style={styles.modalCard} onPress={() => {}}>
          <Text style={styles.modalTitle}>Cadastro incompleto</Text>
          <Text style={styles.modalMessage}>
            Seu perfil ainda não está completo. Finalize seu cadastro para continuar usando todos os recursos.
          </Text>

          <TouchableOpacity style={styles.primaryButton} onPress={onConcluirCadastro}>
            <Text style={styles.primaryButtonText}>Concluir cadastro</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryButton} onPress={onClose}>
            <Text style={styles.secondaryButtonText}>Lembrar mais tarde</Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  modalCard: {
    width: "100%",
    maxWidth: 420,
    borderRadius: 18,
    backgroundColor: "#fff",
    padding: 20,
    borderWidth: 1,
    borderColor: "#ECECEC",
    gap: 12,
  },
  modalTitle: {
    fontSize: 21,
    fontWeight: "800",
    color: "#1B1B1B",
  },
  modalMessage: {
    fontSize: 15,
    lineHeight: 22,
    color: "#4D4D4D",
  },
  primaryButton: {
    marginTop: 6,
    minHeight: 48,
    borderRadius: 12,
    backgroundColor: "#D94B44",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 14,
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "800",
  },
  secondaryButton: {
    minHeight: 44,
    borderRadius: 12,
    backgroundColor: "#F3F3F3",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 14,
  },
  secondaryButtonText: {
    color: "#4B4B4B",
    fontSize: 15,
    fontWeight: "700",
  },
});
