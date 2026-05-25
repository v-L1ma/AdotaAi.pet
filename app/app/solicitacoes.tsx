import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Image, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../styles/variables';
import Skeleton from "@/components/Skeleton";
import {
  getDetalhesSolicitacao,
  getSolicitacoesEnviadas,
  getSolicitacoesRecebidas,
} from "@/services/solicitacaoService";
import AppHeader from '@/components/AppHeader';
import { Ionicons } from "@expo/vector-icons";

type SolicitacaoDTO = {
  id: string;
  status: string;
  dataSolicitacao?: string;
  petId?: string;
  petNome?: string;
  petFoto?: string;
  adotanteNome?: string;
  adotanteEmail?: string;
  adotanteTelefone?: string;
  anuncianteNome?: string;
  anuncianteEmail?: string;
  anuncianteTelefone?: string;
  linkFotoPerfil?: string;
};

type PerguntaRespostaDTO = {
  perguntaId: string;
  perguntaTexto: string;
  respostaTexto?: string | null;
};

type FormularioDetalhadoDTO = {
  solicitacaoId: string;
  usuarioCriadorId: string;
  usuarioCriadorNome: string;
  usuarioRespondenteId: string;
  usuarioRespondenteNome: string;
  linkFotoPerfil?: string;
  perguntasRespostas: PerguntaRespostaDTO[];
};

export default function Solicitacoes() {
  const router = useRouter();
  const [tab, setTab] = useState<'recebidos' | 'enviados'>('recebidos');
  const [aberta, setAberta] = useState<string | null>(null);
  const [recebidos, setRecebidos] = useState<SolicitacaoDTO[]>([]);
  const [enviados, setEnviados] = useState<SolicitacaoDTO[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [detalhes, setDetalhes] = useState<FormularioDetalhadoDTO | null>(null);
  const [isLoadingDetalhes, setIsLoadingDetalhes] = useState(false);
  const [detalhesError, setDetalhesError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadSolicitacoes() {
      setIsLoading(true);
      setLoadError(null);

      try {
        const [recebidosRes, enviadosRes] = await Promise.all([
          getSolicitacoesRecebidas(),
          getSolicitacoesEnviadas(),
        ]);

        if (isMounted) {
          setRecebidos(recebidosRes ?? []);
          setEnviados(enviadosRes ?? []);
        }
      } catch {
        if (isMounted) {
          setLoadError("Nao foi possivel carregar as solicitacoes.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadSolicitacoes();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!aberta) {
      setDetalhes(null);
      setDetalhesError(null);
      return;
    }

    let isMounted = true;

    async function loadDetalhes() {
      setIsLoadingDetalhes(true);
      setDetalhesError(null);

      try {
        const response = await getDetalhesSolicitacao(aberta ?? "");
        if (isMounted) {
          setDetalhes(response);
        }
      } catch {
        if (isMounted) {
          setDetalhesError("Nao foi possivel carregar o formulario.");
        }
      } finally {
        if (isMounted) {
          setIsLoadingDetalhes(false);
        }
      }
    }

    loadDetalhes();

    return () => {
      isMounted = false;
    };
  }, [aberta]);

  const data = useMemo(() => (tab === 'recebidos' ? recebidos : enviados), [tab, recebidos, enviados]);
  const selecionada = data.find((item) => item.id === aberta) || null;
  const exibeSolicitante = tab === "recebidos";
  const perfilLabel = exibeSolicitante ? "Solicitante" : "Anunciante";
  const perfilNome = exibeSolicitante ? selecionada?.adotanteNome : selecionada?.anuncianteNome;
  const perfilEmail = exibeSolicitante ? selecionada?.adotanteEmail : selecionada?.anuncianteEmail;
  const perfilTelefone = exibeSolicitante ? selecionada?.adotanteTelefone : selecionada?.anuncianteTelefone;
  const perfilFoto = selecionada?.linkFotoPerfil || detalhes?.linkFotoPerfil;

  const formatarTempo = (value?: string) => {
    if (!value) {
      return "agora";
    }

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return "agora";
    }

    const diffMs = Date.now() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    if (diffHours < 24) {
      return `ha ${Math.max(1, diffHours)} horas`;
    }

    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    return `ha ${diffDays} dias`;
  };

  const statusLabel = (status?: string) => {
    if (!status) {
      return "Pendente";
    }

    const normalized = status.toUpperCase();
    if (normalized === "PENDENTE") {
      return "Nova";
    }

    if (normalized === "APROVADO") {
      return "Aprovada";
    }

    if (normalized === "RECUSADO") {
      return "Recusada";
    }

    return status;
  };

  if (selecionada) {
    return (
      <SafeAreaView style={styles.screen} edges={['top', 'left', 'right', 'bottom']}>
        <AppHeader title="Solicitações" onBackPress={() => router.back()} />

        <ScrollView contentContainerStyle={styles.formContent}>
          <View style={styles.formCard}>
            <Text style={styles.formSectionTitle}>{perfilLabel}</Text>
            <View style={styles.publisher}>
                {selecionada.linkFotoPerfil===null ? (
                    <View style={styles.avatar}>
                        <Ionicons name="person" size={24} color={colors.primary} />
                    </View>
                ) : (
                    <Image
                        source={{uri: selecionada.linkFotoPerfil}}
                        style={styles.publisherImage}
                    ></Image>
                )}
                <View>
                    <Text style={styles.publisherName}>
                      {perfilNome || "Nao informado"}
                    </Text>
                    <Text>
                      <Ionicons name="mail" size={14} color={colors.primary} />{" "}
                      {perfilEmail || "Nao informado"}
                    </Text>
                    <Text>
                      <Ionicons name="phone-portrait-sharp" size={14} color={colors.primary} />{" "}
                      {perfilTelefone || "Nao informado"}
                    </Text>
                </View>
            </View>
          </View>

          <View style={styles.formCard}>
            <Text style={styles.formSectionTitle}>Respostas</Text>
            {isLoadingDetalhes && (
              <View style={styles.formLoading}>
                <ActivityIndicator size="small" color={colors.primary} />
                <Text style={styles.formText}>Carregando respostas...</Text>
              </View>
            )}
            {!isLoadingDetalhes && detalhesError && (
              <Text style={styles.formText}>{detalhesError}</Text>
            )}
            {!isLoadingDetalhes && !detalhesError && detalhes?.perguntasRespostas?.length ? (
              detalhes.perguntasRespostas.map((item) => (
                <View key={item.perguntaId} style={styles.formRow}>
                  <Text style={styles.formText}>{item.perguntaTexto}</Text>
                  <Text style={styles.formAnswer}>{item.respostaTexto || "Sem resposta"}</Text>
                </View>
              ))
            ) : null}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <>
      <SafeAreaView edges={['top']} style={{ backgroundColor: '#fff' }} />
        <AppHeader title="Solicitações" onBackPress={() => router.back()} />

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
          {isLoading && (
            <View style={styles.loadingWrap}>
              {[1, 2, 3].map((i) => (
                <Skeleton.SolicitacaoCard key={i} />
              ))}
            </View>
          )}

          {!isLoading && loadError && (
            <Text style={styles.emptyText}>{loadError}</Text>
          )}

          {!isLoading && !loadError && data.length === 0 && (
            <Text style={styles.emptyText}>Nenhuma solicitacao encontrada.</Text>
          )}

          {!isLoading && !loadError && data.map((item) => (
            <View key={item.id} style={styles.card}>
              <View style={styles.cardTop}>
                <Image
                  source={{ uri: item.petFoto || "https://images.unsplash.com/photo-1517849845537-4d257902454a?w=1200" }}
                  style={styles.petImage}
                />
                <View style={{ alignItems: 'flex-end' }}>
                  <View style={[styles.statusBadge, item.status?.toUpperCase() === "PENDENTE" ? styles.statusNew : styles.statusPending]}>
                    <Text style={styles.statusText}>{statusLabel(item.status)}</Text>
                  </View>
                  <Text style={styles.timeText}>{formatarTempo(item.dataSolicitacao)}</Text>
                </View>
              </View>

              <Text style={styles.petName}>{item.petNome || "Pet sem nome"}</Text>
              <Text style={styles.requesterLabel}>{tab === "recebidos" ? "Dados do solicitante" : "Dados do anunciante"}</Text>

              <View style={styles.requesterRow}>
                {item.linkFotoPerfil===null ? (
                    <View style={styles.avatar}>
                        <Ionicons name="person" size={24} color={colors.primary} />
                    </View>
                ) : (
                    <Image
                        source={{uri: item.linkFotoPerfil}}
                        style={styles.publisherImage}
                    ></Image>
                )}
                <View>
                  <Text style={styles.requesterText}>{tab === "recebidos" ? (item.adotanteNome || "Nao informado") : (item.anuncianteNome || "Nao informado")}</Text>
                  <Text style={styles.requesterSub}>{tab === "recebidos" ? (item.adotanteEmail || "Nao informado") : (item.anuncianteEmail || "Nao informado")}</Text>
                  <Text style={styles.requesterSub}>{tab === "recebidos" ? (item.adotanteTelefone || "Nao informado") : (item.anuncianteTelefone || "Nao informado")}</Text>
                </View>
              </View>

              <TouchableOpacity style={styles.viewButton} onPress={() => setAberta(item.id)}>
                <Text style={styles.viewButtonText}>Ver formulario</Text>
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
    paddingTop: 100,
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
    marginTop: 20,
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
    zIndex: 10,
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
  loadingWrap: {
    width: '100%',
    alignItems: "center",
    gap: 6,
    marginTop: 16,
  },
  loadingText: {
    fontSize: 13,
    color: '#666',
    fontWeight: '600',
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
    width: 82,
    height: 64,
    borderRadius: 12,
    backgroundColor: '#eee',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 4,
  },
  statusNew: {
    backgroundColor: '#eaf8f0',
  },
  statusPending: {
    backgroundColor: '#fff3e0',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#333',
  },
  timeText: {
    fontSize: 11,
    color: '#8a8a8a',
  },
  petName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#333',
    marginBottom: 6,
  },
  requesterLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#666',
    marginBottom: 6,
  },
  requesterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  userImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#eee',
  },
  requesterText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333',
  },
  requesterSub: {
    fontSize: 12,
    color: '#8a8a8a',
  },
  viewButton: {
    marginTop: 10,
    backgroundColor: '#fff1f0',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  viewButtonText: {
    color: colors.primary,
    fontWeight: '700',
    fontSize: 13,
  },
  formContent: {
    paddingTop: 16,
    paddingBottom: 28,
    gap: 12,
  },
  formCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ebedf0',
  },
  formSectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#333',
    marginBottom: 8,
  },
  formText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: "bold",
    marginBottom: 6,
  },
  formRow: {
    marginBottom: 10,
    backgroundColor: '#e4e2e277',
    padding: 10,
    borderRadius: 10,
  },
  formAnswer: {
    fontSize: 13,
    color: '#666',
    backgroundColor: '#ffffff',
    padding: 8,
    borderRadius: 8,
    marginTop: 4,
  },
  formLoading: {
    alignItems: "flex-start",
    gap: 6,
  },
  emptyText: {
    textAlign: 'center',
    color: '#888',
    fontSize: 16,
    marginTop: 40,
  },
    publisher: {
        marginTop: 4,
        backgroundColor: "#F7F7F7",
        borderRadius: 16,
        padding: 12,
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
    publisherImage: {
        width: 46,
        height: 46,
        borderRadius: 12,
    },
    publisherLabel: {
        fontSize: 12,
        color: "#666",
    },
    publisherName: {
        fontSize: 15,
        fontWeight: "700",
        color: "#222",
    },
    chatButton: {
        marginLeft: "auto",
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#FFE9E6",
        justifyContent: "center",
        alignItems: "center",
    },
    avatar: {
        width: 58,
        height: 58,
        borderRadius: 18,
        backgroundColor: "#FFE5E2",
        alignItems: "center",
        justifyContent: "center",
    },
});
