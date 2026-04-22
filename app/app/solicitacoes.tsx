import { Ionicons } from '@expo/vector-icons';
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import colors from '../styles/colors';

type Solicitacao = {
  id: number;
  usuario: {
    nome: string;
    email: string;
    telefone: string;
  };
  triagem: {
    motivo: string;
    experiencia: string;
    ambiente: string;
    outrosPets: string;
    tempoDisponivel: string;
  };
  animal: {
    nome: string;
    imagem: any;
    status: 'Nova' | 'Pendente';
    tempo: string;
  };
  usuarioImagem: any;
};

const recebidos: Solicitacao[] = [
  {
    id: 1,
    usuario: { nome: "João Silva", email: "joao@email.com", telefone: "(11) 91234-5678" },
    triagem: {
      motivo: "Quero adotar para companhia.",
      experiencia: "Já tive cães antes.",
      ambiente: "Casa com quintal fechado.",
      outrosPets: "Sim, tenho um gato.",
      tempoDisponivel: "Tarde e noite.",
    },
    animal: { nome: "Rex", imagem: require("../assets/images/dog1.png"), status: 'Nova', tempo: 'há 2 horas' },
    usuarioImagem: require("../assets/images/icon.jpg"),
  },
  {
    id: 3,
    usuario: { nome: "Carlos Souza", email: "carlos@email.com", telefone: "(31) 99888-1234" },
    triagem: {
      motivo: "Quero adotar para companhia dos meus pais.",
      experiencia: "Já tive gatos.",
      ambiente: "Casa grande com jardim.",
      outrosPets: "Não.",
      tempoDisponivel: "Noite.",
    },
    animal: { nome: "Luna", imagem: require("../assets/images/cat1.png"), status: 'Pendente', tempo: 'ontem' },
    usuarioImagem: require("../assets/images/icon.jpg"),
  },
];

const enviados: Solicitacao[] = [
  {
    id: 2,
    usuario: { nome: "Maria Oliveira", email: "maria@email.com", telefone: "(21) 99876-5432" },
    triagem: {
      motivo: "Quero adotar para meus filhos.",
      experiencia: "Nunca tive pets.",
      ambiente: "Apartamento médio.",
      outrosPets: "Não.",
      tempoDisponivel: "Manhã e fim de semana.",
    },
    animal: { nome: "Mimi", imagem: require("../assets/images/cat1.png"), status: 'Pendente', tempo: '2 dias' },
    usuarioImagem: require("../assets/images/icon.jpg"),
  },
  {
    id: 5,
    usuario: { nome: "Bruno Lima", email: "bruno@email.com", telefone: "(51) 98765-4321" },
    triagem: {
      motivo: "Quero adotar para companhia.",
      experiencia: "Já tive cachorros.",
      ambiente: "Casa com quintal.",
      outrosPets: "Sim, tenho um peixe.",
      tempoDisponivel: "Tarde.",
    },
    animal: { nome: "Mel", imagem: require("../assets/images/dog1.png"), status: 'Pendente', tempo: '4 dias' },
    usuarioImagem: require("../assets/images/icon.jpg"),
  },
];

export default function Solicitacoes() {
  const router = useRouter();
  const [tab, setTab] = useState<'recebidos' | 'enviados'>('recebidos');
  const [aberta, setAberta] = useState<number | null>(null);

  const data = useMemo(() => (tab === 'recebidos' ? recebidos : enviados), [tab]);
  const selecionada = data.find((item) => item.id === aberta) || null;

  if (selecionada) {
    return (
      <SafeAreaView style={styles.screen} edges={['top', 'left', 'right', 'bottom']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setAberta(null)} style={styles.backButton}>
            <Ionicons name="arrow-back" size={28} color={colors.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Formulário de Triagem</Text>
        </View>

        <ScrollView contentContainerStyle={styles.formContent}>
          <View style={styles.formCard}>
            <Text style={styles.formSectionTitle}>Solicitante</Text>
            <Text style={styles.formText}>Nome: {selecionada.usuario.nome}</Text>
            <Text style={styles.formText}>Email: {selecionada.usuario.email}</Text>
            <Text style={styles.formText}>Telefone: {selecionada.usuario.telefone}</Text>
          </View>

          <View style={styles.formCard}>
            <Text style={styles.formSectionTitle}>Respostas</Text>
            <Text style={styles.formText}>Motivo: {selecionada.triagem.motivo}</Text>
            <Text style={styles.formText}>Experiência: {selecionada.triagem.experiencia}</Text>
            <Text style={styles.formText}>Ambiente: {selecionada.triagem.ambiente}</Text>
            <Text style={styles.formText}>Outros pets: {selecionada.triagem.outrosPets}</Text>
            <Text style={styles.formText}>Tempo disponível: {selecionada.triagem.tempoDisponivel}</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <>
      <SafeAreaView edges={['top']} style={{ backgroundColor: '#fff' }} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={28} color={colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Solicitações</Text>
      </View>

      <View style={styles.screen}>
        <View style={styles.tabsWrap}>
          <TouchableOpacity style={[styles.tab, tab === 'recebidos' && styles.tabActive]} onPress={() => setTab('recebidos')}>
            <Text style={[styles.tabText, tab === 'recebidos' && styles.tabTextActive]}>Recebidos</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.tab, tab === 'enviados' && styles.tabActive]} onPress={() => setTab('enviados')}>
            <Text style={[styles.tabText, tab === 'enviados' && styles.tabTextActive]}>Enviados</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.cardsContent} showsVerticalScrollIndicator={false}>
          {data.map((item) => (
            <View key={item.id} style={styles.card}>
              <View style={styles.cardTop}>
                <Image source={item.animal.imagem} style={styles.petImage} />
                <View style={{ alignItems: 'flex-end' }}>
                  <View style={[styles.statusBadge, item.animal.status === 'Nova' ? styles.statusNew : styles.statusPending]}>
                    <Text style={styles.statusText}>{item.animal.status}</Text>
                  </View>
                  <Text style={styles.timeText}>{item.animal.tempo}</Text>
                </View>
              </View>

              <Text style={styles.petName}>{item.animal.nome}</Text>
              <Text style={styles.requesterLabel}>Dados do solicitante</Text>

              <View style={styles.requesterRow}>
                <Image source={item.usuarioImagem} style={styles.userImage} />
                <View>
                  <Text style={styles.requesterText}>{item.usuario.nome}</Text>
                  <Text style={styles.requesterSub}>{item.usuario.email}</Text>
                  <Text style={styles.requesterSub}>{item.usuario.telefone}</Text>
                </View>
              </View>

              <TouchableOpacity style={styles.viewButton} onPress={() => setAberta(item.id)}>
                <Text style={styles.viewButtonText}>Ver formulário</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f6f7f9',
    paddingHorizontal: 16,
  },
  header: {
    width: '100%',
    backgroundColor: '#fff',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    paddingTop: 42,
    paddingBottom: 14,
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
    color: '#e74c3c',
    textAlign: 'center',
  },
  tabsWrap: {
    marginTop: 10,
    alignSelf: 'center',
    flexDirection: 'row',
    backgroundColor: '#eceff3',
    borderRadius: 14,
    padding: 4,
    gap: 4,
  },
  tab: {
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  tabActive: {
    backgroundColor: '#fff',
  },
  tabText: {
    color: '#777',
    fontWeight: '700',
  },
  tabTextActive: {
    color: colors.primary,
  },
  cardsContent: {
    paddingTop: 12,
    paddingBottom: 28,
    gap: 10,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#ebedf0',
    padding: 12,
    marginBottom: 10,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  petImage: {
    width: 72,
    height: 72,
    borderRadius: 14,
  },
  statusBadge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  statusNew: {
    backgroundColor: '#d8f5df',
  },
  statusPending: {
    backgroundColor: '#ececec',
  },
  statusText: {
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
    color: '#334',
  },
  timeText: {
    marginTop: 4,
    fontSize: 11,
    color: '#777',
  },
  petName: {
    fontSize: 20,
    fontWeight: '800',
    color: '#202020',
  },
  requesterLabel: {
    marginTop: 4,
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    color: '#7a7a7a',
  },
  requesterRow: {
    marginTop: 6,
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  userImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  requesterText: {
    color: '#222',
    fontWeight: '700',
    fontSize: 14,
  },
  requesterSub: {
    color: '#666',
    fontSize: 11,
  },
  viewButton: {
    marginTop: 10,
    backgroundColor: colors.primary,
    borderRadius: 10,
    minHeight: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
  formContent: {
    padding: 16,
    gap: 10,
    paddingBottom: 30,
  },
  formCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#ececec',
    padding: 14,
    gap: 6,
  },
  formSectionTitle: {
    color: '#202020',
    fontWeight: '900',
    fontSize: 18,
    marginBottom: 4,
  },
  formText: {
    color: '#555',
    lineHeight: 20,
  },
});
