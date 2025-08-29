import { useRouter } from "expo-router";
import React from "react";
import { SafeAreaView, Text, TextInput, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/AntDesign";
import styles from "../styles/AppStyles";

export default function LoginScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.square}> 
        <Text style={styles.inputText}>E-mail</Text>
        <TextInput style={styles.input} />

        <Text style={styles.inputText}>Senha</Text>
        <TextInput style={styles.input} secureTextEntry />

        <TouchableOpacity onPress={() => alert("Em desenvolvimento!")}>
        <Text style={{ marginLeft: 150}}>Esqueceu a senha?</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonLogin} onPress={() => alert("Em desenvolvimento!")}>
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>

        <Text style={{ marginVertical: 10 }}>Ou</Text>

        <TouchableOpacity style={styles.buttonLogin2} onPress={() => alert("Em desenvolvimento!")}>
          <Icon name="google" size={20} color="fff"/>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/cadastro")}>
        <Text style={{ marginVertical: 10 }}>Não possui uma conta?</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
