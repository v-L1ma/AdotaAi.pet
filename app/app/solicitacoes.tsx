

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import colors from '../styles/colors';

const Solicitacoes = () => {
  const router = useRouter();
  const [formularioAberto, setFormularioAberto] = useState<null | number>(null);
  const [tab, setTab] = useState<'recebidos' | 'enviados'>('recebidos');

  // Mock de solicitações recebidas
  const solicitacoesRecebidas = [
    {
      id: 1,
      usuario: {
        nome: "João Silva",
        email: "joao@email.com",
        telefone: "(11) 91234-5678",
      },
      triagem: {
        motivo: "Quero adotar para companhia.",
        experiencia: "Já tive cães antes.",
        ambiente: "Casa com quintal fechado.",
        outrosPets: "Sim, tenho um gato.",
        tempoDisponivel: "Tarde e noite.",
      },
      animal: {
        nome: "Rex",
        imagem: require("../assets/images/dog1.png"),
      },
      usuarioImagem: require("../assets/images/icon.jpg"),
    },
    {
      id: 3,
      usuario: {
        nome: "Carlos Souza",
        email: "carlos@email.com",
        telefone: "(31) 99888-1234",
      },
      triagem: {
        motivo: "Quero adotar para companhia dos meus pais.",
        experiencia: "Já tive gatos.",
        ambiente: "Casa grande com jardim.",
        outrosPets: "Não.",
        tempoDisponivel: "Noite.",
      },
      animal: {
        nome: "Luna",
        imagem: require("../assets/images/cat1.png"),
      },
      usuarioImagem: require("../assets/images/icon.jpg"),
    },
    {
      id: 4,
      usuario: {
        nome: "Ana Paula",
        email: "ana@email.com",
        telefone: "(41) 91234-5678",
      },
      triagem: {
        motivo: "Quero adotar para meus filhos.",
        experiencia: "Nunca tive pets.",
        ambiente: "Apartamento pequeno.",
        outrosPets: "Não.",
        tempoDisponivel: "Manhã e tarde.",
      },
      animal: {
        nome: "Toby",
        imagem: require("../assets/images/dog1.png"),
      },
      usuarioImagem: require("../assets/images/icon.jpg"),
    }
  ];

  // Mock de solicitações enviadas
  const solicitacoesEnviadas = [
    {
      id: 2,
      usuario: {
        nome: "Maria Oliveira",
        email: "maria@email.com",
        telefone: "(21) 99876-5432",
      },
      triagem: {
        motivo: "Quero adotar para meus filhos.",
        experiencia: "Nunca tive pets.",
        ambiente: "Apartamento médio.",
        outrosPets: "Não.",
        tempoDisponivel: "Manhã e fim de semana.",
      },
      animal: {
        nome: "Mimi",
        imagem: require("../assets/images/cat1.png"),
      },
      usuarioImagem: require("../assets/images/icon.jpg"),
    },
    {
      id: 5,
      usuario: {
        nome: "Bruno Lima",
        email: "bruno@email.com",
        telefone: "(51) 98765-4321",
      },
      triagem: {
        motivo: "Quero adotar para companhia.",
        experiencia: "Já tive cachorros.",
        ambiente: "Casa com quintal.",
        outrosPets: "Sim, tenho um peixe.",
        tempoDisponivel: "Tarde.",
      },
      animal: {
        nome: "Mel",
        imagem: require("../assets/images/dog1.png"),
      },
      usuarioImagem: require("../assets/images/icon.jpg"),
    },
    {
      id: 6,
      usuario: {
        nome: "Fernanda Costa",
        email: "fernanda@email.com",
        telefone: "(61) 91234-5678",
      },
      triagem: {
        motivo: "Quero adotar para companhia do meu filho.",
        experiencia: "Nunca tive pets.",
        ambiente: "Apartamento grande.",
        outrosPets: "Não.",
        tempoDisponivel: "Noite e fim de semana.",
      },
      animal: {
        nome: "Nina",
        imagem: require("../assets/images/cat1.png"),
      },
      usuarioImagem: require("../assets/images/icon.jpg"),
    }
  ];

  const CardSolicitacao = ({ usuario, animal, usuarioImagem, onVerFormulario }: any) => (
    <View style={{
      backgroundColor: '#fff',
      borderRadius: 12,
      paddingTop: 56,
      paddingBottom: 16,
      paddingHorizontal: 16,
      marginBottom: 60,
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowRadius: 6,
      elevation: 3,
      minHeight: 120,
      overflow: 'visible',
      position: 'relative',
    }}>
      <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: -40, marginBottom: 8 }}>
        <Image
          source={animal.imagem}
          style={{
            width: 80,
            height: 80,
            borderRadius: 40,
            borderWidth: 2,
            borderColor: '#fff',
            backgroundColor: '#eee',
          }}
        />
        <Text style={{ fontWeight: 'bold', fontSize: 17, marginTop: 8 }}>{animal.nome}</Text>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8, marginTop: 8 }}>
        <Image source={usuarioImagem} style={{ width: 50, height: 50, borderRadius: 25, marginRight: 12, alignSelf: 'flex-start' }} />
        <View style={{ alignItems: 'flex-start', justifyContent: 'center', flex: 1 }}>
          <Text style={{ textAlign: 'left' }}>Nome: {usuario.nome}</Text>
          <Text style={{ textAlign: 'left' }}>Email: {usuario.email}</Text>
          <Text style={{ textAlign: 'left' }}>Telefone: {usuario.telefone}</Text>
        </View>
      </View>
      <TouchableOpacity
        style={{
          marginTop: 8,
          backgroundColor: '#fda49cff',
          padding: 10,
          borderRadius: 8,
          alignItems: 'center',
        }}
        onPress={onVerFormulario}
      >
        <Text style={{ color: '#fff', fontWeight: 'bold' }}>Ver Formulário</Text>
      </TouchableOpacity>
    </View>
  );

  const FormularioTriagem = ({ usuario, triagem, onVoltar }: any) => (
    <View style={{
      backgroundColor: '#fff',
      borderRadius: 12,
      padding: 20,
      margin: 20,
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowRadius: 6,
      elevation: 3,
    }}>
      <Text style={{ fontWeight: 'bold', fontSize: 17, marginBottom: 12 }}>Formulário de Triagem</Text>
      <View>
        <Text style={{ marginBottom: 6 }}>Usuário: {usuario.nome}</Text>
        <Text>Motivo da adoção: {triagem.motivo}</Text>
        <Text>Experiência com pets: {triagem.experiencia}</Text>
        <Text>Ambiente: {triagem.ambiente}</Text>
        <Text>Outros pets: {triagem.outrosPets}</Text>
        <Text>Tempo disponível: {triagem.tempoDisponivel}</Text>
      </View>
      <TouchableOpacity
        style={{
          marginTop: 16,
          backgroundColor: '#4F8EF7',
          padding: 10,
          borderRadius: 8,
          alignItems: 'center',
        }}
        onPress={onVoltar}
      >
        <Text style={{ color: '#fff', fontWeight: 'bold' }}>Voltar</Text>
      </TouchableOpacity>
    </View>
  );

  if (formularioAberto !== null) {
    const solicitacao = (tab === 'recebidos' ? solicitacoesRecebidas : solicitacoesEnviadas).find(s => s.id === formularioAberto);
    if (!solicitacao) return null;
    return (
      <FormularioTriagem
        usuario={solicitacao.usuario}
        triagem={solicitacao.triagem}
        onVoltar={() => setFormularioAberto(null)}
      />
    );
  }

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
          <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#e74c3c', textAlign: 'center', marginBottom: 0 }}>Solicitações</Text>
        </View>
      </View>
      {/* Tabs e cards */}
      <View style={{ flexDirection: 'row', justifyContent: 'center', backgroundColor: 'transparent', marginTop: 16 }}>
        <TouchableOpacity
          style={{
            backgroundColor: tab === 'recebidos' ? colors.secondary : '#fff',
            paddingVertical: 8,
            paddingHorizontal: 24,
            borderRadius: 20,
            borderWidth: tab === 'recebidos' ? 0 : 1,
            borderColor: colors.secondary,
            marginRight: 10,
          }}
          onPress={() => setTab('recebidos')}
        >
          <Text style={{ color: tab === 'recebidos' ? '#fff' : colors.secondary, fontWeight: 'bold', fontSize: 16 }}>Recebidos</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            backgroundColor: tab === 'enviados' ? colors.secondary : '#fff',
            paddingVertical: 8,
            paddingHorizontal: 24,
            borderRadius: 20,
            borderWidth: tab === 'enviados' ? 0 : 1,
            borderColor: colors.secondary,
          }}
          onPress={() => setTab('enviados')}
        >
          <Text style={{ color: tab === 'enviados' ? '#fff' : colors.secondary, fontWeight: 'bold', fontSize: 16 }}>Enviados</Text>
        </TouchableOpacity>
      </View>
      {/* Cards roláveis */}
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingTop: 30 }}>
        <View style={{ paddingHorizontal: 20 }}>
          {(tab === 'recebidos' ? solicitacoesRecebidas : solicitacoesEnviadas).map((s) => (
            <CardSolicitacao
              key={s.id}
              usuario={s.usuario}
              animal={s.animal}
              usuarioImagem={s.usuarioImagem}
              onVerFormulario={() => setFormularioAberto(s.id)}
            />
          ))}
        </View>
      </ScrollView>
    </>
  );
}


export default Solicitacoes;
