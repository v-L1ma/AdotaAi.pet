import { Ionicons } from '@expo/vector-icons';
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import colors from '../styles/colors';

// Mock temporário para exibição
type Favorito = {
  id: string;
  nome: string;
  especie: string;
  idade: string;
  imagem: any;
};

const initialFavoritos: Favorito[] = [
  {
    id: '1',
    nome: 'Luna',
    especie: 'Gato',
    idade: '2 anos',
    imagem: require('../assets/images/cat1.png'),
  },
  {
    id: '2',
    nome: 'Thor',
    especie: 'Cachorro',
    idade: '3 anos',
    imagem: require('../assets/images/dog1.png'),
  },
];

export default function MeusFavoritos() {
  const router = useRouter();
  const [favoritos, setFavoritos] = useState<Favorito[]>(initialFavoritos);

  const handleDesfavoritar = (id: string) => {
    setFavoritos(favoritos.filter(fav => fav.id !== id));
  };

  const confirmDesfavoritar = (item: Favorito) => {
    Alert.alert(
      'Remover dos favoritos',
      `Deseja realmente desfavoritar ${item.nome}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Desfavoritar', style: 'destructive', onPress: () => handleDesfavoritar(item.id) },
      ]
    );
  };

  const renderItem = ({ item }: { item: Favorito }) => (
    <View style={styles.card}>
      <Image source={item.imagem} style={styles.petImage} />
      <View style={{ flex: 1, marginLeft: 16 }}>
        <Text style={styles.petName}>{item.nome}</Text>
        <Text style={styles.petInfo}>{item.especie} • {item.idade}</Text>
      </View>
      <TouchableOpacity onPress={() => confirmDesfavoritar(item)}>
        <Ionicons name="heart" size={28} color={colors.primary} style={{ marginLeft: 8 }} />
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
          ListEmptyComponent={<Text style={styles.emptyText}>Nenhum animal favoritado ainda.</Text>}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    width: "100%",
    backgroundColor: '#fff',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    paddingTop: 50,
    paddingBottom: 30, // padding inferior maior
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  backButton: {
    position: 'absolute',
    left: 16,
    top: 52,
    zIndex: 2,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.primary,
    textAlign: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#f3f3f3',
    paddingHorizontal: 20,
    paddingTop: 32, // paddingTop maior
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 22,
    paddingVertical: 18,
    paddingHorizontal: 22,
    marginBottom: 18,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
    width: '100%', // garantir largura total
  },
  petImage: {
    width: 70,
    height: 70,
    borderRadius: 16,
    backgroundColor: '#eee',
  },
  petName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  petInfo: {
    fontSize: 15,
    color: '#888',
    marginTop: 4,
  },
  emptyText: {
    textAlign: 'center',
    color: '#888',
    fontSize: 16,
    marginTop: 40,
  },
});
