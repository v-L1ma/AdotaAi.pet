import React from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { useRouter } from "expo-router";
import styles from "../styles/AppStyles";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.bottomCircle} />
      <Text style={styles.title}>Adotaí</Text>
      <Text style={styles.subtitle}>Entre e encontre seu pet!</Text>

      <TouchableOpacity
        style={styles.buttonArea}
        onPress={() => router.push("/Home")}
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
