import { Entypo, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import { Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import colors from "../styles/colors";
import { useTabNavigation } from "@/hooks/useTabNavigation";

export default function MeusPets() {
  const router = useRouter();
  const { navigateToTab } = useTabNavigation();
  const { width } = useWindowDimensions();
  const isSmall = width < 360;
  const isTablet = width >= 768;

  const metrics = useMemo(() => {
    const horizontalPadding = isTablet ? 24 : 16;
    const maxContentWidth = isTablet ? 760 : width - horizontalPadding * 2;
    const cardWidth = Math.min(maxContentWidth, width - horizontalPadding * 2);

    return {
      horizontalPadding,
      cardWidth,
      imageSize: isSmall ? 62 : 72,
      titleSize: isSmall ? 17 : 19,
      subtitleSize: isSmall ? 13 : 14,
      speciesSize: isSmall ? 10 : 11,
      iconSize: isSmall ? 18 : 20,
      actionSize: isSmall ? 34 : 38,
    };
  }, [isSmall, isTablet, width]);

  const [pets, setPets] = useState([
    {
      id: 1,
      nome: 'Rex',
      idade: '2 anos',
      especie: 'Cachorro',
      imagem: require('../assets/images/dog1.png'),
    },
    {
      id: 2,
      nome: 'Luna',
      idade: '1 ano',
      especie: 'Gato',
      imagem: require('../assets/images/cat1.png'),
    },
    {
      id: 3,
      nome: 'Toby',
      idade: '3 anos',
      especie: 'Cachorro',
      imagem: require('../assets/images/dog1.png'),
    },
    {
      id: 4,
      nome: 'Mimi',
      idade: '6 meses',
      especie: 'Gato',
      imagem: require('../assets/images/cat1.png'),
    },
    {
      id: 5,
      nome: 'Thor',
      idade: '4 anos',
      especie: 'Cachorro',
      imagem: require('../assets/images/dog1.png'),
    },
    {
      id: 6,
      nome: 'Nina',
      idade: '8 meses',
      especie: 'Gato',
      imagem: require('../assets/images/cat1.png'),
    },
    {
      id: 7,
      nome: 'Bidu',
      idade: '5 anos',
      especie: 'Cachorro',
      imagem: require('../assets/images/dog1.png'),
    },
    {
      id: 8,
      nome: 'Mel',
      idade: '2 anos',
      especie: 'Gato',
      imagem: require('../assets/images/cat1.png'),
    },
    {
      id: 9,
      nome: 'Simba',
      idade: '1 ano',
      especie: 'Cachorro',
      imagem: require('../assets/images/dog1.png'),
    },
    {
      id: 10,
      nome: 'Lili',
      idade: '3 anos',
      especie: 'Gato',
      imagem: require('../assets/images/cat1.png'),
    },
  ]);

  const handleDelete = (id: number) => {
    console.log('Clicou para excluir o pet de id:', id);
    Alert.alert(
      'Excluir anúncio',
      'Deseja realmente apagar este anúncio de animal?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => setPets(pets.filter(pet => pet.id !== id)),
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.screen} edges={["top", "left", "right", "bottom"]}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
            <Ionicons name="arrow-back" size={28} color={colors.primary} />
        </TouchableOpacity>
        <View style={styles.headerTitleWrap}>
          <Text style={styles.headerTitle}>Meus Pets</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingHorizontal: metrics.horizontalPadding },
          isTablet && styles.contentTablet,
        ]}
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity
          onPress={() => navigateToTab("/criar-anuncio")}
          style={[styles.addButton, { width: metrics.cardWidth }]}
        >
          <Ionicons name="add-circle-outline" size={metrics.iconSize + 2} color={colors.primary} />
          <Text style={[styles.addButtonText, { fontSize: isSmall ? 16 : 17 }]}>Adicionar novo pet</Text>
        </TouchableOpacity>

        {pets.map((pet) => (
            <View
              key={pet.id}
              style={[styles.card, { width: metrics.cardWidth }]}
            >
              <Image
                source={pet.imagem}
                style={[
                  styles.petImage,
                  {
                    width: metrics.imageSize,
                    height: metrics.imageSize,
                    borderRadius: isSmall ? 14 : 16,
                  },
                ]}
                resizeMode="cover"
              />
              <View style={styles.petInfo}>
                <Text numberOfLines={1} style={[styles.petName, { fontSize: metrics.titleSize }]}>{pet.nome}</Text>
                <Text numberOfLines={1} style={[styles.petAge, { fontSize: metrics.subtitleSize }]}>{pet.idade}</Text>
                <View style={styles.speciesBadge}>
                  <Text style={[styles.speciesText, { fontSize: metrics.speciesSize }]}>{pet.especie}</Text>
                </View>
              </View>

              <View style={styles.actionsColumn}>
                <TouchableOpacity
                  onPress={() => navigateToTab("/criar-anuncio")}
                  style={[styles.actionButton, { width: metrics.actionSize, height: metrics.actionSize }]}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Entypo name="dots-three-vertical" size={metrics.iconSize} color={colors.primary} />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => handleDelete(pet.id)}
                  style={[styles.actionButton, { width: metrics.actionSize, height: metrics.actionSize }]}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <MaterialIcons name="delete" size={metrics.iconSize + 1} color={colors.primary} />
                </TouchableOpacity>
              </View>
            </View>
          ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F3F3F3",
  },
  header: {
    width: "100%",
    backgroundColor: "#fff",
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    paddingTop: 18,
    paddingBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF4F2",
  },
  headerTitleWrap: {
    flex: 1,
    alignItems: "center",
    paddingRight: 40,
  },
  headerTitle: {
    fontSize: 30,
    fontWeight: "800",
    color: "#E74C3C",
  },
  content: {
    paddingTop: 20,
    paddingBottom: 28,
    alignItems: "center",
    gap: 12,
  },
  contentTablet: {
    alignSelf: "center",
    width: "100%",
    maxWidth: 960,
  },
  addButton: {
    minHeight: 58,
    borderRadius: 18,
    backgroundColor: "#FFE8E5",
    borderColor: "#FFD0CC",
    borderWidth: 1,
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  addButtonText: {
    color: colors.primary,
    fontWeight: "800",
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 18,
    minHeight: 96,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
    padding: 12,
    borderWidth: 1,
    borderColor: "#ECECEC",
    gap: 12,
  },
  petImage: {
    backgroundColor: colors.buttonBackground,
  },
  petInfo: {
    flex: 1,
    minWidth: 0,
  },
  petName: {
    fontWeight: "800",
    color: colors.primary,
    marginBottom: 2,
  },
  petAge: {
    color: colors.textPrimary,
  },
  speciesBadge: {
    marginTop: 8,
    alignSelf: "flex-start",
    backgroundColor: "#F5F5F5",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  speciesText: {
    color: "#666",
    fontWeight: "700",
    textTransform: "uppercase",
  },
  actionsColumn: {
    gap: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  actionButton: {
    borderRadius: 999,
    backgroundColor: `${colors.secondary}55`,
    alignItems: "center",
    justifyContent: "center",
  },
});