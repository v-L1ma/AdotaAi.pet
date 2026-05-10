import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AppHeader from "@/components/AppHeader";
import { colors } from "@/styles/variables";
import adminService, { type UsuarioAdminDTO } from "@/services/adminService";

export default function GerenciarUsuariosScreen() {
  const router = useRouter();
  const [usuarios, setUsuarios] = useState<UsuarioAdminDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  const loadUsuarios = useCallback(async () => {
    try {
      const data = await adminService.listarUsuarios();
      setUsuarios(data);
    } catch (error) {
      console.error("Erro ao carregar usuários:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsuarios();
  }, [loadUsuarios]);

  const handleAtivar = async (usuarioId: string) => {
    setIsProcessing(true);
    try {
      await adminService.ativarUsuario(usuarioId);
      setUsuarios((prev) =>
        prev.map((u) => (u.id === usuarioId ? { ...u, fl_ativo: true } : u))
      );
    } catch (error) {
      console.error("Erro ao ativar usuário:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDesativar = async (usuarioId: string) => {
    setIsProcessing(true);
    try {
      await adminService.desativarUsuario(usuarioId);
      setUsuarios((prev) =>
        prev.map((u) => (u.id === usuarioId ? { ...u, fl_ativo: false } : u))
      );
    } catch (error) {
      console.error("Erro ao desativar usuário:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const getRoleLabel = (cargo: string) => {
    switch (cargo) {
      case "USUARIO":
        return "Usuário";
      case "ONG":
        return "ONG";
      case "ADMINISTRADOR":
        return "Administrador";
      default:
        return cargo;
    }
  };

  const getRoleBadgeColor = (cargo: string) => {
    switch (cargo) {
      case "ONG":
        return "#4CAF50";
      case "ADMINISTRADOR":
        return colors.primary;
      default:
        return "#8A8A8A";
    }
  };

  const renderUsuario = ({ item }: { item: UsuarioAdminDTO }) => (
    <View style={styles.card}>
      <View style={styles.avatarContainer}>
        {item.link_foto ? (
          <Image source={{ uri: item.link_foto }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Ionicons name="person" size={24} color={colors.textMuted} />
          </View>
        )}
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.userName}>{item.nome}</Text>
        <Text style={styles.userEmail}>{item.email}</Text>
        <View style={styles.statusContainer}>
          <View
            style={[
              styles.statusDot,
              { backgroundColor: item.fl_ativo ? "#4CAF50" : "#A31A14" },
            ]}
          />
          <Text
            style={[
              styles.statusText,
              { color: item.fl_ativo ? "#4CAF50" : "#A31A14" },
            ]}
          >
            {item.fl_ativo ? "Ativo" : "Inativo"}
          </Text>
        </View>
      </View>
      <View style={styles.cardActions}>
        {item.fl_ativo ? (
          <TouchableOpacity
            style={styles.desativarButton}
            onPress={() => handleDesativar(item.id)}
            disabled={isProcessing}
          >
            <Ionicons name="power" size={20} color="#A31A14" />
            <Text style={styles.desativarButtonText}>Desativar</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.ativarButton}
            onPress={() => handleAtivar(item.id)}
            disabled={isProcessing}
          >
            <Ionicons name="power" size={20} color="#fff" />
            <Text style={styles.ativarButtonText}>Ativar</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.screen}>
        <AppHeader title="Gerenciar Usuários" onBackPress={() => router.back()} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      <AppHeader title="Gerenciar Usuários" onBackPress={() => router.back()} />
      <FlatList
        data={usuarios}
        renderItem={renderUsuario}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="people-outline" size={64} color={colors.textMuted} />
            <Text style={styles.emptyText}>Nenhum usuário encontrado</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.surface,
    paddingTop: 50,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  list: {
    padding: 16,
  },
  card: {
    flexDirection: "row",
    backgroundColor: colors.surfaceLowest,
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#ECECEC",
    alignItems: "center",
  },
  avatarContainer: {
    marginRight: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  cardContent: {
    flex: 1,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  userName: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.text,
  },
  roleBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  roleText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "600",
  },
  userEmail: {
    fontSize: 14,
    color: colors.textMuted,
    marginTop: 2,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    gap: 4,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  cardActions: {
    marginLeft: 8,
  },
  ativarButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4CAF50",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 4,
  },
  ativarButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  desativarButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFE7E5",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 4,
    borderWidth: 1,
    borderColor: "#FFCDC9",
  },
  desativarButtonText: {
    color: "#A31A14",
    fontSize: 14,
    fontWeight: "600",
  },
  emptyContainer: {
    alignItems: "center",
    marginTop: 60,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textMuted,
    marginTop: 12,
  },
});