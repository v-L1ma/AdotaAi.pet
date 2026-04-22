import React, { useEffect, useRef } from "react";
import { SafeAreaView, Text, TextInput, Image, TouchableOpacity, KeyboardAvoidingView, View, Platform, Animated, Easing } from "react-native";
import styles from "../styles/AppStyles";
import { useTabNavigation } from "@/hooks/useTabNavigation";

export default function CadastroScreen() {
  const { navigateToTab } = useTabNavigation();
  const slideAnim = useRef(new Animated.Value(1000)).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 50,
      duration: 800,
      easing: Easing.out(Easing.exp),
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={styles.container}>
        <Animated.View style={{ flex: 1, width: "100%", transform: [{ translateY: slideAnim }], marginTop: 0 }}>
          <Image
            source={require("../assets/images/dog1.png")}
            style={{ width: "100%", height: "36%", alignSelf: "center", aspectRatio: 1.1, top: "5%", zIndex: 10 }}
          />
          <View style={styles.square2}>
            <Text style={styles.inputText}>E-mail</Text>
            <TextInput style={styles.input} />

            <Text style={styles.inputText}>Senha</Text>
            <TextInput style={styles.input} secureTextEntry />

            <Text style={styles.inputText}>Confirmar senha</Text>
            <TextInput style={styles.input} secureTextEntry />

            <TouchableOpacity style={styles.buttonLogin} onPress={() => navigateToTab("/home")}>
              <Text style={styles.buttonText}>Cadastrar</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}