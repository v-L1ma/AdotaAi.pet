import AppHeader from "@/components/AppHeader";
import { colors } from "@/styles/variables";
import { useLocalSearchParams } from "expo-router";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";

export default function DetalhesEvento() {
  const params = useLocalSearchParams<{
    titulo?: string;
    data?: string;
    local?: string;
    tipo?: string;
  }>();

  return (
    <View style={styles.screen}>
      <AppHeader title="Detalhes do Evento" titleFontSize={20} />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.heroWrap}>
          <Image source={{ uri: "https://images.unsplash.com/photo-1517849845537-4d257902454a?w=1400" }} style={styles.heroImage} />
          <View style={styles.heroOverlay} />
        </View>

        <View style={styles.coverCard}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{params.tipo || "Adoção & Bem-estar"}</Text>
          </View>

          <Text style={styles.title}>{params.titulo || "Mega Festival Adotaí"}</Text>

          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Data</Text>
              <Text style={styles.infoValue}>{params.data || "Sexta, 15 Mar"}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Horário</Text>
              <Text style={styles.infoValue}>09:00 — 18:00</Text>
            </View>
            <View style={[styles.infoItem, styles.infoFull]}>
              <Text style={styles.infoLabel}>Localização</Text>
              <Text style={styles.infoValue}>{params.local || "São Paulo Convention Center"}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sobre o evento</Text>
          <Text style={styles.sectionText}>
            Participe desta ação para apoiar a adoção responsável. O evento reúne protetores, voluntários e pessoas
            interessadas em adotar com consciência.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informações importantes</Text>
          <Text style={styles.sectionText}>• Leve documento com foto</Text>
          <Text style={styles.sectionText}>• Chegue com 15 minutos de antecedência</Text>
          <Text style={styles.sectionText}>• Haverá equipe para tirar dúvidas sobre adoção</Text>
        </View>

        <View style={styles.mapSection}>
          <Text style={styles.sectionTitle}>Localização</Text>
          <Image source={{ uri: "https://images.unsplash.com/photo-1524661135-423995f22d0b?w=1400" }} style={styles.mapImage} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  content: {
    paddingTop: 112,
    paddingBottom: 28,
    gap: 12,
  },
  heroWrap: {
    width: "100%",
    height: 200,
    position: "relative",
  },
  heroImage: {
    width: "100%",
    height: "100%",
  },
  heroOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: "rgba(25, 28, 29, 0.28)",
  },
  coverCard: {
    marginHorizontal: 14,
    marginTop: -32,
    backgroundColor: colors.surfaceLowest,
    borderRadius: 16,
    padding: 12,
    shadowColor: "#191C1D",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 2,
    gap: 8,
  },
  badge: {
    alignSelf: "flex-start",
    backgroundColor: "#FFE5E3",
    borderRadius: 99,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeText: {
    color: colors.primary,
    fontWeight: "700",
    fontSize: 11,
  },
  title: {
    fontSize: 30,
    lineHeight: 30,
    fontWeight: "800",
    color: colors.text,
  },
  infoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  infoItem: {
    width: "48%",
    backgroundColor: colors.surfaceLow,
    borderRadius: 12,
    padding: 9,
    gap: 2,
  },
  infoFull: {
    width: "100%",
  },
  infoLabel: {
    fontSize: 10,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    color: colors.textMuted,
  },
  infoValue: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.text,
  },
  section: {
    marginHorizontal: 14,
    borderRadius: 12,
    backgroundColor: colors.surfaceLowest,
    padding: 12,
    gap: 6,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.text,
  },
  sectionText: {
    fontSize: 13,
    color: colors.textMuted,
    lineHeight: 18,
  },
  mapSection: {
    marginHorizontal: 14,
    gap: 8,
  },
  mapImage: {
    width: "100%",
    height: 150,
    borderRadius: 14,
  },
});
