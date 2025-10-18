import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import colors from '../styles/colors';

export default function AppHeader({ title }: { title: string }) {
  const router = useRouter();

  return (
    <>
      <SafeAreaView style={{ position: 'absolute', top: 0, left: 0, right: 0, backgroundColor: 'transparent', zIndex: 10 }} />
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 150,
          backgroundColor: 'transparent',
          zIndex: 10,
          alignItems: 'center',
        }}
      >
        <View
            style={{
            width: '100%',
            backgroundColor: '#fff',
            borderBottomLeftRadius: 30,
            borderBottomRightRadius: 30,
            paddingTop: 34,
            paddingBottom: 18,
            shadowColor: '#000',
            shadowOpacity: 0.06,
            shadowRadius: 4,
            elevation: 2,
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 16,
          }}
        >
          <TouchableOpacity
            onPress={() => router.back()}
            style={{ position: 'absolute', left: 16, top: 48, zIndex: 12 }}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="arrow-back" size={32} color={colors.primary} />
          </TouchableOpacity>
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#e74c3c', textAlign: 'center', marginBottom: 0 }}>{title}</Text>
          </View>
        </View>
      </View>
    </>
  );
}
