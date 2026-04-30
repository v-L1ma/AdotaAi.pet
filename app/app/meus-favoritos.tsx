import { Ionicons } from '@expo/vector-icons';
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import colors from '../styles/colors';
import apiService from "@/services/apiService";
import { animal } from "@/types/TAnimal";

type FavoritosResponse = {
  message?: string;
  data?: animal[];
};

export default function MeusFavoritos() {
  const router = useRouter();
  const [favoritos, setFavoritos] = useState<animal[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadFavoritos() {
      setIsLoading(true);
      setLoadError(null);

      try {
        const response = await apiService.get<FavoritosResponse>("/pets/favoritos");
        if (isMounted) {
          setFavoritos(response.data?.data ?? []);
        }
      } catch {
        if (isMounted) {
          setLoadError("Nao foi possivel carregar seus favoritos.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadFavoritos();

    return () => {
      isMounted = false;
    };
  }, []);

  const formatarIdade = (dtNasc?: string) => {
    if (!dtNasc) {
      return "Idade nao informada";
    }

    const date = new Date(dtNasc);
    if (Number.isNaN(date.getTime())) {
      return "Idade nao informada";
    }

    const diffMs = Date.now() - date.getTime();
    const diffYears = Math.floor(diffMs / (1000 * 60 * 60 * 24 * 365.25));
    if (diffYears > 0) {
      return `${diffYears} ano${diffYears > 1 ? "s" : ""}`;
    }

    const diffMonths = Math.max(1, Math.floor(diffMs / (1000 * 60 * 60 * 24 * 30.5)));
    return `${diffMonths} mes${diffMonths > 1 ? "es" : ""}`;
  };

  const handleDesfavoritar = async (id: string) => {
    try {
      await apiService.delete(`/pets/${id}/favoritar`);
      setFavoritos((current) => current.filter((fav) => fav.id !== id));
    } catch {
      Alert.alert("Erro", "Nao foi possivel desfavoritar agora.");
    }
  };

  const confirmDesfavoritar = (item: animal) => {
    Alert.alert(
      'Remover dos favoritos',
      `Deseja realmente desfavoritar ${item.nome}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Desfavoritar', style: 'destructive', onPress: () => handleDesfavoritar(item.id) },
      ]
    );
  };

  const renderItem = ({ item }: { item: animal }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.link_foto }} style={styles.petImage} />
      <View style={styles.content}>
        <Text style={styles.petName}>{item.nome}</Text>
        <Text style={styles.petInfo}>{item.especie} • {formatarIdade(item.dt_nasc)}</Text>
        <Text style={styles.petDescription} numberOfLines={2}>
          Pronto para encontrar um novo lar com carinho e segurança.
        </Text>
      </View>
      <TouchableOpacity style={styles.favoriteButton} onPress={() => confirmDesfavoritar(item)}>
        <Ionicons name="heart" size={22} color={colors.primary} />
      </TouchableOpacity>
    </View>
  );

  return (
    <>
      <SafeAreaView edges={['top']} style={{ backgroundColor: '#fff' }} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Ionicons name="arrow-back" size={28} color={colors.primary} />
        </TouchableOpacity>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text style={styles.headerTitle}>Meus Favoritos</Text>
        </View>
      </View>
      <View style={styles.container}>
        <FlatList
          data={favoritos}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 32, paddingTop: 12, paddingHorizontal: 2 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            isLoading ? (
              <Text style={styles.emptyText}>Carregando favoritos...</Text>
            ) : loadError ? (
              <Text style={styles.emptyText}>{loadError}</Text>
            ) : (
              <Text style={styles.emptyText}>Nenhum animal favoritado ainda.</Text>
            )
          }
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    width: "100%",
    backgroundColor: '#fff',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    paddingTop: 42,
    paddingBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  backButton: {
    position: 'absolute',
    left: 16,
    top: 44,
    zIndex: 2,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.primary,
    textAlign: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#f6f7f9',
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 1,
    width: '100%',
    borderWidth: 1,
    borderColor: '#ebedf0',
    position: 'relative',
  },
  petImage: {
    width: 72,
    height: 72,
    borderRadius: 12,
    backgroundColor: '#eee',
  },
  content: {
    flex: 1,
    marginLeft: 10,
    marginRight: 36,
  },
  petName: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  petInfo: {
    fontSize: 14,
    color: '#888',
    marginTop: 1,
  },
  petDescription: {
    marginTop: 5,
    color: '#5f5f5f',
    fontSize: 12,
    lineHeight: 17,
  },
  favoriteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    textAlign: 'center',
    color: '#888',
    fontSize: 16,
    marginTop: 40,
  },
});
