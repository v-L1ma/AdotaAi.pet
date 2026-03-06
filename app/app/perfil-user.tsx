import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import { Image, SafeAreaView, Text, TextInput, TouchableOpacity, Pressable, View, TouchableHighlight } from "react-native";
import styles from "../styles/AppStyles";
import Icon1 from "react-native-vector-icons/Ionicons";

export default function UserScreen() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [telefone, setTelefone] = useState("");
    const [senha, setSenha] = useState("");
    const [moradia, setMoradia] = useState("");
    const [metragem, setMetragem] = useState("");
    const [image, setImage] = useState<string | undefined>(undefined);

    const handleSave = () => {
        alert("Dados salvos!");
    };
    const pickImage = async () => {
        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });
        if (!result.canceled && result.assets && result.assets.length > 0) {
            setImage(result.assets[0].uri);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={[styles.square, { position: "relative", alignItems: "center" }]}> 
                <View style={{ alignItems: "center", marginTop: -50, marginBottom: 0 }}>
                    <Pressable
                        style={{
                            width: 120,
                            height: 120,
                            borderRadius: 60,
                            backgroundColor: "#ebeaeaff",
                            alignItems: "center",
                            justifyContent: "center",
                            borderWidth: 5,
                            borderColor: "#fff",
                            overflow: "hidden",
                        }}
                        onPress={pickImage}
                    >
                        {image ? (
                            <Image source={{ uri: image }} style={{ width: 100, height: 100, borderRadius: 60 }} />
                        ) : (
                            <Icon1 name="image" size={40} color="#868585ff" />
                        )}
                    </Pressable>
                </View>
                <View style={{ marginTop: 5, width: "90%", alignItems: "center" }}>
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