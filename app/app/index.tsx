import { useRouter } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import styles from "../styles/AppStyles";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.bottomCircle} />
      <Text style={styles.title}>Adotaí</Text>
      <Text style={styles.subtitle}>Encontre seu melhor amigo aqui!</Text>

      <TouchableOpacity
        style={styles.buttonArea}
        onPress={() => router.push("/login")}
      >
        <Text style={styles.buttonText}>Entre</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.buttonArea2}
        onPress={() => router.push("/cadastro")}
      >
        <Text style={styles.buttonText}>Crie sua conta</Text>
      </TouchableOpacity>
    </View>
  );
}
