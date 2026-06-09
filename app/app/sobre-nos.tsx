import { Ionicons } from '@expo/vector-icons';
import React from "react";
import { Image, Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import AppHeader from '../components/AppHeader';
import colors from '../styles/colors';

export default function SobreNos() {
  return (
    <View style={styles.screen}>
      <AppHeader title="Sobre" />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <View style={styles.hero}>
          <Text style={styles.kicker}>Nossa missão</Text>
          <Text style={styles.heroTitle}>Toda cauda tem uma história que merece um novo capítulo.</Text>
          <Text style={styles.heroText}>
            O Adotaí conecta pessoas e animais com uma jornada de adoção mais humana, segura e acolhedora.
          </Text>

          <View style={styles.quoteBox}>
            <Text style={styles.quoteText}>
              “Não buscamos apenas lares. Buscamos famílias para toda a vida.”
            </Text>
          </View>
        </View>

        <View style={styles.aboutCard}>
          <View style={styles.logoWrap}>
            <Image source={require("../assets/images/letra.png")} style={styles.logo} />
          </View>
          <Text style={styles.aboutTitle}>Sobre o Adotaí</Text>
          <Text style={styles.aboutText}>
            Nosso propósito é facilitar a adoção responsável, aproximando protetores, ONGs e adotantes de forma transparente.
            Trabalhamos para garantir triagem, cuidado e uma experiência positiva para todos.
          </Text>

          <View style={styles.statsGrid}>
            <StatCard value="12k+" label="Vidas impactadas" />
            <StatCard value="450" label="Parceiros" />
            <StatCard value="24/7" label="Suporte" />
            <StatCard value="100%" label="Compromisso" />
          </View>
        </View>

        <View style={styles.socialBox}>
          <Text style={styles.socialTitle}>Acompanhe nossas redes</Text>
          <View style={styles.socialRow}>
            <SocialButton icon="logo-instagram" onPress={() => Linking.openURL('https://instagram.com/adotaai')} />
            <SocialButton icon="logo-facebook" onPress={() => Linking.openURL('https://facebook.com/adotaai')} />
            <SocialButton icon="mail-outline" onPress={() => Linking.openURL('mailto:contato@adotaai.com')} />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function SocialButton({ icon, onPress }: { icon: React.ComponentProps<typeof Ionicons>["name"]; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.socialButton} onPress={onPress}>
      <Ionicons name={icon} size={24} color={colors.primary} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingTop: 100,
    paddingHorizontal: 16,
    paddingBottom: 40,
    gap: 12,
  },
  hero: {
    backgroundColor: '#fff5f4',
    borderRadius: 26,
    borderWidth: 1,
    borderColor: '#ffd8d4',
    padding: 18,
    gap: 8,
  },
  kicker: {
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: colors.primary,
    fontWeight: '800',
  },
  heroTitle: {
    fontSize: 30,
    lineHeight: 35,
    fontWeight: '900',
    color: '#212121',
  },
  heroText: {
    color: '#5f5f5f',
    fontSize: 15,
    lineHeight: 22,
  },
  quoteBox: {
    marginTop: 6,
    backgroundColor: '#ffe7e5',
    borderRadius: 14,
    padding: 12,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  quoteText: {
    color: '#4c2d2a',
    fontSize: 14,
    fontStyle: 'italic',
    fontWeight: '600',
  },
  aboutCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#ececec',
    padding: 18,
    gap: 10,
  },
  logoWrap: {
    alignSelf: 'center',
    backgroundColor: '#ffe6e3',
    borderRadius: 20,
    padding: 10,
  },
  logo: {
    width: 90,
    height: 90,
    resizeMode: 'contain',
  },
  aboutTitle: {
    marginTop: 2,
    fontSize: 26,
    fontWeight: '900',
    color: '#222',
    textAlign: 'center',
  },
  aboutText: {
    color: '#5b5b5b',
    fontSize: 15,
    lineHeight: 23,
    textAlign: 'center',
  },
  statsGrid: {
    marginTop: 4,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    backgroundColor: '#f5f5f5',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 10,
  },
  statValue: {
    color: colors.primary,
    fontSize: 26,
    fontWeight: '900',
  },
  statLabel: {
    color: '#676767',
    fontSize: 12,
    marginTop: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    fontWeight: '700',
  },
  socialBox: {
    backgroundColor: '#fff',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ececec',
    padding: 16,
    alignItems: 'center',
    gap: 10,
  },
  socialTitle: {
    color: '#555',
    fontSize: 15,
    fontWeight: '700',
  },
  socialRow: {
    flexDirection: 'row',
    gap: 10,
  },
  socialButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#ffeceb',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
