import React, { useEffect, useRef, useState } from "react";
import { SafeAreaView, Text, TextInput, TouchableOpacity, View, KeyboardAvoidingView, Platform } from "react-native";
import { Image } from "react-native";
import { Animated, Easing } from "react-native";
import Icon1 from "react-native-vector-icons/AntDesign";
import styles from "../styles/AppStyles";
import { useAuth } from "../hooks/useAuth";
import { router } from "expo-router";

export default function LoginScreen() {
  const slideAnim = useRef(new Animated.Value(1000)).current;
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 60,
      duration: 800,
      easing: Easing.out(Easing.exp),
      useNativeDriver: true,
    }).start();
  }, [slideAnim]);

  const handleLogin = async () => {
    setErro(null);

    const emailNormalizado = email.trim().toLowerCase();

    if (!emailNormalizado || !senha.trim()) {
      setErro("Preencha e-mail e senha.");
      return;
    }

    const result = await login({
      email: emailNormalizado,
      senha,
    });

    if (!result.ok) {
      setErro(result.message);
      return;
    }

    router.replace("/Home");
  };


  return (

    <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >

    <SafeAreaView style={styles.container}>
      <Animated.View style={{ flex: 1, width: "100%", transform: [{ translateY: slideAnim }], }}>
        {/* <Icon2 name="pets" size={30} color="rgba(255, 255, 255, 1)" style={{ position: "absolute", top: "30%", left: "90%", transform: [{ rotate: "-20deg" }]}}/>*/}

        <Image
          source={require("../assets/images/cat1.png")}
          style={{ width: "100%", height: "21%", alignSelf: "center", aspectRatio: 2.0, top: "6%", zIndex: 10 }}
        />

        <View style={styles.square}>
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

          {erro ? <Text style={{ color: "#b00020", marginBottom: 8 }}>{erro}</Text> : null}

          <TouchableOpacity onPress={() => alert("Em desenvolvimento!")}>
            <Text style={{ marginLeft: 150 }}>Esqueceu a senha?</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.buttonLogin} onPress={handleLogin} disabled={isLoading}>
            <Text style={styles.buttonText}>{isLoading ? "Entrando..." : "Entrar"}</Text>
          </TouchableOpacity>

          <Text style={{ marginVertical: 10 }}>Ou</Text>

          <TouchableOpacity style={styles.buttonLogin2} onPress={() => alert("Em desenvolvimento!")}>
            <Icon1 name="google" size={20} color="fff" />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.replace("/cadastro")}>
            <Text style={{ marginVertical: 10 }}>Não possui uma conta?</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </SafeAreaView>
    </KeyboardAvoidingView>
  );
}
