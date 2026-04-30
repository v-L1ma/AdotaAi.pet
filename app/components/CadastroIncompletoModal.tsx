import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import AppModal from "./AppModal";

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
    <AppModal
      visible={visible}
      onClose={onClose}
      title="Cadastro incompleto"
      message="Seu perfil ainda nao esta completo. Finalize seu cadastro para continuar usando todos os recursos."
      footer={
        <View style={styles.buttonStack}>
          <TouchableOpacity style={styles.primaryButton} onPress={onConcluirCadastro}>
            <Text style={styles.primaryButtonText}>Concluir cadastro</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryButton} onPress={onClose}>
            <Text style={styles.secondaryButtonText}>Lembrar mais tarde</Text>
          </TouchableOpacity>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  buttonStack: {
    gap: 10,
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
