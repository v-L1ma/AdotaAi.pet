import { getRecentApprovedPets } from "@/services/petService";
import CardPet from "@/components/CardPet";
import NavBar from "@/components/NavBar";
import Skeleton from "@/components/Skeleton";
import { colors } from "@/styles/variables";
import { animal } from "@/types/TAnimal";
import React, { useEffect, useState } from "react";
import { FlatList, Image, StyleSheet, Text, View } from "react-native";

export default function Destaques() {
  const [pets, setPets] = useState<animal[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadPets() {
      try {
        const response = await getRecentApprovedPets(5);
        setPets(response);
      } catch {
        setPets([]);
      } finally {
        setIsLoading(false);
      }
    }

    void loadPets();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Skeleton width="40%" height={36} borderRadius={8} />
          <Skeleton width="55%" height={18} borderRadius={6} style={{ marginTop: 8 }} />
        </View>
        <View style={styles.listContent}>
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton.CardPet key={i} />
          ))}
        </View>
        <NavBar />
      </View>
    );
  }

  if (pets.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Destaques</Text>
          <Text style={styles.subtitle}>Pets recentes aprovados</Text>
        </View>
        <View style={styles.emptyContainer}>
          <Image source={require("../assets/images/nothingfound.png")} style={styles.emptyImage} />
          <Text style={styles.emptyText}>Nenhum pet disponível no momento.</Text>
        </View>
        <NavBar />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Destaques</Text>
        <Text style={styles.subtitle}>Os 5 pets mais recentes aprovados</Text>
      </View>

      <FlatList
        data={pets}
        contentContainerStyle={styles.listContent}
        renderItem={({ item, index }) => (
          <View style={styles.cardWrap}>
            <CardPet animal={item} index={index} onlyPicture={false} />
          </View>
        )}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
      />

      <NavBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 30,
    fontWeight: "800",
    color: "#1E1E1E",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    fontFamily: "Manrope_400Regular",
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 120,
    gap: 16,
  },
  cardWrap: {
    width: "100%",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    color: "#666",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 100,
  },
  emptyImage: {
    width: 180,
    height: 180,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    paddingHorizontal: 40,
  },
});