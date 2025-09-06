import { useRouter } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View, Image } from "react-native";
import styles from "../styles/AppStyles";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={{ alignItems: "center", marginBottom: 200 }}>
        <Image
          source={require("../assets/images/letra.png")}
          style={{ height: 250, width: 250, resizeMode: "contain", marginBottom: -50 }}
        />
        <Text style={styles.title}>Adotaí</Text>
      </View>

      <View style={styles.bottomCircle} />

      <View style={{ marginBottom: 50, alignItems: "center" }}>
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
    </View>
  );
}
