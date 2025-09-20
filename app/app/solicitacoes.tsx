import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import styles from "../styles/AppStyles";

const Solicitacoes = () => {
  const router = useRouter();
  const [formularioAberto, setFormularioAberto] = useState<null | number>(null);

  // Mock de solicitações
  const solicitacoes = [
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
      {/* Imagem do animal como overlay, metade para dentro/metade para fora */}
      <Image
        source={animal.imagem}
        style={{
          width: 80,
          height: 80,
          borderRadius: 40,
          position: 'absolute',
          top: -40,
          left: '50%',
          marginLeft: -40,
          borderWidth: 2,
          borderColor: '#fff',
          backgroundColor: '#eee',
        }}
      />
  <Text style={{ fontWeight: 'bold', fontSize: 17, marginBottom: 8, alignSelf: 'center' }}>{animal.nome}</Text>
      {/* Informações do usuário com imagem de perfil */}
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
          backgroundColor: '#ff6f61',
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
    const solicitacao = solicitacoes.find(s => s.id === formularioAberto);
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
    <ScrollView style={{ flex: 1, backgroundColor: '#f5f5f5' }} contentContainerStyle={{ padding: 20 }}>
      <Text style={styles.title}>Solicitações</Text>
      {solicitacoes.map((s) => (
        <CardSolicitacao
          key={s.id}
          usuario={s.usuario}
          animal={s.animal}
          usuarioImagem={s.usuarioImagem}
          onVerFormulario={() => setFormularioAberto(s.id)}
        />
      ))}
    </ScrollView>
  );
};

export default Solicitacoes;
