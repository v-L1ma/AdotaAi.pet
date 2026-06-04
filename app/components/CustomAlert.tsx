import React, { useState } from "react";
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import AppModal from "./AppModal";
import { colors } from "@/styles/variables";

type AlertType = "alert" | "confirm";

type AlertConfig = {
  type: AlertType;
  title: string;
  message?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
};

export function useAlert() {
  const [config, setConfig] = useState<AlertConfig | null>(null);
  const [loading, setLoading] = useState(false);

  const alert = (title: string, message?: string) => {
    return new Promise<void>((resolve) => {
      setConfig({ type: "alert", title, message, onConfirm: resolve });
    });
  };

  const confirm = (title: string, message: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setConfig({
        type: "confirm",
        title,
        message,
        onConfirm: () => resolve(true),
        onCancel: () => resolve(false),
      });
    });
  };

  const close = () => {
    setConfig(null);
    setLoading(false);
  };

  const handleConfirm = async () => {
    const cb = config?.onConfirm;
    if (!cb) {
      close();
      return;
    }
    setLoading(true);
    await cb();
    close();
  };

  const alertComponent = config ? (
    <AppModal
      visible
      onClose={() => {
        config.onCancel?.();
        close();
      }}
      title={config.title}
      message={config.message}
      footer={
        <View style={styles.footer}>
          {config.type === "confirm" && (
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => {
                config.onCancel?.();
                close();
              }}
            >
              <Text style={styles.cancelButtonText}>{config.cancelText || "Cancelar"}</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={[styles.confirmButton, config.type === "alert" && styles.confirmButtonFull]}
            onPress={handleConfirm}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.confirmButtonText}>{config.confirmText || (config.type === "alert" ? "OK" : "Confirmar")}</Text>
            )}
          </TouchableOpacity>
        </View>
      }
    />
  ) : null;

  return { alert, confirm, alertComponent };
}

const styles = StyleSheet.create({
  footer: {
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
  confirmButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: "center",
  },
  confirmButtonFull: {
    flex: 0,
    minWidth: 100,
    alignSelf: "flex-end",
    paddingHorizontal: 24,
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
    userSelect: "none",
  },
});
