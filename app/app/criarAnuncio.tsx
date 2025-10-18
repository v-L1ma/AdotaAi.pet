import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import { Image, Pressable, SafeAreaView, Text, TextInput, TouchableOpacity, View } from "react-native";
import Icon1 from "react-native-vector-icons/Ionicons";
import AppHeader from '../components/AppHeader';
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
                <>
                    <AppHeader title="Criar Anúncio" />

                    <SafeAreaView style={styles.container}>
                        <View style={[styles.square, { position: "absolute", top: 175, left: 0, right: 0, bottom: 0, zIndex: 0 }]} />

                        <View style={{ flex: 1, justifyContent: "flex-start", alignItems: "center", width: "100%", zIndex: 1 }}>

                <View style={{ marginTop: 120, marginBottom: 20, alignItems: "center", width: "100%" }}>
                    <Pressable
                        style={{
                            width: 120,
                            height: 120,
                            borderRadius: 70,
                            backgroundColor: "#dbdbdbff",
                            alignItems: "center",
                            justifyContent: "center",
                            borderWidth: 5,
                            borderColor: "#ffffffff",
                            overflow: "hidden",
                        }}
                        onPress={pickImage}
                    >
                        {image ? (
                            <Image source={{ uri: image }} style={{ width: 140, height: 140, borderRadius: 70 }} />
                        ) : (
                            <Icon1 name="image" size={40} color="#888" />
                        )}
                    </Pressable>
                </View>

                <View style={{ width: "85%", alignItems: "center" }}>
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
                    <View style={{ flexDirection: "row", width: "100%", marginBottom: 12, justifyContent: "flex-start" }}>
                        <TouchableOpacity
                            style={[styles.selectButton, especie === "gato" && { backgroundColor: "#ffafa8ff" }]}
                            onPress={() => setEspecie("gato")}
                        >
                            <Text style={styles.buttonText}>Gato</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.selectButton, especie === "cachorro" && { backgroundColor: "#ffafa8ff" }]}
                            onPress={() => setEspecie("cachorro")}
                        >
                            <Text style={styles.buttonText}>Cachorro</Text>
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.inputText2}>Porte</Text>
                    <View style={{ flexDirection: "row", width: "100%", marginBottom: 12, justifyContent: "center" }}>
                        <TouchableOpacity
                            style={[styles.selectButton, porte === "pequeno" && { backgroundColor: "#ffafa8ff" }]}
                            onPress={() => setPorte("pequeno")}
                        >
                            <Text style={styles.buttonText}>Pequeno</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.selectButton, porte === "medio" && { backgroundColor: "#ffafa8ff" }]}
                            onPress={() => setPorte("medio")}
                        >
                            <Text style={styles.buttonText}>Médio</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.selectButton, porte === "grande" && { backgroundColor: "#ffafa8ff" }]}
                            onPress={() => setPorte("grande")}
                        >
                            <Text style={styles.buttonText}>Grande</Text>
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.inputText2}>Descrição</Text>
                    <TextInput
                        style={[styles.inputPerfil, { height: 130, textAlignVertical: "top" }]}
                        value={descricao}
                        onChangeText={setDescricao}
                        placeholder="Descreva o animal..."
                        multiline
                    />
                </View>

                <View style={{ width: "100%", alignItems: "center", marginTop: 20, position: "absolute", bottom: 20, left: 0 }}>
                    <TouchableOpacity style={styles.buttonCreateAd} onPress={handleSave}>
                        <Text style={styles.buttonText}>Criar anúncio</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
        </>
    );
}