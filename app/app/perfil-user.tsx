import * as ImagePicker from "expo-image-picker";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Alert, Image, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, Pressable, View } from "react-native";
import { z } from "zod";
import styles from "../styles/AppStyles";
import Icon1 from "react-native-vector-icons/Ionicons";
import { getSession } from "../lib/session";
import apiService from "../services/apiService";

type UsuarioAtualizacaoDTO = {
    nome: string;
    cpfcnpj: string;
    email: string;
    senha?: string;
    confirmarSenha?: string;
    telefone?: string;
    link_foto?: string;
    endereco?: string;
    cep?: string;
    bairro?: string;
    cidade?: string;
    sg_estado?: string;
    cargo?: string;
};

type ApiResponse<T> = {
    data?: T[];
};

const perfilUsuarioSchema = z
    .object({
        nome: z.string().trim().min(1, "Nome e obrigatorio"),
        cpfcnpj: z.string().trim().min(1, "CPF/CNPJ e obrigatorio"),
        email: z.string().trim().email("E-mail invalido"),
        telefone: z.string().optional(),
        senha: z.string().optional(),
        confirmarSenha: z.string().optional(),
        endereco: z.string().optional(),
        cep: z.string().optional(),
        bairro: z.string().optional(),
        cidade: z.string().optional(),
        sg_estado: z.string().optional(),
        link_foto: z.string().optional(),
        cargo: z.string().optional(),
    })
    .superRefine((data, ctx) => {
        const senha = data.senha?.trim() ?? "";
        const confirmarSenha = data.confirmarSenha?.trim() ?? "";

        if (senha && senha.length < 6) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "A senha deve ter pelo menos 6 caracteres",
                path: ["senha"],
            });
        }

        if (senha && senha !== confirmarSenha) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Senha e confirmar senha precisam ser iguais",
                path: ["confirmarSenha"],
            });
        }
    });

type PerfilUsuarioFormData = z.infer<typeof perfilUsuarioSchema>;

export default function UserScreen() {
    const [isSaving, setIsSaving] = useState(false);

    const {
        control,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors, dirtyFields },
    } = useForm<PerfilUsuarioFormData>({
        resolver: zodResolver(perfilUsuarioSchema),
        defaultValues: {
            nome: "",
            cpfcnpj: "",
            email: "",
            telefone: "",
            senha: "",
            confirmarSenha: "",
            endereco: "",
            cep: "",
            bairro: "",
            cidade: "",
            sg_estado: "",
            link_foto: "",
            cargo: "",
        },
    });

    const linkFoto = watch("link_foto");

    useEffect(() => {
        const carregarUsuario = async () => {
            const session = getSession();
            if (!session?.email) {
                return;
            }

            setValue("cargo", session.cargo ?? "");

            try {
                const response = await apiService.get<ApiResponse<UsuarioAtualizacaoDTO>>("/usuario");
                const usuarios = response.data?.data ?? [];
                const usuarioLogado = usuarios.find((usuario) => usuario.email === session.email);

                if (!usuarioLogado) {
                    return;
                }

                reset({
                    nome: usuarioLogado.nome ?? "",
                    cpfcnpj: usuarioLogado.cpfcnpj ?? "",
                    email: usuarioLogado.email ?? session.email,
                    telefone: usuarioLogado.telefone ?? "",
                    senha: "",
                    confirmarSenha: "",
                    endereco: usuarioLogado.endereco ?? "",
                    cep: usuarioLogado.cep ?? "",
                    bairro: usuarioLogado.bairro ?? "",
                    cidade: usuarioLogado.cidade ?? "",
                    sg_estado: usuarioLogado.sg_estado ?? "",
                    link_foto: usuarioLogado.link_foto ?? "",
                    cargo: session.cargo ?? "",
                });
            } catch {
                setValue("email", session.email);
            }
        };

        void carregarUsuario();
    }, [reset, setValue]);

    const onSubmit = async (data: PerfilUsuarioFormData) => {
        if (isSaving) {
            return;
        }

        setIsSaving(true);
        try {
            const payload: UsuarioAtualizacaoDTO = {
                nome: data.nome.trim(),
                cpfcnpj: data.cpfcnpj.trim(),
                email: data.email.trim(),
                telefone: data.telefone?.trim() || undefined,
                link_foto: data.link_foto?.trim() || undefined,
                endereco: data.endereco?.trim() || undefined,
                cep: data.cep?.trim() || undefined,
                bairro: data.bairro?.trim() || undefined,
                cidade: data.cidade?.trim() || undefined,
                sg_estado: data.sg_estado?.trim() || undefined,
                cargo: data.cargo?.trim() || undefined,
            };

            const senhaFoiEditada = Boolean(dirtyFields.senha);
            const senhaInformada = data.senha?.trim();

            if (senhaFoiEditada && senhaInformada) {
                payload.senha = senhaInformada;
                payload.confirmarSenha = data.confirmarSenha?.trim();
            }

            await apiService.put("/usuario", payload);
            Alert.alert("Sucesso", "Dados atualizados com sucesso!");
            setValue("senha", "");
            setValue("confirmarSenha", "");
        } catch {
            Alert.alert("Erro", "Não foi possível atualizar seus dados. Tente novamente.");
        } finally {
            setIsSaving(false);
        }
    };
    const pickImage = async () => {
        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });
        if (!result.canceled && result.assets && result.assets.length > 0) {
            const selectedImage = result.assets[0].uri;
            setValue("link_foto", selectedImage, { shouldValidate: true });
        }
    };

    const renderError = (message?: string) =>
        message ? <Text style={{ color: "#b00020", marginBottom: 8, width: "100%" }}>{message}</Text> : null;

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
                        {linkFoto ? (
                            <Image source={{ uri: linkFoto }} style={{ width: 100, height: 100, borderRadius: 60 }} />
                        ) : (
                            <Icon1 name="image" size={40} color="#868585ff" />
                        )}
                    </Pressable>
                </View>
                <ScrollView style={{ marginTop: 5, width: "90%" }} contentContainerStyle={{ alignItems: "center", paddingBottom: 20 }}>
                    <Text style={styles.inputText2}>Usuario</Text>
                    <Controller
                        control={control}
                        name="nome"
                        render={({ field: { onChange, value } }) => (
                            <TextInput
                                style={styles.inputPerfil}
                                value={value ?? ""}
                                onChangeText={onChange}
                                placeholder="Digite seu nome"
                            />
                        )}
                    />
                    {renderError(errors.nome?.message)}

                    <Text style={styles.inputText2}>CPF/CNPJ</Text>
                    <Controller
                        control={control}
                        name="cpfcnpj"
                        render={({ field: { onChange, value } }) => (
                            <TextInput
                                style={styles.inputPerfil}
                                value={value ?? ""}
                                onChangeText={onChange}
                                placeholder="Digite seu CPF/CNPJ"
                            />
                        )}
                    />
                    {renderError(errors.cpfcnpj?.message)}

                    <Text style={styles.inputText2}>E-mail</Text>
                    <Controller
                        control={control}
                        name="email"
                        render={({ field: { onChange, value } }) => (
                            <TextInput
                                style={styles.inputPerfil}
                                value={value ?? ""}
                                onChangeText={onChange}
                                placeholder="exemplo@gmail.com"
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                        )}
                    />
                    {renderError(errors.email?.message)}

                    <Text style={styles.inputText2}>Telefone</Text>
                    <Controller
                        control={control}
                        name="telefone"
                        render={({ field: { onChange, value } }) => (
                            <TextInput
                                style={styles.inputPerfil}
                                value={value ?? ""}
                                onChangeText={onChange}
                                placeholder="(00)-00000-0000"
                            />
                        )}
                    />
                    {renderError(errors.telefone?.message)}

                    <Text style={styles.inputText2}>Senha</Text>
                    <Controller
                        control={control}
                        name="senha"
                        render={({ field: { onChange, value } }) => (
                            <TextInput
                                style={styles.inputPerfil}
                                value={value ?? ""}
                                onChangeText={onChange}
                                placeholder="Digite sua senha"
                                secureTextEntry
                                autoCapitalize="none"
                            />
                        )}
                    />
                    {renderError(errors.senha?.message)}

                    <Text style={styles.inputText2}>Confirmar Senha</Text>
                    <Controller
                        control={control}
                        name="confirmarSenha"
                        render={({ field: { onChange, value } }) => (
                            <TextInput
                                style={styles.inputPerfil}
                                value={value ?? ""}
                                onChangeText={onChange}
                                placeholder="Confirme sua senha"
                                secureTextEntry
                                autoCapitalize="none"
                            />
                        )}
                    />
                    {renderError(errors.confirmarSenha?.message)}

                    <Text style={styles.inputText2}>Endereco</Text>
                    <Controller
                        control={control}
                        name="endereco"
                        render={({ field: { onChange, value } }) => (
                            <TextInput
                                style={styles.inputPerfil}
                                value={value ?? ""}
                                onChangeText={onChange}
                                placeholder="Digite seu endereco..."
                            />
                        )}
                    />
                    {renderError(errors.endereco?.message)}

                    <Text style={styles.inputText2}>CEP</Text>
                    <Controller
                        control={control}
                        name="cep"
                        render={({ field: { onChange, value } }) => (
                            <TextInput
                                style={styles.inputPerfil}
                                value={value ?? ""}
                                onChangeText={onChange}
                                placeholder="00000-000"
                            />
                        )}
                    />
                    {renderError(errors.cep?.message)}

                    <Text style={styles.inputText2}>Bairro</Text>
                    <Controller
                        control={control}
                        name="bairro"
                        render={({ field: { onChange, value } }) => (
                            <TextInput
                                style={styles.inputPerfil}
                                value={value ?? ""}
                                onChangeText={onChange}
                                placeholder="Digite seu bairro"
                            />
                        )}
                    />
                    {renderError(errors.bairro?.message)}

                    <Text style={styles.inputText2}>Cidade</Text>
                    <Controller
                        control={control}
                        name="cidade"
                        render={({ field: { onChange, value } }) => (
                            <TextInput
                                style={styles.inputPerfil}
                                value={value ?? ""}
                                onChangeText={onChange}
                                placeholder="Digite sua cidade"
                            />
                        )}
                    />
                    {renderError(errors.cidade?.message)}

                    <Text style={styles.inputText2}>UF</Text>
                    <Controller
                        control={control}
                        name="sg_estado"
                        render={({ field: { onChange, value } }) => (
                            <TextInput
                                style={styles.inputPerfil}
                                value={value ?? ""}
                                onChangeText={onChange}
                                placeholder="Ex: SP"
                                autoCapitalize="characters"
                                maxLength={2}
                            />
                        )}
                    />
                    {renderError(errors.sg_estado?.message)}

                    <Text style={styles.inputText2}>Link da Foto</Text>
                    <Controller
                        control={control}
                        name="link_foto"
                        render={({ field: { onChange, value } }) => (
                            <TextInput
                                style={styles.inputPerfil}
                                value={value ?? ""}
                                onChangeText={onChange}
                                placeholder="Cole a URL da foto (opcional)"
                                autoCapitalize="none"
                            />
                        )}
                    />
                    {renderError(errors.link_foto?.message)}

                    <Text style={styles.inputText2}>Cargo</Text>
                    <Controller
                        control={control}
                        name="cargo"
                        render={({ field: { onChange, value } }) => (
                            <TextInput
                                style={styles.inputPerfil}
                                value={value ?? ""}
                                onChangeText={onChange}
                                placeholder="Cargo"
                            />
                        )}
                    />
                    {renderError(errors.cargo?.message)}

                    <TouchableOpacity style={styles.buttonSave} onPress={handleSubmit(onSubmit)} disabled={isSaving}>
                        <Text style={styles.buttonText}>{isSaving ? "Salvando..." : "Salvar"}</Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>
        </SafeAreaView>
    );
}
