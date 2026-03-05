import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { API_URL } from "../constants/api";

export default function EsqueciSenhaScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"email" | "reset">("email");

  const handleSolicitarToken = async () => {
    if (!email.trim()) {
      Alert.alert("Erro", "Informe seu e-mail.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/esqueci-senha`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      if (response.ok) {
        Alert.alert(
          "Token enviado",
          "Se o e-mail estiver cadastrado, você receberá um token para redefinir sua senha. Insira-o abaixo."
        );
        setStep("reset");
      } else {
        const text = await response.text();
        Alert.alert("Erro", text || "Não foi possível processar a solicitação.");
      }
    } catch {
      Alert.alert("Erro", "Não foi possível conectar ao servidor.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetarSenha = async () => {
    if (!token.trim() || !novaSenha || !confirmarSenha) {
      Alert.alert("Erro", "Preencha todos os campos.");
      return;
    }

    if (novaSenha !== confirmarSenha) {
      Alert.alert("Erro", "As senhas não coincidem.");
      return;
    }

    if (novaSenha.length < 6) {
      Alert.alert("Erro", "A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/resetar-senha`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: token.trim(), novaSenha }),
      });

      if (response.ok) {
        Alert.alert("Sucesso", "Senha redefinida com sucesso!", [
          { text: "OK", onPress: () => router.push("/login") },
        ]);
      } else {
        const text = await response.text();
        Alert.alert("Erro", text || "Token inválido ou expirado.");
      }
    } catch {
      Alert.alert("Erro", "Não foi possível conectar ao servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.bottomCircle} />

        <Text style={styles.title}>Esqueci a senha</Text>

        {step === "email" ? (
          <>
            <Text style={styles.subtitle}>
              Informe seu e-mail para receber o token de redefinição.
            </Text>
            <View style={styles.form}>
              <TextInput
                style={styles.input}
                placeholder="seu@email.com"
                placeholderTextColor="#aaa"
                autoCapitalize="none"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
              />

              <TouchableOpacity
                style={styles.button}
                onPress={handleSolicitarToken}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#7e130a" />
                ) : (
                  <Text style={styles.buttonText}>Enviar token</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.link}
                onPress={() => setStep("reset")}
              >
                <Text style={styles.linkText}>Já tenho o token</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <>
            <Text style={styles.subtitle}>
              Insira o token recebido e defina uma nova senha.
            </Text>
            <View style={styles.form}>
              <TextInput
                style={styles.input}
                placeholder="Token de redefinição"
                placeholderTextColor="#aaa"
                autoCapitalize="none"
                value={token}
                onChangeText={setToken}
              />

              <TextInput
                style={styles.input}
                placeholder="Nova senha (mínimo 6 caracteres)"
                placeholderTextColor="#aaa"
                secureTextEntry
                value={novaSenha}
                onChangeText={setNovaSenha}
              />

              <TextInput
                style={styles.input}
                placeholder="Confirmar nova senha"
                placeholderTextColor="#aaa"
                secureTextEntry
                value={confirmarSenha}
                onChangeText={setConfirmarSenha}
              />

              <TouchableOpacity
                style={styles.button}
                onPress={handleResetarSenha}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#7e130a" />
                ) : (
                  <Text style={styles.buttonText}>Redefinir senha</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.link}
                onPress={() => setStep("email")}
              >
                <Text style={styles.linkText}>Voltar para e-mail</Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        <TouchableOpacity
          style={[styles.link, { marginTop: 16 }]}
          onPress={() => router.push("/login")}
        >
          <Text style={styles.linkText}>Voltar para login</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ff6f61",
  },
  scroll: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  bottomCircle: {
    position: "absolute",
    bottom: -150,
    left: -100,
    width: 500,
    height: 500,
    borderRadius: 350,
    backgroundColor: "#fda49cff",
  },
  title: {
    fontFamily: "Georgia",
    fontSize: 32,
    fontWeight: "bold",
    color: "#7e130a",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#7e130a",
    marginBottom: 24,
    textAlign: "center",
    maxWidth: 320,
  },
  form: {
    width: "100%",
    maxWidth: 360,
    gap: 12,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    color: "#333",
  },
  button: {
    backgroundColor: "#e7e4e3",
    borderRadius: 12,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: {
    color: "#7e130a",
    fontSize: 16,
    fontWeight: "bold",
  },
  link: {
    alignItems: "center",
    marginTop: 4,
  },
  linkText: {
    color: "#7e130a",
    fontSize: 14,
    fontWeight: "600",
    textDecorationLine: "underline",
  },
});
