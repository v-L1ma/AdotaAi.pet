import React from "react";
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

type AppModalProps = {
  visible: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: number;
  closeOnBackdrop?: boolean;
};

export default function AppModal({
  visible,
  onClose,
  title,
  message,
  children,
  footer,
  maxWidth = 420,
  closeOnBackdrop = true,
}: AppModalProps) {
  return (
    <Modal transparent animationType="fade" visible={visible} onRequestClose={onClose}>
      <Pressable style={styles.modalOverlay} onPress={closeOnBackdrop ? onClose : undefined}>
        <Pressable style={[styles.modalCard, { maxWidth }]} onPress={() => undefined}>
          <View>
            {(title || message) && (
              <View >
                {title ? <Text style={styles.modalTitle}>{title}</Text> : null}
                {message ? <Text style={styles.modalMessage}>{message}</Text> : null}
              </View>
            )}
            {children ? (
              <View >
                <ScrollView style={styles.body}>
                  {children}
                </ScrollView>
              </View>
            ) : null}
            {footer ? <View style={styles.footer}>{footer}</View> : null}
          </View>
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
  body: {
    gap: 12,
    overflowY: "scroll",
  },
  footer: {
    marginTop: 6,
    gap: 10,
  },
});
