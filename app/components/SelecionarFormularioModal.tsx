import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import AppModal from "./AppModal";
import CardFormulario from "./CardFormulario";
import { Formulario } from "@/types/Formulario";
import { getFormularios } from "@/services/formularioService";

type SelecionarFormularioModalProps = {
  visible: boolean;
  onClose: () => void;
  onFormularioSelecionado: (formulario: Formulario | null) => void;
};

export default function SelecionarFormularioModal({
  visible,
  onClose,
  onFormularioSelecionado,
}: SelecionarFormularioModalProps) {
  const [formularios, setFormularios] = useState<Formulario[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!visible) return;

    let isActive = true;
    setIsLoading(true);
    setError(null);

    getFormularios()
      .then((data) => {
        if (!isActive) return;
        setFormularios(data);
      })
      .catch(() => {
        if (!isActive) return;
        setError("Nao foi possivel carregar os formularios.");
        setFormularios([]);
      })
      .finally(() => {
        if (!isActive) return;
        setIsLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, [visible]);

  return (
   <AppModal
        visible={visible}
        onClose={onClose}
        title="Selecione um formulário"
        message="Selecione um formulário para ser respondido por quem vai adotar o seu pet."
        footer={
          <View style={styles.buttonStack}>
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => {
                onFormularioSelecionado(null);
                onClose();
              }}
            >
              <Text style={styles.secondaryButtonText}>Continuar sem formulario</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.primaryButton} onPress={onClose}>
              <Text style={styles.primaryButtonText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        }
        children={
        <ScrollView>
            {isLoading && <Text style={styles.feedbackText}>Carregando formularios...</Text>}
            {!isLoading && error && <Text style={styles.feedbackText}>{error}</Text>}
            {!isLoading && !error && formularios.length === 0 && (
              <Text style={styles.feedbackText}>Nenhum formulario encontrado.</Text>
            )}
            {!isLoading && !error && formularios.map((formulario: Formulario) => (
                <CardFormulario
                    key={formulario.id}
                    item={formulario}
                    index={formulario.id}
                    selectable={true}
                    onVicularAnuncio={(selected) => {
                      onFormularioSelecionado(selected);
                      onClose();
                    }}
                />
            ))}
        </ScrollView>
        }
    />
  );
}

const styles = StyleSheet.create({
  buttonStack: {
    gap: 10,
  },
  feedbackText: {
    color: "#666",
    fontSize: 14,
    textAlign: "center",
    marginVertical: 8,
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
