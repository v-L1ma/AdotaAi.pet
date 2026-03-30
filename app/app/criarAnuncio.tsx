import React, { useState } from "react";
import { SafeAreaView, Text, TextInput, TouchableOpacity, View, Alert, Platform, Pressable } from "react-native";
import styles from "../styles/AppStyles";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { useCreatePet } from "../hooks/useCreatePet";

const criarAnuncioSchema = z.object({
    nome: z.string().trim().min(2, "Nome deve ter pelo menos 2 caracteres"),
    dt_nasc: z
        .string()
        .trim()
        .refine((valor) => !Number.isNaN(Date.parse(valor)), "Informe uma data de nascimento valida")
        .refine((valor) => new Date(valor) <= new Date(), "Data de nascimento nao pode ser no futuro"),
    especie: z.enum(["gato", "cachorro"], {
        message: "Selecione a especie",
    }),
    porte: z.enum(["pequeno", "medio", "grande"], {
        message: "Selecione o porte",
    }),
    raca: z.string().trim().min(2, "Raca deve ter pelo menos 2 caracteres"),
    descricao: z.string().trim().min(10, "Descricao deve ter pelo menos 10 caracteres"),
});

type CriarAnuncioFormData = z.infer<typeof criarAnuncioSchema>;

export default function CriarAnuncioScreen() {
    const [showDatePicker, setShowDatePicker] = useState(false);
    const { createPet, isCreating } = useCreatePet();

    const {
        control,
        handleSubmit,
        setValue,
        watch,
        reset,
        formState: { errors },
    } = useForm<CriarAnuncioFormData>({
        resolver: zodResolver(criarAnuncioSchema),
        defaultValues: {
            nome: "",
            dt_nasc: "",
            especie: undefined,
            porte: undefined,
            raca: "",
            descricao: "",
        },
    });

    const especieSelecionada = watch("especie");
    const porteSelecionado = watch("porte");
    const dataNascimento = watch("dt_nasc");

    const onDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
        setShowDatePicker(false);

        if (event.type === "dismissed" || !selectedDate) {
            return;
        }

        setValue("dt_nasc", selectedDate.toISOString(), { shouldValidate: true });
    };

    const formatarData = (value: string) => {
        if (!value) {
            return "Selecionar data";
        }

        const date = new Date(value);
        if (Number.isNaN(date.getTime())) {
            return "Selecionar data";
        }

        return date.toLocaleDateString("pt-BR");
    };

    const formatarDataWebInput = (value: string) => {
        if (value.length === 10) {
            if(Number.isNaN(value)) {
                return "";
            }

            const date = new Date(value);
            if (Number.isNaN(date.getTime())) {
                return "";
            }
    
            return date.toISOString().slice(0, 10);
        }

    };

    const onWebDateChange = (rawDate: string) => {
        if(rawDate.length === 10) {
             const isoDate = new Date(`${rawDate}T12:00:00`).toISOString();
            setValue("dt_nasc", isoDate, { shouldValidate: true });
        }
    };

    const handleSave = async (data: CriarAnuncioFormData) => {
        try {
            await createPet(data);

            Alert.alert("Sucesso", "Anuncio criado com sucesso!");
            reset();
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Falha ao criar anuncio";
            Alert.alert("Erro", errorMessage);
        }
    };

    const renderError = (message?: string) =>
        message ? <Text style={{ color: "#b00020", marginBottom: 8, width: "100%" }}>{message}</Text> : null;

    const datePickerButtonStyle = {
        backgroundColor: "#f3f2f2ff",
        width: "105%" as const,
        minHeight: 44,
        margin: 10,
        paddingHorizontal: 10,
        borderRadius: 20,
        justifyContent: "center" as const,
    };

    return (
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
                        // onPress={pickImage}
                    >
                        {/* {image ? (
                            <Image source={{ uri: image }} style={{ width: 140, height: 140, borderRadius: 70 }} />
                        ) : (
                            <Icon1 name="image" size={40} color="#888" />
                        )} */}
                    </Pressable>
                </View>

                <View style={{ width: "85%", alignItems: "center" }}>
                    <Text style={styles.inputText2}>Nome</Text>
                    <Controller
                        control={control}
                        name="nome"
                        render={({ field: { onChange, value } }) => (
                            <TextInput
                                style={styles.inputPerfil}
                                value={value}
                                onChangeText={onChange}
                                placeholder="Nome do animal"
                            />
                        )}
                    />
                    {renderError(errors.nome?.message)}

                    <Text style={styles.inputText2}>Data de nascimento</Text>
                    {Platform.OS === "web" ? (
                        <TextInput
                            style={styles.inputPerfil}
                            value={formatarDataWebInput(dataNascimento)}
                            onChangeText={onWebDateChange}
                            placeholder="AAAA-MM-DD"
                            autoCapitalize="none"
                        />
                    ) : (
                        <>
                            <TouchableOpacity
                                style={datePickerButtonStyle}
                                onPress={() => setShowDatePicker(true)}
                            >
                                <Text style={{ color: dataNascimento ? "#000" : "#8b8b8b" }}>{formatarData(dataNascimento)}</Text>
                            </TouchableOpacity>
                            {showDatePicker ? (
                                <DateTimePicker
                                    value={dataNascimento ? new Date(dataNascimento) : new Date()}
                                    mode="date"
                                    display="default"
                                    onChange={onDateChange}
                                    maximumDate={new Date()}
                                />
                            ) : null}
                        </>
                    )}
                    {renderError(errors.dt_nasc?.message)}

                    <Text style={styles.inputText2}>Espécie</Text>
                    <View style={{ flexDirection: "row", width: "100%", marginBottom: 12, justifyContent: "flex-start" }}>
                        <TouchableOpacity
                            style={[styles.selectButton, especieSelecionada === "gato" && { backgroundColor: "#ffafa8ff" }]}
                            onPress={() => setValue("especie", "gato", { shouldValidate: true })}
                        >
                            <Text style={styles.buttonText}>Gato</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.selectButton, especieSelecionada === "cachorro" && { backgroundColor: "#ffafa8ff" }]}
                            onPress={() => setValue("especie", "cachorro", { shouldValidate: true })}
                        >
                            <Text style={styles.buttonText}>Cachorro</Text>
                        </TouchableOpacity>
                    </View>
                    {renderError(errors.especie?.message)}

                    <Text style={styles.inputText2}>Porte</Text>
                    <View style={{ flexDirection: "row", width: "100%", marginBottom: 12, justifyContent: "center" }}>
                        <TouchableOpacity
                            style={[styles.selectButton, porteSelecionado === "pequeno" && { backgroundColor: "#ffafa8ff" }]}
                            onPress={() => setValue("porte", "pequeno", { shouldValidate: true })}
                        >
                            <Text style={styles.buttonText}>Pequeno</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.selectButton, porteSelecionado === "medio" && { backgroundColor: "#ffafa8ff" }]}
                            onPress={() => setValue("porte", "medio", { shouldValidate: true })}
                        >
                            <Text style={styles.buttonText}>Médio</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.selectButton, porteSelecionado === "grande" && { backgroundColor: "#ffafa8ff" }]}
                            onPress={() => setValue("porte", "grande", { shouldValidate: true })}
                        >
                            <Text style={styles.buttonText}>Grande</Text>
                        </TouchableOpacity>
                    </View>
                    {renderError(errors.porte?.message)}

                    <Text style={styles.inputText2}>Raça</Text>
                    <Controller
                        control={control}
                        name="raca"
                        render={({ field: { onChange, value } }) => (
                            <TextInput
                                style={styles.inputPerfil}
                                value={value}
                                onChangeText={onChange}
                                placeholder="Raca do animal"
                            />
                        )}
                    />
                    {renderError(errors.raca?.message)}

                    <Text style={styles.inputText2}>Descrição</Text>
                    <Controller
                        control={control}
                        name="descricao"
                        render={({ field: { onChange, value } }) => (
                            <TextInput
                                style={[styles.inputPerfil, { height: 130, textAlignVertical: "top" }]}
                                value={value}
                                onChangeText={onChange}
                                placeholder="Descreva o animal..."
                                multiline
                            />
                        )}
                    />
                    {renderError(errors.descricao?.message)}
                </View>

                <View style={{ width: "100%", alignItems: "center", marginTop: 20, position: "absolute", bottom: 20, left: 0 }}>
                    <TouchableOpacity style={styles.buttonCreateAd} onPress={handleSubmit(handleSave)} disabled={isCreating}>
                        <Text style={styles.buttonText}>{isCreating ? "Enviando..." : "Criar anúncio"}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}
