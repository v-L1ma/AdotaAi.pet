import { Ionicons } from '@expo/vector-icons';
import React from "react";
import { Image, Linking, Text, TouchableOpacity, View } from "react-native";
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
      <View style={{ alignItems: 'center', paddingTop: 32, paddingHorizontal: 24 }}>
        <View style={{
          width: 180,
          height: 180,
          backgroundColor: colors.secondary,
          borderRadius: 32,
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 24,
          shadowColor: '#000',
          shadowOpacity: 0.08,
          shadowRadius: 8,
          elevation: 2,
        }}>
          <Image
            source={require("../assets/images/letra.png")}
            style={{ height: 160, width: 160, resizeMode: "contain" }}
          />
        </View>
        <Text style={{ fontSize: 17, color: colors.textPrimary, textAlign: 'center', marginBottom: 24 }}>
          O AdotAí nasceu com o propósito de conectar pessoas e animais que precisam de um novo lar. Nosso objetivo é facilitar o processo de adoção responsável, promovendo o bem-estar animal e incentivando a empatia e o cuidado na sociedade.
        </Text>
        <Text style={{ fontSize: 16, color: '#555', textAlign: 'center', marginBottom: 8 }}>
          Missão: Transformar vidas através do amor e da adoção, criando lares felizes para pets e pessoas.
        </Text>
      </View>
      <View style={{ position: 'absolute', bottom: 32, width: '100%', alignItems: 'center' }}>
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
    </>
  );
}
