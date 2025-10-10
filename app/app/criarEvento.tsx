import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useState } from "react";
import { Image, SafeAreaView, Text, TextInput, TouchableOpacity, Pressable, View, StyleSheet, ScrollView, Dimensions } from "react-native";
import Icon1 from "react-native-vector-icons/Ionicons";
import { SelectInput, SelectOption } from "@/components/SelectInput";
import { buscarCidadesPorEstado, buscarEstados, Cidade, Estado } from "@/services/ibgeService";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { colors } from "@/styles/variables";

const tela = Dimensions.get("window")

export default function CriarAnuncioScreen() {
    
    const navigation = useNavigation();
    const [titulo, setTitulo] = useState("");
    const [endereco, setEndereco] = useState("");
    const [data, setData] = useState("");
    const [organizador, setOrganizador] = useState("");
    const [descricao, setDescricao] = useState("");
    const [image, setImage] = useState<string | undefined>(undefined);
    const [selectedEstado, setSelectedEstado] = useState<SelectOption | null>(null);
    const [estados, setEstados] = useState<Estado[]>([])
    const [selectedCidade, setSelectedCidade] = useState<SelectOption | null>(null);
    const [cidades, setCidades] = useState<Cidade[]>([])

    useEffect(()=>{
        async function carregar() {
            const estados = await buscarEstados();
            setEstados(estados);
        }

        carregar();
    }, [])

    async function handleEstadoChange(selectedOption: SelectOption){
        setSelectedEstado(selectedOption)
        const siglaEstado = selectedOption.value;
        const cidades = await buscarCidadesPorEstado(siglaEstado as string)
        setCidades(cidades)
    }

    function estadosParaOptions(estados: Estado[]): SelectOption[] {
        return estados.map((estado) => ({
            label: `${estado.nome} (${estado.sigla})`,
            value: estado.sigla,
        }));
    }

    function CidadesParaOptions(cidades: Cidade[]): SelectOption[] {
        return cidades.map((cidade) => ({
            label: `${cidade.nome}`,
            value: cidade.id,
        }));
    }

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
             <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.goBack()}
                activeOpacity={0.8}
                >
                <Ionicons name="arrow-back" size={24} color="#fda49cff" />
                <Text style={styles.backButtonText}>Voltar</Text>
            </TouchableOpacity>

            <View style={{ position:"absolute", top:tela.height*.1, marginBottom: 20, alignItems: "center", zIndex:3 }}>
                    <Pressable
                        style={{
                            width: 120,
                            height: 120,
                            borderRadius: 70,
                            backgroundColor: "#dbdbdbff",
                            alignItems: "center",
                            justifyContent: "center",
                            borderWidth: 5,
                            borderColor: "rgba(245, 245, 245, 1)",
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
            <View style={[styles.square, { position: "absolute", top: tela.height*.2, left: 0, right: 0, bottom: 0, zIndex: 0, paddingTop:tela.height*.08 }]}>

            <View style={{ flex: 1, justifyContent: "flex-start", alignItems: "center", width: "100%", zIndex: 1 }}>          

                <ScrollView contentContainerStyle={{width:tela.width*.8, alignItems: "center", paddingBottom:tela.height*.2}} showsVerticalScrollIndicator={false}>
                    <Text style={styles.inputText2}>Titulo</Text>
                    <TextInput
                        style={styles.inputPerfil}
                        value={titulo}
                        onChangeText={setTitulo}
                        placeholder="Nome do evento"
                    />

                    <Text style={styles.inputText2}>Data</Text>
                    <TextInput
                        style={styles.inputPerfil}
                        value={data}
                        onChangeText={setData}
                        placeholder="dd/mm/aaaa"
                        keyboardType="numeric"
                    />

                    <Text style={styles.inputText2}>Endereco</Text>
                    <TextInput
                        style={styles.inputPerfil}
                        value={endereco}
                        onChangeText={setEndereco}
                        placeholder="Rua XXX N0"
                    />

                    <Text style={styles.inputText2}>Estado</Text>
                    <SelectInput
                        options={estadosParaOptions(estados)}
                        selected={selectedEstado}
                        onSelect={handleEstadoChange}
                        placeholder="Escolha um estado"
                    />

                    <Text style={styles.inputText2}>Cidade</Text>
                    <SelectInput
                        options={CidadesParaOptions(cidades)}
                        selected={selectedCidade}
                        onSelect={setSelectedCidade}
                        placeholder="Escolha uma cidade"
                    />

                    <Text style={styles.inputText2}>Organizado por:</Text>
                    <TextInput
                        style={styles.inputPerfil}
                        value={organizador}
                        onChangeText={setOrganizador}
                        placeholder="Organizador do evento"
                    />

                    <Text style={styles.inputText2}>Descrição</Text>
                    <TextInput
                        style={[styles.inputPerfil, { height: 130, textAlignVertical: "top" }]}
                        value={descricao}
                        onChangeText={setDescricao}
                        placeholder="Descreva o animal..."
                        multiline
                    />
                </ScrollView>

                <View style={{ width: "100%", alignItems: "center", marginTop: 20, position: "absolute", bottom:30, left: 0 }}>
                    <TouchableOpacity style={styles.buttonCreateAd} onPress={handleSave}>
                        <Text style={styles.buttonText}>Criar anúncio</Text>
                    </TouchableOpacity>
                </View>
            </View>

            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    backButton: {
        position: "absolute",
        top: 20,
        left: 20,
        backgroundColor: "rgba(245, 245, 245, 1)",
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderRadius: 30,
        cursor:"pointer",
        zIndex:3
    },
    backButtonText: {
        color: "#fda49cff",
        fontSize: 16,
        marginLeft: 8,
        fontWeight: "600",
    },
   container: {
    flex: 1,
    backgroundColor: "#fda49cff",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingTop:60,
    marginTop:60
  },
  inputText2: {
    color: "#7a4f4bff",
    fontSize: 13,
    fontWeight: "bold",
    textAlign: "left",
    width: "100%",
  },
  square: {
    backgroundColor: "rgba(245, 245, 245, 1)",
    borderTopRightRadius: 40,
    borderTopLeftRadius:40,
    width: tela.width,
  },
  selectButton: {
    borderWidth: 1,
    borderColor: "#bbb",
    backgroundColor: "#fff",
    borderRadius: 15,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginHorizontal: 5,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 80,
  },
  buttonText: {
    color: "#634744ff",
    fontSize: 18,
    fontWeight: "bold",
  },
  inputPerfil: {
    backgroundColor: "#e9e9e9ff",
    width: "100%",
    height: "8%",
    margin: 10,
    padding: 10,
    borderRadius: 20,
  },
  buttonCreateAd: {
    backgroundColor: "#ffafa8ff",
    borderRadius: 20,
    width: "85%",
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
  },
})