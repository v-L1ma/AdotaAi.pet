import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import { Image, SafeAreaView, Text, TextInput, TouchableOpacity, View } from "react-native";
import styles from "../styles/AppStyles";

export default function CriarAnuncioScreen() {
    const [nome, setNome] = useState("");
    const [idade, setIdade] = useState("");
    const [especie, setEspecie] = useState<"gato" | "cachorro" | null>(null);
    const [porte, setPorte] = useState<"pequeno" | "medio" | "grande" | null>(null);
    const [descricao, setDescricao] = useState("");
    const [image, setImage] = useState<string | undefined>(undefined);

    const handleSave = () => {
        alert("Anúncio criado!");
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
            <View style={[styles.square, { alignItems: "center", paddingBottom: 100 }]}> 
                <TouchableOpacity
                    style={{
                        width: 140,
                        height: 140,
                        borderRadius: 70,
                        backgroundColor: "#dbdbdbff",
                        alignItems: "center",
                        justifyContent: "center",
                        borderWidth: 2,
                        borderColor: "#bbb",
                        overflow: "hidden",
                    }}
                    onPress={pickImage}
                    activeOpacity={0.7}
                >
                    {image ? (
                        <Image source={{ uri: image }} style={{ width: 140, height: 140, borderRadius: 70 }} />
                    ) : (
                        <Text style={{ color: "#888", fontSize: 40 }}>📷</Text>
                    )}
                </TouchableOpacity>

                <Text style={styles.inputText2}>Nome</Text>
                <TextInput
                    style={styles.inputPerfil}
                    value={nome}
                    onChangeText={setNome}
                    placeholder="Nome do animal"
                />

                <Text style={styles.inputText2}>Idade</Text>
                <TextInput
                    style={styles.inputPerfil}
                    value={idade}
                    onChangeText={setIdade}
                    placeholder="Idade do animal"
                    keyboardType="numeric"
                />

                <Text style={styles.inputText2}>Espécie</Text>
                <View style={{ flexDirection: "row", width: "105%", marginBottom: 12, justifyContent: "flex-start" }}>
                    <TouchableOpacity
                        style={[styles.selectButton, especie === "gato" && { backgroundColor: "#bbb" }]}
                        onPress={() => setEspecie("gato")}
                    >
                        <Text style={styles.buttonText}>Gato</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.selectButton, especie === "cachorro" && { backgroundColor: "#bbb" }]}
                        onPress={() => setEspecie("cachorro")}
                    >
                        <Text style={styles.buttonText}>Cachorro</Text>
                    </TouchableOpacity>
                </View>

                <Text style={styles.inputText2}>Porte</Text>
                <View style={{ flexDirection: "row", width: "105%", marginBottom: 12, justifyContent: "flex-start" }}>
                    <TouchableOpacity
                        style={[styles.selectButton, porte === "pequeno" && { backgroundColor: "#bbb" }]}
                        onPress={() => setPorte("pequeno")}
                    >
                        <Text style={styles.buttonText}>Pequeno</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.selectButton, porte === "medio" && { backgroundColor: "#bbb" }]}
                        onPress={() => setPorte("medio")}
                    >
                        <Text style={styles.buttonText}>Médio</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.selectButton, porte === "grande" && { backgroundColor: "#bbb" }]}
                        onPress={() => setPorte("grande")}
                    >
                        <Text style={styles.buttonText}>Grande</Text>
                    </TouchableOpacity>
                </View>

                <Text style={styles.inputText2}>Descrição</Text>
                <TextInput
                    style={[styles.inputPerfil, { height: 150, textAlignVertical: "top" }]}
                    value={descricao}
                    onChangeText={setDescricao}
                    placeholder="Descreva o animal..."
                    multiline
                />

                <TouchableOpacity style={styles.buttonLogin} onPress={handleSave}>
                    <Text style={styles.buttonText}>Criar anúncio</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}