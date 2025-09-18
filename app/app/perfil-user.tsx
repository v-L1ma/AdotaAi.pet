import React, { useState } from "react";
import { SafeAreaView, Text, TextInput, TouchableOpacity, View } from "react-native";
import styles from "../styles/AppStyles";

export default function UserScreen() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [telefone, setTelefone] = useState("");
    const [senha, setSenha] = useState("");
    const [moradia, setMoradia] = useState("");
    const [metragem, setMetragem] = useState("");

    const handleSave = () => {
        alert("Dados salvos!");
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={[styles.square, { position: "relative", alignItems: "center" }]}>
                <View
                    style={{
                        width: "32%",
                        height: "17%",
                        backgroundColor: "#b3b2b2ff",
                        borderRadius: 100,
                        position: "absolute",
                        top: -50,
                        borderWidth: 2,
                        borderColor: "#fff",
                    }}
                />
                <View style={{ marginTop: 20, width: "90%", alignItems: "center" }}>
                    <Text style={styles.inputText2}>Usuário</Text>
                    <TextInput
                        style={styles.inputPerfil}
                        value={username}
                        onChangeText={setUsername}
                        placeholder="Digite seu nome"
                    />
                    <Text style={styles.inputText2}>E-mail</Text>
                    <TextInput
                        style={styles.inputPerfil}
                        value={email}
                        onChangeText={setEmail}
                        placeholder="exemplo@gmail.com"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        editable={false}
                    />
                    <Text style={styles.inputText2}>Telefone</Text>
                    <TextInput
                        style={styles.inputPerfil}
                        value={telefone}
                        onChangeText={setTelefone}
                        placeholder="(00)-00000-0000"
                    />
                    <Text style={styles.inputText2}>Senha</Text>
                    <TextInput
                        style={styles.inputPerfil}
                        value={senha}
                        onChangeText={setSenha}
                        placeholder="Digite sua senha"
                        secureTextEntry
                    />
                    <Text style={styles.inputText2}>Moradia</Text>
                    <TextInput
                        style={styles.inputPerfil}
                        value={moradia}
                        onChangeText={setMoradia}
                        placeholder="Digite seu endereço..."
                    />
                    <Text style={styles.inputText2}>Metragem</Text>
                    <TextInput
                        style={styles.inputPerfil}
                        value={metragem}
                        onChangeText={setMetragem}
                        placeholder="Digite a metragem..."
                    />
                    <TouchableOpacity style={styles.buttonSave} onPress={handleSave}>
                        <Text style={styles.buttonText}>Salvar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}