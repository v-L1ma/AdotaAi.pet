
import { Entypo, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, Dimensions, Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import colors from '../styles/colors';

export default function MeusPets() {
  const router = useRouter();
  const [pets, setPets] = useState([
    {
      id: 1,
      nome: 'Rex',
      idade: '2 anos',
      imagem: require('../assets/images/dog1.png'),
    },
    {
      id: 2,
      nome: 'Luna',
      idade: '1 ano',
      imagem: require('../assets/images/cat1.png'),
    },
    {
      id: 3,
      nome: 'Toby',
      idade: '3 anos',
      imagem: require('../assets/images/dog1.png'),
    },
    {
      id: 4,
      nome: 'Mimi',
      idade: '6 meses',
      imagem: require('../assets/images/cat1.png'),
    },
    {
      id: 5,
      nome: 'Thor',
      idade: '4 anos',
      imagem: require('../assets/images/dog1.png'),
    },
    {
      id: 6,
      nome: 'Nina',
      idade: '8 meses',
      imagem: require('../assets/images/cat1.png'),
    },
    {
      id: 7,
      nome: 'Bidu',
      idade: '5 anos',
      imagem: require('../assets/images/dog1.png'),
    },
    {
      id: 8,
      nome: 'Mel',
      idade: '2 anos',
      imagem: require('../assets/images/cat1.png'),
    },
    {
      id: 9,
      nome: 'Simba',
      idade: '1 ano',
      imagem: require('../assets/images/dog1.png'),
    },
    {
      id: 10,
      nome: 'Lili',
      idade: '3 anos',
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

  const screenWidth = Dimensions.get('window').width;
  const cardWidth = screenWidth * 0.92;

  return (
    <>
      {/* Safe area do topo branca */}
      <SafeAreaView edges={['top']} style={{ backgroundColor: '#fff' }} />
      {/* Conteúdo principal */}
  <SafeAreaView style={{ flex: 1, backgroundColor: '#f3f3f3' }} edges={['left', 'right', 'bottom']}>
        <View style={{
          width: "100%",
          backgroundColor: '#fff',
          borderBottomLeftRadius: 30,
          borderBottomRightRadius: 30,
          paddingTop: 50,
          paddingBottom: 20,
          shadowColor: '#000',
          shadowOpacity: 0.06,
          shadowRadius: 4,
          elevation: 2,
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 16,
        }}>
          <TouchableOpacity onPress={() => router.back()} style={{ position: 'absolute', left: 16, top: 52, zIndex: 2 }} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Ionicons name="arrow-back" size={28} color={colors.primary} />
          </TouchableOpacity>
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#e74c3c', textAlign: 'center', marginBottom: 0 }}>Meus Pets</Text>
          </View>
        </View>
        <ScrollView contentContainerStyle={{ paddingVertical: 24, alignItems: 'center' }}>
          {pets.map((pet, idx) => (
            <View
              key={pet.id}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: '#fff',
                borderRadius: 22,
                marginBottom: 22,
                width: cardWidth,
                minHeight: 110,
                shadowColor: colors.primary,
                shadowOpacity: 0.10,
                shadowRadius: 8,
                elevation: 3,
                padding: 16,
                borderWidth: 2,
                borderColor: '#ececec',
              }}
            >
              <Image
                source={pet.imagem}
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 18,
                  marginRight: 18,
                  backgroundColor: colors.buttonBackground,
                }}
                resizeMode="cover"
              />
              <View style={{ flex: 1, justifyContent: 'center' }}>
                <Text style={{ fontSize: 21, fontWeight: 'bold', color: colors.primary, marginBottom: 6 }}>{pet.nome}</Text>
                <Text style={{ fontSize: 16, color: colors.textPrimary }}>{pet.idade}</Text>
              </View>
              <View style={{ width: 16 }} />
              <TouchableOpacity
                onPress={() => router.push({ pathname: '/criarAnuncio', params: { pet: JSON.stringify(pet) } })}
                style={{ padding: 8, backgroundColor: colors.secondary + '55', borderRadius: 50, marginRight: 8 }}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Entypo name="dots-three-vertical" size={24} color={colors.primary} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleDelete(pet.id)}
                style={{ padding: 8, backgroundColor: colors.secondary + '55', borderRadius: 50 }}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <MaterialIcons name="delete" size={28} color={colors.primary} />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      </SafeAreaView>
    </>
  );
}