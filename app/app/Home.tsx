import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors } from "@/styles/variables";
import CardPet from "@/components/CardPet";
import NavBar from "@/components/NavBar";
import { animal } from "@/types/TAnimal";
import React from "react";
import Svg, { Circle, Ellipse } from "react-native-svg";
import { useTabNavigation } from "@/hooks/useTabNavigation";

export default function Home() {
  const router = useRouter();
  const { navigateToTab } = useTabNavigation();

  const pets :animal[] = [
    {
      nome: "Alfredo",
      imagem:
      "https://img.freepik.com/fotos-gratis/fotografia-vertical-de-foco-superficial-de-um-bonito-cachorro-de-golden-retriever-sentado-em-um-chao-de-grama_181624-27259.jpg?w=360",
      genero: "M",
      especie: "cachorro",
      porte: "medio",
  },
  {
      nome: "Luna",
      imagem:
      "https://www.petz.com.br/blog/wp-content/uploads/2019/07/vida-de-gato.jpg",
      genero: "F",
      especie: "gato",
      porte: "pequeno",
  },
  {
      nome: "Thor",
      imagem:
      "https://img.freepik.com/fotos-gratis/fotografia-vertical-de-foco-superficial-de-um-bonito-cachorro-de-golden-retriever-sentado-em-um-chao-de-grama_181624-27259.jpg?w=360",
      genero: "M",
      especie: "cachorro",
      porte: "grande",
  },
  {
      nome: "Mimi",
      imagem:
      "https://www.petz.com.br/blog/wp-content/uploads/2019/07/vida-de-gato.jpg",
      genero: "F",
      especie: "gato",
      porte: "pequeno",
  },
  {
      nome: "Rex",
      imagem:
      "https://img.freepik.com/fotos-gratis/fotografia-vertical-de-foco-superficial-de-um-bonito-cachorro-de-golden-retriever-sentado-em-um-chao-de-grama_181624-27259.jpg?w=360",
      genero: "M",
      especie: "cachorro",
      porte: "medio",
  },
  {
      nome: "Mel",
      imagem:
      "https://img.freepik.com/fotos-gratis/fotografia-vertical-de-foco-superficial-de-um-bonito-cachorro-de-golden-retriever-sentado-em-um-chao-de-grama_181624-27259.jpg?w=360",
      genero: "F",
      especie: "cachorro",
      porte: "pequeno",
  },
  {
      nome: "Simba",
      imagem:
      "https://www.petz.com.br/blog/wp-content/uploads/2019/07/vida-de-gato.jpg",
      genero: "M",
      especie: "gato",
      porte: "medio",
  },
  {
      nome: "Bela",
      imagem:
      "https://img.freepik.com/fotos-gratis/fotografia-vertical-de-foco-superficial-de-um-bonito-cachorro-de-golden-retriever-sentado-em-um-chao-de-grama_181624-27259.jpg?w=360",
      genero: "F",
      especie: "cachorro",
      porte: "grande",
  },
  {
      nome: "Nina",
      imagem:
      "https://www.petz.com.br/blog/wp-content/uploads/2019/07/vida-de-gato.jpg",
      genero: "F",
      especie: "gato",
      porte: "pequeno",
  },
  {
      nome: "Max",
      imagem:
      "https://img.freepik.com/fotos-gratis/fotografia-vertical-de-foco-superficial-de-um-bonito-cachorro-de-golden-retriever-sentado-em-um-chao-de-grama_181624-27259.jpg?w=360",
      genero: "M",
      especie: "cachorro",
      porte: "medio",
  }
  ]
  return (
    <View style={style.screen}>
      <ScrollView contentContainerStyle={style.content} showsVerticalScrollIndicator={false}>
        <View style={style.topBar}>
          <View style={style.titleBlock}>
            <View style={style.titleRow}>
              <Text style={style.title}>Encontre seu novo companheiro!</Text>
              <View style={style.pawWrap}>
                <PawIcon />
              </View>
            </View>
          </View>
        </View>

        <TouchableOpacity style={style.searchButton} onPress={() => navigateToTab("/listagem-pets") }>
          <Ionicons name="search" size={18} color={colors.primary} />
          <Text style={style.searchText} numberOfLines={1} ellipsizeMode="tail">Buscar por raça, idade ou cidade</Text>
        </TouchableOpacity>

        <View style={style.banner}>
          <Text style={style.bannerTitle}>O amigo que você busca está aqui</Text>
          <Text style={style.bannerDescription}>Adoção responsável com triagem, apoio e muito carinho.</Text>
          <TouchableOpacity style={style.bannerButton} onPress={() => navigateToTab("/listagem-pets") }>
            <Text style={style.bannerButtonText}>Ver pets disponíveis</Text>
          </TouchableOpacity>
        </View>

        <View style={style.chipRow}>
          <TouchableOpacity style={[style.chip, style.chipActive]} onPress={() => navigateToTab("/listagem-pets") }>
            <Text style={style.chipActiveText}>Todos</Text>
          </TouchableOpacity>
          <TouchableOpacity style={style.chip} onPress={() => navigateToTab("/listagem-pets") }>
            <Text style={style.chipText}>Cachorros</Text>
          </TouchableOpacity>
          <TouchableOpacity style={style.chip} onPress={() => navigateToTab("/listagem-pets") }>
            <Text style={style.chipText}>Gatos</Text>
          </TouchableOpacity>
        </View>

        <View style={style.sectionHeader}>
          <Text style={style.sectionTitle}>Destaques</Text>
          <TouchableOpacity onPress={() => navigateToTab("/listagem-pets") }>
            <Text style={style.sectionLink}>Ver todos</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={pets.slice(0, 6)}
          contentContainerStyle={style.gallery}
          renderItem={({ item, index }) => (
            <View style={style.cardWrap}>
              <CardPet animal={item} index={index} onlyPicture={false}></CardPet>
            </View>
          )}
          horizontal
          showsHorizontalScrollIndicator={false}
        />

        <TouchableOpacity style={style.secondaryCta} onPress={() => router.push("/inicio-eventos") }>
          <Ionicons name="calendar-outline" size={18} color={colors.primary} />
          <Text style={style.secondaryCtaText}>Ver eventos de adoção</Text>
        </TouchableOpacity>
      </ScrollView>

      <NavBar></NavBar>
    </View>
  );
}

function PawIcon() {
  return (
    <Svg width={35} height={35} viewBox="0 0 24 24">
      <Circle cx="7.2" cy="7.5" r="2" fill={colors.primary} />
      <Circle cx="11.8" cy="5.9" r="2" fill={colors.primary} />
      <Circle cx="16.4" cy="7.6" r="2" fill={colors.primary} />
      <Circle cx="18.1" cy="12.1" r="2" fill={colors.primary} />
      <Ellipse cx="11.9" cy="14.4" rx="4.4" ry="3.5" fill={colors.primary} />
    </Svg>
  );
}

const style = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  content: {
    paddingTop: 62,
    paddingHorizontal: 20,
    paddingBottom: 120,
    gap: 16,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
  },
  titleBlock: {
    flex: 1,
    marginRight: 10,
  },
  titleRow: {
    position: "relative",
    minHeight: 70,
    justifyContent: "flex-end",
  },
  title: {
    marginTop: 2,
    color: "#202020",
    fontSize: 23,
    fontWeight: "800",
    fontFamily: "Manrope_800ExtraBold",
    paddingRight: 34,
  },
  pawWrap: {
    position: "absolute",
    right: 0,
    bottom: 6,
  },
  searchButton: {
    marginTop: 4,
    backgroundColor: "#fff",
    borderRadius: 18,
    paddingHorizontal: 14,
    minHeight: 46,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: "#E9E9E9",
  },
  searchText: {
    flex: 1,
    color: "#8C8C8C",
    fontSize: 14,
    fontFamily: "Manrope_400Regular",
  },
  banner: {
    backgroundColor: colors.primary,
    borderRadius: 22,
    padding: 20,
    marginTop: 2,
    gap: 10,
  },
  bannerTitle: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "800",
    fontFamily: "Manrope_800ExtraBold",
    width: "78%",
  },
  bannerDescription: {
    color: "#FDEDEC",
    fontSize: 14,
    fontFamily: "Manrope_400Regular",
  },
  bannerButton: {
    alignSelf: "flex-start",
    marginTop: 4,
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  bannerButtonText: {
    color: colors.primary,
    fontWeight: "700",
    fontFamily: "Manrope_700Bold",
  },
  chipRow: {
    flexDirection: "row",
    gap: 8,
  },
  chip: {
    backgroundColor: "#EFEFEF",
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  chipActive: {
    backgroundColor: colors.primary,
  },
  chipText: {
    color: "#5F5F5F",
    fontWeight: "600",
    fontFamily: "Manrope_600SemiBold",
  },
  chipActiveText: {
    color: "white",
    fontWeight: "700",
    fontFamily: "Manrope_700Bold",
  },
  sectionHeader: {
    marginTop: 6,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 22,
    color: "#222",
    fontWeight: "800",
    fontFamily: "Manrope_800ExtraBold",
  },
  sectionLink: {
    color: colors.primary,
    fontWeight: "700",
    fontFamily: "Manrope_700Bold",
  },
  gallery: {
    gap: 14,
    paddingBottom: 4,
  },
  cardWrap: {
    width: 210,
    height: 248,
  },
  secondaryCta: {
    marginTop: 6,
    backgroundColor: "#FFE9E6",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#FFD2CD",
    paddingVertical: 14,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
  },
  secondaryCtaText: {
    color: colors.primary,
    fontWeight: "700",
    fontFamily: "Manrope_700Bold",
  }
})
