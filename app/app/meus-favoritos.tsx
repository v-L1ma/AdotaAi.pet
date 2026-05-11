import { Ionicons } from '@expo/vector-icons';
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { Alert, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import colors from '../styles/colors';
import { PetDTO } from '@/types/pet';
import { getPetImageUrl, petService } from '@/services/petService';

type Favorito = PetDTO;

export default function MeusFavoritos() {
  const router = useRouter();
  const [favoritos, setFavoritos] = useState<Favorito[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadFavorites = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await petService.listFavorites();
      setFavoritos(response);
    } catch {
      setError("Não foi possível carregar seus favoritos.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadFavorites();
  }, [loadFavorites]);

  const handleDesfavoritar = async (id: string) => {
    try {
      await petService.unfavorite(id);
      setFavoritos((current) => current.filter(fav => fav.id !== id));
    } catch {
      Alert.alert("Erro", "Não foi possível desfavoritar este pet agora.");
    }
  };

  const confirmDesfavoritar = (item: Favorito) => {
    Alert.alert(
      'Remover dos favoritos',
      `Deseja realmente desfavoritar ${item.nome || "este pet"}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Desfavoritar', style: 'destructive', onPress: () => item.id && handleDesfavoritar(item.id) },
      ]
    );
  };

  const renderItem = ({ item }: { item: Favorito }) => (
    <View style={styles.card}>
      <Image source={{ uri: getPetImageUrl(item.link_foto) }} style={styles.petImage} />
      <View style={styles.content}>
        <Text style={styles.petName}>{item.nome || "Pet sem nome"}</Text>
        <Text style={styles.petInfo}>{item.especie || "Espécie não informada"} • {item.porte || "Porte não informado"}</Text>
        <Text style={styles.petDescription} numberOfLines={2}>
          {item.descricao || "Pronto para encontrar um novo lar com carinho e segurança."}
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
        {isLoading ? (
          <Text style={styles.emptyText}>Carregando favoritos...</Text>
        ) : error ? (
          <View style={{ alignItems: "center", marginTop: 30 }}>
            <Text style={styles.emptyText}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={() => void loadFavorites()}>
              <Text style={styles.retryButtonText}>Tentar novamente</Text>
            </TouchableOpacity>
          </View>
        ) : (
        <FlatList
          data={favoritos}
          keyExtractor={(item, index) => item.id || `${item.nome || 'pet'}-${index}`}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 32, paddingTop: 12, paddingHorizontal: 2 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={<Text style={styles.emptyText}>Nenhum animal favoritado ainda.</Text>}
        />
        )}
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
  retryButton: {
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#f1c9c4',
    backgroundColor: '#fff3f1',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
  },
  retryButtonText: {
    color: colors.primary,
    fontWeight: '700',
  },
});
