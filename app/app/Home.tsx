import { FlatList, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors } from "@/styles/variables";
import CardPet from "@/components/CardPet";
import NavBar from "@/components/NavBar";
import { animal } from "@/types/TAnimal";
import React from "react";

export default function Home() {
  const pets: animal[] = [
    {
      nome: "Alfredo",
      imagem: "https://img.freepik.com/fotos-gratis/fotografia-vertical-de-foco-superficial-de-um-bonito-cachorro-de-golden-retriever-sentado-em-um-chao-de-grama_181624-27259.jpg?w=360",
      genero: "M",
      especie: "cachorro",
      porte: "medio",
    },
    {
      nome: "Luna",
      imagem: "https://www.petz.com.br/blog/wp-content/uploads/2019/07/vida-de-gato.jpg",
      genero: "F",
      especie: "gato",
      porte: "pequeno",
    },
    {
      nome: "Thor",
      imagem: "https://img.freepik.com/fotos-gratis/fotografia-vertical-de-foco-superficial-de-um-bonito-cachorro-de-golden-retriever-sentado-em-um-chao-de-grama_181624-27259.jpg?w=360",
      genero: "M",
      especie: "cachorro",
      porte: "grande",
    },
    {
      nome: "Mimi",
      imagem: "https://www.petz.com.br/blog/wp-content/uploads/2019/07/vida-de-gato.jpg",
      genero: "F",
      especie: "gato",
      porte: "pequeno",
    },
    {
      nome: "Rex",
      imagem: "https://img.freepik.com/fotos-gratis/fotografia-vertical-de-foco-superficial-de-um-bonito-cachorro-de-golden-retriever-sentado-em-um-chao-de-grama_181624-27259.jpg?w=360",
      genero: "M",
      especie: "cachorro",
      porte: "medio",
    },
    {
      nome: "Mel",
      imagem: "https://img.freepik.com/fotos-gratis/fotografia-vertical-de-foco-superficial-de-um-bonito-cachorro-de-golden-retriever-sentado-em-um-chao-de-grama_181624-27259.jpg?w=360",
      genero: "F",
      especie: "cachorro",
      porte: "pequeno",
    },
    {
      nome: "Simba",
      imagem: "https://www.petz.com.br/blog/wp-content/uploads/2019/07/vida-de-gato.jpg",
      genero: "M",
      especie: "gato",
      porte: "medio",
    },
    {
      nome: "Bela",
      imagem: "https://img.freepik.com/fotos-gratis/fotografia-vertical-de-foco-superficial-de-um-bonito-cachorro-de-golden-retriever-sentado-em-um-chao-de-grama_181624-27259.jpg?w=360",
      genero: "F",
      especie: "cachorro",
      porte: "grande",
    },
    {
      nome: "Nina",
      imagem: "https://www.petz.com.br/blog/wp-content/uploads/2019/07/vida-de-gato.jpg",
      genero: "F",
      especie: "gato",
      porte: "pequeno",
    },
    {
      nome: "Max",
      imagem: "https://img.freepik.com/fotos-gratis/fotografia-vertical-de-foco-superficial-de-um-bonito-cachorro-de-golden-retriever-sentado-em-um-chao-de-grama_181624-27259.jpg?w=360",
      genero: "M",
      especie: "cachorro",
      porte: "medio",
    }
  ];

  return (
    <View style={{ flex: 1 }}>
      {/* Conteúdo rolável */}
      <ScrollView contentContainerStyle={style.fundo}>
        <View style={style.bannerBox}>
          <Image
            source={require("../assets/images/pets.png")}
            style={style.bannerImage}
            resizeMode="cover"
          />
          <View style={style.bannerOverlay} />
          <View style={style.bannerContent}>
            <Text style={style.bannerTitle}>Adote amor, adote um amigo!</Text>
            <Text style={style.bannerSubtitle}>O amigo que você busca está aqui</Text>
            <TouchableOpacity style={style.bannerButton} activeOpacity={0.85}>
              <Text style={style.bannerButtonText}>Ver Pets</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={style.titulo}>Categorias</Text>

        <View style={style.filtros}>
          <View style={style.opcao}>
            <Image style={style.icone} source={require("../assets/images/pets.png")} />
            <Text>Cachorro</Text>
          </View>

          <View style={style.opcao}>
            <Image style={style.icone} source={require("../assets/images/animal-shelter.png")} />
            <Text>Gato</Text>
          </View>
        </View>

        <View style={style.gallery}>
          <FlatList
            data={pets.slice(0, 5)}
            contentContainerStyle={style.gallery}
            renderItem={({ item, index }) => (
              <View style={{ height: 240, width: 230 }}>
                <CardPet animal={item} index={index} onlyPicture={false} />
              </View>
            )}
            horizontal
            showsHorizontalScrollIndicator={false}
          />
        </View>
      </ScrollView>

      {/* Navbar fixa no rodapé */}
      <View style={style.navbarWrapper}>
        <NavBar />
      </View>
    </View>
  );
}

const style = StyleSheet.create({
  fundo: {
    paddingTop: 60,
    paddingBottom: 100, // espaço extra para navbar fixa
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    fontFamily: "Sans",
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "column",
    width: "100%",
    paddingHorizontal: 25,
  },
  bannerBox: {
    width: '100%',
    height: 220,
    borderRadius: 18,
    overflow: 'hidden',
    marginBottom: 24,
    position: 'relative',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    padding: 20,
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    opacity: 0.45,
  },
  bannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.primary,
    opacity: 0.55,
  },
  bannerContent: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'flex-start',
    padding: 28,
  },
  bannerTitle: {
    color: 'white',
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 4,
    textShadowColor: 'rgba(0,0,0,0.18)',
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 4,
  },
  bannerSubtitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 12,
  },
  bannerButton: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 28,
    borderRadius: 12,
    elevation: 2,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 4,
  },
  bannerButtonText: {
    color: colors.primary,
    fontWeight: 'bold',
    fontSize: 20,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  titulo: {
    fontSize: 24,
    width: "100%",
    marginTop: 12,
  },
  filtros: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    gap: 10,
  },
  opcao: {
    backgroundColor: "white",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.05)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    width: "48%",
    padding: 15,
    marginBottom: 20,
  },
  icone: {
    width: 32,
    height: 32,
  },
  gallery: {
    gap: 20,
    marginBottom: 20,
  },
  navbarWrapper: {
  position: 'absolute',
  zIndex: 3,
},

});
