import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { SafeAreaView, Text, TextInput, Image, TouchableOpacity, KeyboardAvoidingView, View, Platform, Animated, Easing } from "react-native";
import styles from "../styles/AppStyles";

export default function CadastroScreen() {
  const slideAnim = useRef(new Animated.Value(1000)).current;
  const { register, isLoading } = useAuth();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [cpfCnpj, setCpfCnpj] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 50,
      duration: 800,
      easing: Easing.out(Easing.exp),
      useNativeDriver: true,
    }).start();
  }, [slideAnim]);

  const handleCadastro = async () => {
    setErro(null);

    const nomeNormalizado = nome.trim();
    const emailNormalizado = email.trim().toLowerCase();
    const cpfCnpjNormalizado = cpfCnpj.trim();

    if (!nomeNormalizado || !emailNormalizado || !cpfCnpjNormalizado || !senha.trim() || !confirmarSenha.trim()) {
      setErro("Preencha todos os campos.");
      return;
    }

    if (senha !== confirmarSenha) {
      setErro("A confirmacao de senha nao confere.");
      return;
    }

    const result = await register({
      nome: nomeNormalizado,
      email: emailNormalizado,
      cpfcnpj: cpfCnpjNormalizado,
      senha,
      confirmarSenha,
    });

    if (!result.ok) {
      setErro(result.message);
      return;
    }

    await router.replace("/login");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={styles.container}>
        <Animated.View style={{ flex: 1, width: "100%", transform: [{ translateY: slideAnim }], marginTop: 0 }}>
          <Image
            source={require("../assets/images/dog1.png")}
            style={{ width: "100%", height: "36%", alignSelf: "center", aspectRatio: 1.1, top: "5%", zIndex: 10 }}
          />
          <View style={styles.square2}>
            <Text style={styles.inputText}>Nome</Text>
            <TextInput
              style={styles.input}
              value={nome}
              onChangeText={setNome}
              placeholder="Digite seu nome"
            />

            <Text style={styles.inputText}>E-mail</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              placeholder="Digite seu e-mail"
            />

            <Text style={styles.inputText}>CPF/CNPJ</Text>
            <TextInput
              style={styles.input}
              value={cpfCnpj}
              onChangeText={setCpfCnpj}
              keyboardType="numeric"
              placeholder="Digite seu CPF ou CNPJ"
            />

            <Text style={styles.inputText}>Senha</Text>
            <TextInput
              style={styles.input}
              value={senha}
              onChangeText={setSenha}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              placeholder="Digite sua senha"
            />

            <Text style={styles.inputText}>Confirmar senha</Text>
            <TextInput
              style={styles.input}
              value={confirmarSenha}
              onChangeText={setConfirmarSenha}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              placeholder="Confirme sua senha"
            />

            {erro ? <Text style={{ color: "#b00020", marginBottom: 8 }}>{erro}</Text> : null}

            <TouchableOpacity style={styles.buttonCadastro} onPress={handleCadastro} disabled={isLoading}>
              <Text style={styles.buttonText}>{isLoading ? "Cadastrando..." : "Cadastrar"}</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}
