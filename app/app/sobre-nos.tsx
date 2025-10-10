import { Ionicons } from '@expo/vector-icons';
import React from "react";
import { Image, Linking, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import colors from '../styles/colors';

export default function SobreNos() {
  const router = require('expo-router').useRouter();
  return (
    <>
      {/* Safe area do topo branca */}
      <SafeAreaView edges={['top']} style={{ backgroundColor: '#fff' }} />
      {/* Header customizado padrão do app */}
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
          <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#e74c3c', textAlign: 'center', marginBottom: 0 }}>Sobre</Text>
        </View>
      </View>
      {/* Conteúdo dinâmico */}
      <ScrollView style={{ flex: 1, backgroundColor: '#f3f3f3' }} contentContainerStyle={{ alignItems: 'center', padding: 24, paddingBottom: 64 }}>
        <View style={{
          width: '100%',
          maxWidth: 400,
          backgroundColor: '#fff',
          borderRadius: 28,
          padding: 28,
          alignItems: 'center',
          shadowColor: '#000',
          shadowOpacity: 0.08,
          shadowRadius: 8,
          elevation: 3,
        }}>
          {/* Logo */}
          <View style={{
            backgroundColor: colors.secondary,
            borderRadius: 24,
            padding: 16,
            marginBottom: 12,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Image
              source={require("../assets/images/letra.png")}
              style={{ height: 120, width: 120, resizeMode: "contain" }}
            />
          </View>
          {/* Nome do app */}
          <Text style={{ fontSize: 26, fontWeight: 'bold', color: colors.primary, marginBottom: 8, letterSpacing: 1 }}>
            AdotAí
          </Text>
          {/* Missão */}
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
            <Ionicons name="heart-circle" size={22} color={colors.secondary} style={{ marginRight: 8 }} />
            <Text style={{ fontSize: 16, color: colors.textPrimary, fontWeight: '600' }}>
              Missão: 
            </Text>
          </View>
          <Text style={{ fontSize: 15, color: '#555', textAlign: 'center', marginBottom: 18 }}>
            Transformar vidas através do amor e da adoção, criando lares felizes para pets e pessoas.
          </Text>
          {/* Descrição */}
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
            <Ionicons name="paw" size={20} color={colors.secondary} style={{ marginRight: 8 }} />
            <Text style={{ fontSize: 16, color: colors.textPrimary, fontWeight: '600' }}>
              Sobre o AdotAí
            </Text>
          </View>
          <Text style={{ fontSize: 15, color: '#555', textAlign: 'center', marginBottom: 18 }}>
            O AdotAí nasceu com o propósito de conectar pessoas e animais que precisam de um novo lar. Nosso objetivo é facilitar o processo de adoção responsável, promovendo o bem-estar animal e incentivando a empatia e o cuidado na sociedade.
          </Text>
          {/* Redes sociais */}
          <View style={{ width: '100%', alignItems: 'center', marginTop: 10 }}>
            <Text style={{ color: '#888', fontSize: 15, marginBottom: 8 }}>Siga o AdotAí nas redes sociais:</Text>
            <View style={{ flexDirection: 'row', gap: 18 }}>
              <TouchableOpacity onPress={() => Linking.openURL('https://instagram.com/adotaai')}>
                <Ionicons name="logo-instagram" size={32} color={colors.primary} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => Linking.openURL('https://facebook.com/adotaai')}>
                <Ionicons name="logo-facebook" size={32} color={colors.primary} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </>
  );
}
