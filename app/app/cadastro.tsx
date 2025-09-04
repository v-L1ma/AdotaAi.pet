import { useRouter } from "expo-router";
import React from "react";
import { Image } from "react-native";
import { SafeAreaView, Text, TextInput, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/AntDesign";
import styles from "../styles/AppStyles";

export default function CadastroScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>

      <Image
          source={require("../assets/images/dog1.png")}
          style={{ width: "100%", height: "35%", alignSelf: "center", top: 41, zIndex: 10}}
        />

          <View style={styles.square}> 
            <Text style={styles.inputText}>E-mail</Text>
            <TextInput style={styles.input} />
    
            <Text style={styles.inputText}>Senha</Text>
            <TextInput style={styles.input} secureTextEntry />

            <Text style={styles.inputText}>Confirmar senha</Text>
            <TextInput style={styles.input} secureTextEntry />
    
            <TouchableOpacity style={styles.buttonLogin} onPress={() => router.push("/Home")}>
              <Text style={styles.buttonText}>Cadastrar</Text>
            </TouchableOpacity>
    
          </View>
        </SafeAreaView>
  );
}
