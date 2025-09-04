import React, { useEffect, useRef } from "react";
import { SafeAreaView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import { Image } from "react-native";
import { Animated, Easing } from "react-native";
import Icon1 from "react-native-vector-icons/AntDesign";
//import Icon2 from "react-native-vector-icons/MaterialIcons";
import styles from "../styles/AppStyles";

export default function LoginScreen() {
  const router = useRouter();
  const slideAnim = useRef(new Animated.Value(1000)).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 130,
      duration: 800,
      easing: Easing.out(Easing.exp),
      useNativeDriver: true,
    }).start();
  }, []);


  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={{ flex: 1, width: "100%", transform: [{ translateY: slideAnim }], }}>
        {/* <Icon2 name="pets" size={30} color="rgba(255, 255, 255, 1)" style={{ position: "absolute", top: "30%", left: "90%", transform: [{ rotate: "-20deg" }]}}/>*/}

        <Image
          source={require("../assets/images/cat1.png")}
          style={{ width: "100%", height: "21%", alignSelf: "center", top: 50, zIndex: 10 }}
        />

        <View style={styles.square}>
          <Text style={styles.inputText}>E-mail</Text>
          <TextInput style={styles.input} />

          <Text style={styles.inputText}>Senha</Text>
          <TextInput style={styles.input} secureTextEntry />

          <TouchableOpacity onPress={() => alert("Em desenvolvimento!")}>
            <Text style={{ marginLeft: 150 }}>Esqueceu a senha?</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.buttonLogin} onPress={() => router.push("/Home")}>
            <Text style={styles.buttonText}>Entrar</Text>
          </TouchableOpacity>

          <Text style={{ marginVertical: 10 }}>Ou</Text>

          <TouchableOpacity style={styles.buttonLogin2} onPress={() => alert("Em desenvolvimento!")}>
            <Icon1 name="google" size={20} color="fff" />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push("/cadastro")}>
            <Text style={{ marginVertical: 10 }}>Não possui uma conta?</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
}
