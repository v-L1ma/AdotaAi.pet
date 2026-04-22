import * as ImagePicker from "expo-image-picker";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Alert, Image, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, Pressable, View, Linking, StyleSheet } from "react-native";
import { z } from "zod";
import Icon1 from "react-native-vector-icons/Ionicons";
import { getSession } from "../lib/session";
import apiService from "../services/apiService";
import { router } from "expo-router";
import AppHeader from "@/components/AppHeader";
import { colors } from "@/styles/variables";

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
    const [image, setImage] = useState<string | null>(null);
    const [userLogado, setUserLogado] = useState<UsuarioAtualizacaoDTO | null>(null);

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

    const hasUnsavedChanges =
        watch("nome").trim().length > 0 ||
        watch("email").trim().length > 0 ||
        watch("telefone")!.trim().length > 0 ||
        watch("senha")!.trim().length > 0 ||
        watch("endereco")!.trim().length > 0 ||
        watch("cep")!.trim().length > 0 ||
        !!image;

    const handleBackPress = () => {
        if (!hasUnsavedChanges) {
            router.back();
            return;
        }

        Alert.alert(
            "Descartar alterações?",
            "Você fez alterações e ainda não salvou. Se voltar agora, as alterações serão descartadas.",
            [
                { text: "Continuar editando", style: "cancel" },
                {
                    text: "Descartar e voltar",
                    style: "destructive",
                    onPress: () => router.back(),
                },
            ]
        );
    };

    const showPermissionAlert = (canAskAgain: boolean) => {
        if (canAskAgain) {
            Alert.alert(
                "Permissão necessária",
                "Precisamos de acesso à câmera para atualizar sua foto de perfil.",
            );
            return;
        }

        Alert.alert(
            "Permissão da câmera bloqueada",
            "Ative o acesso à câmera nas configurações do aparelho para continuar.",
            [
                { text: "Cancelar", style: "cancel" },
                { text: "Abrir configurações", onPress: () => Linking.openSettings() },
            ]
        );
    };

    const pickImage = async () => {
        try {
            const permission = await ImagePicker.requestCameraPermissionsAsync();

            if (!permission.granted) {
                showPermissionAlert(permission.canAskAgain);
                return;
            }

            const result = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 1,
            });

            if (!result.canceled && result.assets && result.assets.length > 0) {
                setImage(result.assets[0].uri);
            }
        } catch {
            Alert.alert("Erro", "Não foi possível abrir a câmera agora.");
        }
    };

    const renderError = (message?: string) =>
        message ? <Text style={{ color: "#b00020", marginBottom: 8, width: "100%" }}>{message}</Text> : null;

    return (
        <View style={styles.screen}>
            <AppHeader title="Perfil" onBackPress={handleBackPress} />

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.heroCard}>
                    <Pressable style={styles.avatarWrap} onPress={pickImage}>
                        {image ? (
                            <Image source={{ uri: image }} style={styles.avatarImage} />
                        ) : (
                            <Icon1 name="image" size={40} color="#868585ff" />
                        )}
                        <View style={styles.cameraBadge}>
                            <Icon1 name="camera" size={16} color="#fff" />
                        </View>
                    </Pressable>

                    <Text style={styles.profileTitle}>{userLogado?.nome || ""}</Text>
                </View>

                <SafeAreaView style={styles.formCard}>
                    <Controller
                        control={control}
                        name="nome"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <Field
                                label="Nome"
                                value={value}
                                onChangeText={onChange}
                                onBlur={onBlur}
                                placeholder="Digite seu nome"
                            />
                        )}
                    />
                    {renderError(errors.nome?.message)}

                    <Controller
                        control={control}
                        name="email"
                        render={({ field: { value } }) => (
                            <Field
                                label="E-mail"
                                value={value}
                                onChangeText={() => {}}
                                placeholder="exemplo@gmail.com"
                                keyboardType="email-address"
                                editable={false}
                            />
                        )}
                    />

                    <Controller
                        control={control}
                        name="telefone"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <Field
                                label="Telefone"
                                value={value || ""}
                                onChangeText={onChange}
                                onBlur={onBlur}
                                placeholder="(00) 00000-0000"
                                keyboardType="phone-pad"
                            />
                        )}
                    />
                    {renderError(errors.telefone?.message)}

                    <Controller
                        control={control}
                        name="senha"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <Field
                                label="Nova Senha"
                                value={value || ""}
                                onChangeText={onChange}
                                onBlur={onBlur}
                                placeholder="Digite sua senha"
                                secureTextEntry
                            />
                        )}
                    />
                    {renderError(errors.senha?.message)}

                    <Controller
                        control={control}
                        name="confirmarSenha"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <Field
                                label="Confirmar Senha"
                                value={value || ""}
                                onChangeText={onChange}
                                onBlur={onBlur}
                                placeholder="Confirme sua senha"
                                secureTextEntry
                            />
                        )}
                    />
                    {renderError(errors.confirmarSenha?.message)}

                    <Controller
                        control={control}
                        name="endereco"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <Field
                                label="Endereço"
                                value={value || ""}
                                onChangeText={onChange}
                                onBlur={onBlur}
                                placeholder="Digite seu endereço..."
                                multiline
                            />
                        )}
                    />
                </SafeAreaView>

                <TouchableOpacity 
                    style={[styles.primaryButton, isSaving && { opacity: 0.7 }]} 
                    onPress={handleSubmit(onSubmit)}
                    disabled={isSaving}
                >
                    <Text style={styles.primaryButtonText}>
                        {isSaving ? "Salvando..." : "Salvar alterações"}
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}

type FieldProps = {
    label: string;
    value: string;
    onChangeText: (text: string) => void;
    onBlur?: () => void;
    placeholder: string;
    keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
    secureTextEntry?: boolean;
    editable?: boolean;
    multiline?: boolean;
};

function Field({ label, value, onChangeText, onBlur, placeholder, keyboardType = "default", secureTextEntry = false, editable = true, multiline = false }: FieldProps) {
    return (
        <View style={styles.fieldWrap}>
            <Text style={styles.label}>{label}</Text>
            <TextInput
                style={[styles.input, multiline && styles.inputMultiline]}
                value={value}
                onChangeText={onChangeText}
                onBlur={onBlur}
                placeholder={placeholder}
                placeholderTextColor="#8C8C8C"
                keyboardType={keyboardType}
                secureTextEntry={secureTextEntry}
                editable={editable}
                multiline={multiline}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    content: {
        paddingTop: 130,
        paddingHorizontal: 16,
        paddingBottom: 28,
        gap: 12,
    },
    heroCard: {
        alignItems: 'center',
        marginBottom: 6,
    },
    avatarWrap: {
        width: 140,
        height: 140,
        borderRadius: 70,
        backgroundColor: '#ebeaea',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 5,
        borderColor: '#fff',
        //overflow: 'hidden',
        position: 'relative',
    },
    avatarImage: {
        width: 140,
        height: 140,
        borderRadius: 70,
    },
    cameraBadge: {
        position: 'absolute',
        bottom: 8,
        right: 8,
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.primary,
    },
    profileTitle: {
        marginTop: 10,
        fontSize: 30,
        fontWeight: '800',
        color: '#222',
    },
    formCard: {
        backgroundColor: '#fff',
        borderRadius: 22,
        borderWidth: 1,
        borderColor: '#ececec',
        padding: 14,
        gap: 10,
    },
    fieldWrap: {
        gap: 6,
    },
    label: {
        fontSize: 11,
        fontWeight: '800',
        color: '#777',
        textTransform: 'uppercase',
        letterSpacing: 0.8,
        marginLeft: 4,
    },
    input: {
        borderRadius: 14,
        backgroundColor: '#f4f4f4',
        borderWidth: 1,
        borderColor: '#e7e7e7',
        paddingHorizontal: 12,
        paddingVertical: 12,
        color: '#242424',
    },
    inputMultiline: {
        minHeight: 70,
        textAlignVertical: 'top',
    },
    primaryButton: {
        marginTop: 4,
        backgroundColor: colors.primary,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 54,
    },
    primaryButtonText: {
        color: '#fff',
        fontSize: 17,
        fontWeight: '800',
    },
});
