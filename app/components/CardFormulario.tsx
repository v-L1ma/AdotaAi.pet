import { colors } from "@/styles/variables";
import { Formulario } from "@/types/Formulario";
import { useRouter } from "expo-router";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
    item: Formulario,
  index: number | string,
    selectable?: boolean,
  onVicularAnuncio?: (formulario: Formulario) => void,
  showEditButton?: boolean
}

export default function CardFormulario({
    item,
    selectable = false,
    onVicularAnuncio,
    showEditButton,
}: Props) {
    const router = useRouter();
    const shouldShowEdit = showEditButton ?? !selectable;

    const handleVincularAnuncio = () => {
        if (onVicularAnuncio) {
            onVicularAnuncio(item);
            return;
        }
        router.push("/criarAnuncio");
    }

    const numericId = Number(String(item.id).replace(/\D/g, ""));
    const isEven = Number.isNaN(numericId) ? String(item.id).length % 2 === 0 : numericId % 2 === 0;

        return(
            <View key={item.id} style={styles.card}>
                <Image
                source={{ uri: isEven ? "https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?w=1200" : "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=1200" }}
                style={styles.cover}
                />

                <View style={styles.headerRow}>
                <Text style={styles.title}>{item.titulo}</Text>
                <View style={[styles.badge, item.status === "Publicado" ? styles.badgePublished : styles.badgeDraft]}>
                    <Text style={styles.badgeText}>{item.status}</Text>
                </View>
                </View>

                <Text style={styles.info}>{item.perguntas} perguntas • atualizado em {item.atualizadoEm}</Text>

                <View style={styles.actions}>
                
                {shouldShowEdit && (
                  <TouchableOpacity style={styles.secondaryButton} onPress={() => router.push(`/criarFormulario?id=${item.id}`)}>
                      <Text style={styles.secondaryText}>Editar</Text>
                  </TouchableOpacity>
                )}

                <TouchableOpacity style={styles.primaryButton} onPress={handleVincularAnuncio}>
                    <Text style={styles.primaryText}>Vincular anúncio</Text>
                </TouchableOpacity>
                </View>
            </View>
        );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surfaceLowest,
    borderRadius: 18,
    overflow: "hidden",
    shadowColor: "#191C1D",
    shadowOpacity: 0.07,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: colors.surfaceHigh,
  },
  cover: {
    width: "100%",
    height: 145,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    alignItems: "center",
    paddingHorizontal: 14,
    paddingTop: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.text,
    flex: 1,
  },
  info: {
    color: colors.textMuted,
    fontSize: 13,
    paddingHorizontal: 14,
    marginTop: 4,
  },
  badge: {
    borderRadius: 99,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgePublished: {
    backgroundColor: "#D9F4DF",
  },
  badgeDraft: {
    backgroundColor: "#FFE8CE",
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.text,
  },
  actions: {
    marginTop: 12,
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 14,
    paddingBottom: 14,
  },
  primaryButton: {
    flex: 1.2,
    backgroundColor: colors.primary,
    borderRadius: 12,
    minHeight: 44,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  secondaryButton: {
    flex: 1,
    borderRadius: 12,
    backgroundColor: colors.secondaryContainer,
    minHeight: 44,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  primaryText: {
    color: "white",
    fontWeight: "700",
    fontSize: 13,
    textAlign: "center",
    width: "100%",
    includeFontPadding: false,
    lineHeight: 16,
  },
  secondaryText: {
    color: colors.text,
    fontWeight: "700",
    fontSize: 13,
    textAlign: "center",
    width: "100%",
    includeFontPadding: false,
    lineHeight: 16,
  },
});
