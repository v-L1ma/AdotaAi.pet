import AppHeader from "@/components/AppHeader";
import { colors } from "@/styles/variables";
import { useRouter } from "expo-router";
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const eventos = [
  {
    id: 1,
    titulo: "Feira de Adoção - Santos",
    data: "26 Mar · 10:00",
    local: "Praça Mauá",
    tipo: "Adoção",
  },
  {
    id: 2,
    titulo: "Mutirão de Vacinação",
    data: "29 Mar · 09:00",
    local: "ONG Patas Unidas",
    tipo: "Saúde",
  },
  {
    id: 3,
    titulo: "Bazar Solidário Pet",
    data: "02 Abr · 14:00",
    local: "Centro Comunitário",
    tipo: "Beneficente",
  },
];

export default function InicioEventos() {
  const router = useRouter();

  return (
    <View style={styles.screen}>
      <AppHeader title="Eventos" titleFontSize={20} />

      <FlatList
        data={eventos}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={<Hero />}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              router.push({
                pathname: "/detalhes-evento" as never,
                params: {
                  titulo: item.titulo,
                  data: item.data,
                  local: item.local,
                  tipo: item.tipo,
                },
              })
            }
          >
            <Image
              source={{ uri: item.id % 2 === 0 ? "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=1200" : "https://images.unsplash.com/photo-1517849845537-4d257902454a?w=1200" }}
              style={styles.cardImage}
            />

            <View style={styles.cardBody}>
              <View style={styles.tag}>
                <Text style={styles.tagText}>{item.tipo}</Text>
              </View>
              <Text style={styles.title}>{item.titulo}</Text>
              <Text style={styles.meta}>{item.data}</Text>
              <Text style={styles.meta}>{item.local}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

function Hero() {
  return (
    <View style={styles.hero}>
      <Text style={styles.heroTitle}>Participe de eventos de adoção e bem-estar animal</Text>
      <Text style={styles.heroSubtitle}>Encontros, campanhas e ações para conectar famílias e pets.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F8F8F8",
  },
  list: {
    paddingTop: 110,
    paddingHorizontal: 14,
    paddingBottom: 32,
    gap: 12,
  },
  hero: {
    marginBottom: 4,
    alignItems: "center",
  },
  heroTitle: {
    color: colors.text,
    fontSize: 19,
    lineHeight: 25,
    fontWeight: "800",
    marginTop: 4,
    textAlign: "center",
  },
  heroSubtitle: {
    marginTop: 4,
    color: colors.textMuted,
    fontSize: 12,
    lineHeight: 17,
    textAlign: "center",
  },
  card: {
    backgroundColor: colors.surfaceLowest,
    borderRadius: 14,
    overflow: "hidden",
    shadowColor: "#191C1D",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 2,
  },
  cardImage: {
    width: "100%",
    height: 120,
  },
  cardBody: {
    paddingHorizontal: 12,
    paddingVertical: 9,
    gap: 4,
  },
  tag: {
    alignSelf: "flex-start",
    backgroundColor: "#FFE0DE",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 99,
  },
  tagText: {
    color: colors.primary,
    fontWeight: "700",
    fontSize: 11,
  },
  title: {
    fontSize: 18,
    lineHeight: 22,
    fontWeight: "800",
    color: colors.text,
  },
  meta: {
    fontSize: 12,
    lineHeight: 16,
    color: colors.textMuted,
  },
});
