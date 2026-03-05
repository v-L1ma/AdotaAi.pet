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

export default function CadastroScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    nome: "",
    email: "",
    senha: "",
    confirmarSenha: "",
    telefone: "",
    cpfcnpj: "",
    endereco: "",
    cep: "",
    bairro: "",
    cidade: "",
    sg_estado: "",
    link_foto: "",
  });

  const set = (field: string) => (value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleCadastro = async () => {
    if (!form.nome || !form.email || !form.senha || !form.telefone || !form.cpfcnpj) {
      Alert.alert("Erro", "Preencha todos os campos obrigatórios (*).");
      return;
    }

    if (form.senha !== form.confirmarSenha) {
      Alert.alert("Erro", "As senhas não coincidem.");
      return;
    }

    if (form.senha.length < 6) {
      Alert.alert("Erro", "A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        nome: form.nome,
        email: form.email,
        senha: form.senha,
        telefone: form.telefone,
        cpfcnpj: form.cpfcnpj,
        endereco: form.endereco || " ",
        cep: form.cep || " ",
        bairro: form.bairro || " ",
        cidade: form.cidade || " ",
        sg_estado: form.sg_estado || " ",
        link_foto: form.link_foto || " ",
      };

      const response = await fetch(`${API_URL}/usuario`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok || response.status === 201) {
        Alert.alert("Sucesso", "Cadastro realizado com sucesso!", [
          { text: "OK", onPress: () => router.push("/login") },
        ]);
      } else {
        const text = await response.text();
        Alert.alert("Erro", text || "Não foi possível realizar o cadastro.");
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
        <Text style={styles.title}>Criar conta</Text>
        <Text style={styles.subtitle}>Preencha seus dados para se cadastrar</Text>

        <View style={styles.form}>
          <Text style={styles.label}>Nome *</Text>
          <TextInput
            style={styles.input}
            placeholder="Seu nome completo"
            placeholderTextColor="#aaa"
            value={form.nome}
            onChangeText={set("nome")}
          />

          <Text style={styles.label}>E-mail *</Text>
          <TextInput
            style={styles.input}
            placeholder="seu@email.com"
            placeholderTextColor="#aaa"
            autoCapitalize="none"
            keyboardType="email-address"
            value={form.email}
            onChangeText={set("email")}
          />

          <Text style={styles.label}>CPF/CNPJ *</Text>
          <TextInput
            style={styles.input}
            placeholder="000.000.000-00"
            placeholderTextColor="#aaa"
            keyboardType="numeric"
            value={form.cpfcnpj}
            onChangeText={set("cpfcnpj")}
          />

          <Text style={styles.label}>Telefone *</Text>
          <TextInput
            style={styles.input}
            placeholder="(00) 00000-0000"
            placeholderTextColor="#aaa"
            keyboardType="phone-pad"
            value={form.telefone}
            onChangeText={set("telefone")}
          />

          <Text style={styles.label}>Senha *</Text>
          <TextInput
            style={styles.input}
            placeholder="Mínimo 6 caracteres"
            placeholderTextColor="#aaa"
            secureTextEntry
            value={form.senha}
            onChangeText={set("senha")}
          />

          <Text style={styles.label}>Confirmar senha *</Text>
          <TextInput
            style={styles.input}
            placeholder="Repita a senha"
            placeholderTextColor="#aaa"
            secureTextEntry
            value={form.confirmarSenha}
            onChangeText={set("confirmarSenha")}
          />

          <Text style={styles.sectionTitle}>Endereço</Text>

          <Text style={styles.label}>CEP</Text>
          <TextInput
            style={styles.input}
            placeholder="00000-000"
            placeholderTextColor="#aaa"
            keyboardType="numeric"
            value={form.cep}
            onChangeText={set("cep")}
          />

          <Text style={styles.label}>Endereço</Text>
          <TextInput
            style={styles.input}
            placeholder="Rua, número, complemento"
            placeholderTextColor="#aaa"
            value={form.endereco}
            onChangeText={set("endereco")}
          />

          <Text style={styles.label}>Bairro</Text>
          <TextInput
            style={styles.input}
            placeholder="Bairro"
            placeholderTextColor="#aaa"
            value={form.bairro}
            onChangeText={set("bairro")}
          />

          <Text style={styles.label}>Cidade</Text>
          <TextInput
            style={styles.input}
            placeholder="Cidade"
            placeholderTextColor="#aaa"
            value={form.cidade}
            onChangeText={set("cidade")}
          />

          <Text style={styles.label}>Estado (UF)</Text>
          <TextInput
            style={styles.input}
            placeholder="SP"
            placeholderTextColor="#aaa"
            maxLength={2}
            autoCapitalize="characters"
            value={form.sg_estado}
            onChangeText={set("sg_estado")}
          />

          <Text style={styles.label}>Foto de perfil (URL)</Text>
          <TextInput
            style={styles.input}
            placeholder="https://..."
            placeholderTextColor="#aaa"
            autoCapitalize="none"
            value={form.link_foto}
            onChangeText={set("link_foto")}
          />

          <TouchableOpacity
            style={styles.button}
            onPress={handleCadastro}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#7e130a" />
            ) : (
              <Text style={styles.buttonText}>Cadastrar</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.link}
            onPress={() => router.push("/login")}
          >
            <Text style={styles.linkText}>Já tenho conta — Entrar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.link}
            onPress={() => router.push("/")}
          >
            <Text style={styles.linkText}>Voltar</Text>
          </TouchableOpacity>
        </View>
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
    padding: 24,
    paddingTop: 60,
  },
  title: {
    fontFamily: "Georgia",
    fontSize: 32,
    fontWeight: "bold",
    color: "#7e130a",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#7e130a",
    marginBottom: 24,
  },
  form: {
    width: "100%",
    gap: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#7e130a",
    marginTop: 12,
    marginBottom: 4,
  },
  label: {
    fontSize: 13,
    color: "#7e130a",
    fontWeight: "600",
    marginTop: 4,
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
    marginTop: 16,
  },
  buttonText: {
    color: "#7e130a",
    fontSize: 16,
    fontWeight: "bold",
  },
  link: {
    alignItems: "center",
    marginTop: 8,
  },
  linkText: {
    color: "#7e130a",
    fontSize: 14,
    fontWeight: "600",
    textDecorationLine: "underline",
  },
});
