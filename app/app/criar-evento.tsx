import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import * as Linking from "expo-linking";
import React, { useEffect, useRef, useState } from "react";
import { Alert, Keyboard, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { colors } from "@/styles/variables";
import AppHeader from "@/components/AppHeader";
import { ImageUploader } from "@/components/ImageUploader";
import { EventoDTO, createEvento, updateEvento, getEventoById } from "@/services/eventoService";
import { compressAvatarImage } from "@/services/imageCompressionService";


const timeRegex = /^([01]\d|2[0-3]):[0-5]\d$/;

const formatarHoraInput = (value: string): string => {
    const numeros = value.replace(/\D/g, "").slice(0, 4);
    if (numeros.length <= 2) return numeros;
    return `${numeros.slice(0, 2)}:${numeros.slice(2)}`;
};

const criarEventoSchema = z.object({
    nome: z.string().trim().min(2, "Nome deve ter pelo menos 2 caracteres"),
    endereco: z.string().trim().min(2, "Endereco deve ter pelo menos 2 caracteres"),
    bairro: z.string().trim().min(2, "Bairro deve ter pelo menos 2 caracteres"),
    cidade: z.string().trim().min(2, "Cidade deve ter pelo menos 2 caracteres"),
    cep: z
        .string()
        .trim()
        .regex(/^\d{5}-?\d{3}$/, "CEP deve estar no formato 00000-000"),
    data: z
        .string()
        .trim()
        .refine((valor) => /^\d{4}-\d{2}-\d{2}$/.test(valor), "Informe a data no formato AAAA-MM-DD"),
    hrinicio: z
        .string()
        .trim()
        .refine(
            (valor) => timeRegex.test(valor),
            "Informe o horario no formato HH:mm",
        ),
    hrfim: z
        .string()
        .trim()
        .refine(
            (valor) => timeRegex.test(valor),
            "Informe o horario no formato HH:mm",
        ),
    descricao: z.string().trim().min(10, "Descricao deve ter pelo menos 10 caracteres"),
});

type CriarEventoFormData = z.infer<typeof criarEventoSchema>;

export default function CriarEventoScreen() {
    const [showDatePicker, setShowDatePicker] = useState(false);

    const params = useLocalSearchParams<{ id?: string }>();
    const eventoId = Array.isArray(params.id) ? params.id[0] : params.id;
    const isEditing = !!eventoId;

    const [eventoData, setEventoData] = useState<EventoDTO | null>(null);
    const [isLoadingEvento, setIsLoadingEvento] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const [image, setImage] = useState<ImagePicker.ImagePickerAsset | null>(null);
    const [isCompressingImage, setIsCompressingImage] = useState<boolean>(false);
    const [existingPhotoUrl, setExistingPhotoUrl] = useState<string | null>(null);

    useEffect(() => {
        if (!isEditing || !eventoId) {
            return;
        }

        let isMounted = true;

        async function loadEvento() {
            try {
                setIsLoadingEvento(true);

                const evento = await getEventoById(eventoId);

                if (isMounted) {
                    setEventoData(evento);
                    if (evento.link_foto) {
                        setExistingPhotoUrl(evento.link_foto);
                    }
                }
            } catch (error) {
                console.error(error);
            } finally {
                if (isMounted) {
                    setIsLoadingEvento(false);
                }
            }
        }

        loadEvento();

        return () => {
            isMounted = false;
        };
    }, [isEditing, eventoId]);

    const getDefaultValues = () => {
        if (eventoData) {
            return {
                nome: eventoData.nome ?? "",
                endereco: eventoData.endereco ?? "",
                bairro: eventoData.bairro ?? "",
                cidade: eventoData.cidade ?? "",
                cep: eventoData.cep ?? "",
                data: eventoData.data ?? "",
                hrinicio: eventoData.hrinicio ?? "",
                hrfim: eventoData.hrfim ?? "",
                descricao: eventoData.descricao ?? "",
            };
        }
        return {
            nome: "",
            endereco: "",
            bairro: "",
            cidade: "",
            cep: "",
            data: "",
            hrinicio: "",
            hrfim: "",
            descricao: "",
        };
    };

    const {
        control,
        handleSubmit,
        reset,
        getValues,
        formState: { errors },
    } = useForm<CriarEventoFormData>({
        resolver: zodResolver(criarEventoSchema),
        defaultValues: getDefaultValues(),
    });

    useEffect(() => {
        if (!eventoData) {
            return;
        }
        reset(getDefaultValues());
        if (eventoData.link_foto) {
            setExistingPhotoUrl(eventoData.link_foto);
        }
    }, [eventoData, reset]);

    const showPermissionAlert = (type: "camera" | "galeria", canAskAgain: boolean) => {
        const recurso = type === "camera" ? "à câmera" : "à galeria";

        if (canAskAgain) {
            Alert.alert(
                "Permissão necessária",
                `Precisamos de acesso ${recurso} para selecionar a foto do evento.`,
            );
            return;
        }

        Alert.alert(
            `Permissão da ${type} bloqueada`,
            `Ative o acesso ${recurso} nas configurações do aparelho para continuar.`,
            [
                { text: "Cancelar", style: "cancel" },
                { text: "Abrir configurações", onPress: () => Linking.openSettings() },
            ]
        );
    };

    const compressImageIfNeeded = async (imageToCompress: ImagePicker.ImagePickerAsset) => {
        if (!imageToCompress.fileSize || imageToCompress.fileSize <= 100 * 1024) {
            return;
        }

        setIsCompressingImage(true);
        try {
            await compressAvatarImage(imageToCompress.uri, imageToCompress.fileSize);
        } catch (error) {
            console.warn("Image compression warning:", error);
        } finally {
            setIsCompressingImage(false);
        }
    };

    const pickImageFromCamera = async () => {
        try {
            const permission = await ImagePicker.requestCameraPermissionsAsync();

            if (!permission.granted) {
                showPermissionAlert("camera", permission.canAskAgain);
                return;
            }

            const result = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [16, 9],
                quality: 1,
            });

            if (!result.canceled && result.assets && result.assets.length > 0) {
                const selectedImage = result.assets[0];
                setImage(selectedImage);
                await compressImageIfNeeded(selectedImage);
            }
        } catch {
            Alert.alert("Erro", "Não foi possível abrir a câmera agora.");
        }
    };

    const pickImageFromGallery = async () => {
        try {
            const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

            if (!permission.granted) {
                showPermissionAlert("galeria", permission.canAskAgain);
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [16, 9],
                quality: 1,
            });

            if (!result.canceled && result.assets && result.assets.length > 0) {
                const selectedImage = result.assets[0];
                setImage(selectedImage);
                await compressImageIfNeeded(selectedImage);
            }
        } catch {
            Alert.alert("Erro", "Não foi possível abrir a galeria agora.");
        }
    };

    const pickImage = () => {
        if (Platform.OS === "web") {
            pickImageFromGallery();
            return;
        }
        Alert.alert(
            "Escolher foto",
            "Selecione de onde deseja importar a imagem.",
            [
                { text: "Galeria", onPress: () => void pickImageFromGallery() },
                { text: "Câmera", onPress: () => void pickImageFromCamera() },
                { text: "Cancelar", style: "cancel" },
            ]
        );
    };

    const router = useRouter();
    const nomeRef = useRef<TextInput>(null);
    const enderecoRef = useRef<TextInput>(null);
    const bairroRef = useRef<TextInput>(null);
    const cidadeRef = useRef<TextInput>(null);
    const cepRef = useRef<TextInput>(null);
    const descricaoRef = useRef<TextInput>(null);

    const isWeb = Platform.OS === "web";

    const formatarData = (value: string) => {
        if (!value) {
            return "Selecionar data";
        }

        const parsed = /^\d{4}-\d{2}-\d{2}$/.test(value) ? new Date(`${value}T00:00:00`) : new Date(value);
        if (Number.isNaN(parsed.getTime())) {
            return "Selecionar data";
        }

        return parsed.toLocaleDateString("pt-BR");
    };

    const handleSave = async (data: CriarEventoFormData) => {
        setIsSaving(true);
        try {
            const formData = new FormData();
            
            const payload = {
                ...data,
                hrinicio: data.hrinicio,
                hrfim: data.hrfim,
            };

            const payloadJson = JSON.stringify(payload);
            if (Platform.OS === "web") {
                formData.append("dados", new Blob([payloadJson], { type: "application/json" }));
            } else {
                formData.append("dados", payloadJson);
            }

            if (image) {
                const uri = Platform.OS === "ios" ? image.uri.replace("file://", "") : image.uri;
                const filename = image.fileName || `evento_${Date.now()}.jpg`;
                const mimeType = image.mimeType || "image/jpeg";

                if (Platform.OS === "web") {
                    const response = await fetch(image.uri);
                    const blob = await response.blob();
                    formData.append("imagem", blob, filename);
                } else {
                    formData.append("imagem", {
                        uri: image.uri,
                        name: filename,
                        type: mimeType,
                    } as any);
                }
            }

            if (isEditing && eventoId) {
                await updateEvento(eventoId, formData);
                router.back();
                return;
            }

            await createEvento(formData);
            reset();
            setImage(null);
            setExistingPhotoUrl(null);
        } catch (error) {
            console.error(error);
            Alert.alert("Erro", "Nao foi possivel salvar o evento.");
        } finally {
            setIsSaving(false);
        }
    };

    const renderError = (message?: string) =>
        message ? <Text style={{ color: "#b00020", marginBottom: 8, width: "100%" }}>{message}</Text> : null;

    return (
        <View style={styles.screen}>
            <SafeAreaView style={styles.safeTop} />
            <AppHeader title={isEditing ? "Editar Evento" : "Criar Evento"} onBackPress={() => router.back()} />

            <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.identitySection}>
                    <ImageUploader 
                        imageUri={image?.uri}
                        existingPhotoUrl={existingPhotoUrl}
                        onPress={pickImage}
                        isCompressing={isSaving || isCompressingImage}
                    />

                    <Text style={styles.heroTitle}>{isEditing ? "Atualize seu evento" : "Novo evento"}</Text>
                    <Text style={styles.heroSubtitle}>
                        {isEditing ? "Ajuste os detalhes e horarios" : "Compartilhe data, horario e local"}
                    </Text>
                </View>

                <View style={styles.formCard}>
                    <Controller
                        control={control}
                        name="nome"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <Field
                                label="Nome do Evento"
                                value={value}
                                onChangeText={onChange}
                                onBlur={onBlur}
                                placeholder="Ex.: Feira de adocao"
                                inputRef={nomeRef}
                                returnKeyType="next"
                                onSubmitEditing={() => enderecoRef.current?.focus()}
                            />
                        )}
                    />
                    {renderError(errors.nome?.message)}

                    <Controller
                        control={control}
                        name="endereco"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <Field
                                label="Endereco"
                                value={value}
                                onChangeText={onChange}
                                onBlur={onBlur}
                                placeholder="Rua e numero"
                                inputRef={enderecoRef}
                                returnKeyType="next"
                                onSubmitEditing={() => bairroRef.current?.focus()}
                            />
                        )}
                    />
                    {renderError(errors.endereco?.message)}

                    <View style={styles.gridTwo}>
                        <Controller
                            control={control}
                            name="bairro"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <Field
                                    label="Bairro"
                                    value={value}
                                    onChangeText={onChange}
                                    onBlur={onBlur}
                                    placeholder="Ex.: Centro"
                                    inputRef={bairroRef}
                                    returnKeyType="next"
                                    onSubmitEditing={() => cidadeRef.current?.focus()}
                                />
                            )}
                        />
                        <Controller
                            control={control}
                            name="cidade"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <Field
                                    label="Cidade"
                                    value={value}
                                    onChangeText={onChange}
                                    onBlur={onBlur}
                                    placeholder="Ex.: Sao Paulo"
                                    inputRef={cidadeRef}
                                    returnKeyType="next"
                                    onSubmitEditing={() => cepRef.current?.focus()}
                                />
                            )}
                        />
                    </View>
                    {renderError(errors.bairro?.message || errors.cidade?.message)}

                    <Controller
                        control={control}
                        name="cep"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <Field
                                label="CEP"
                                value={value}
                                onChangeText={onChange}
                                onBlur={onBlur}
                                placeholder="00000-000"
                                keyboardType="numeric"
                                inputRef={cepRef}
                                returnKeyType="next"
                                onSubmitEditing={() => Keyboard.dismiss()}
                            />
                        )}
                    />
                    {renderError(errors.cep?.message)}
                </View>

                <View style={styles.block}>
                    <Text style={styles.blockTitle}>Data</Text>
                    <Controller
                        control={control}
                        name="data"
                        render={({ field: { onChange, value } }) => (
                            <>
                                {isWeb ? (
                                    <Field
                                        label=""
                                        value={value}
                                        onChangeText={onChange}
                                        placeholder="AAAA-MM-DD"
                                    />
                                ) : (
                                    <TouchableOpacity
                                        style={styles.datePickerButton}
                                        onPress={() => setShowDatePicker(true)}
                                    >
                                        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                                            <Icon name="calendar-outline" size={20} color={colors.primary} />
                                            <Text style={{ color: value ? colors.text : colors.textMuted }}>
                                                {formatarData(value)}
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                )}

                                {showDatePicker && (
                                    <DateTimePicker
                                        value={value ? new Date(`${value}T00:00:00`) : new Date()}
                                        mode="date"
                                        display="default"
                                        onChange={(event, date) => {
                                            setShowDatePicker(false);
                                            if (date) onChange(date.toISOString().slice(0, 10));
                                        }}
                                    />
                                )}
                            </>
                        )}
                    />
                    {renderError(errors.data?.message)}
                </View>

                <View style={styles.block}>
                    <Text style={styles.blockTitle}>Horario</Text>
                    <View style={styles.gridTwo}>
                        <View style={{ flex: 1 }}>
                            <Controller
                                control={control}
                                name="hrinicio"
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <Field
                                        label="Inicio"
                                        value={value}
                                        onChangeText={(text) => onChange(formatarHoraInput(text))}
                                        onBlur={onBlur}
                                        placeholder="HH:mm"
                                        keyboardType="numeric"
                                    />
                                )}
                            />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Controller
                                control={control}
                                name="hrfim"
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <Field
                                        label="Fim"
                                        value={value}
                                        onChangeText={(text) => onChange(formatarHoraInput(text))}
                                        onBlur={onBlur}
                                        placeholder="HH:mm"
                                        keyboardType="numeric"
                                    />
                                )}
                            />
                        </View>
                    </View>
                    {renderError(errors.hrinicio?.message || errors.hrfim?.message)}
                </View>

                <View style={styles.block}>
                    <Text style={styles.blockTitle}>Descricao</Text>
                    <Controller
                        control={control}
                        name="descricao"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <Field
                                label=""
                                value={value}
                                onChangeText={onChange}
                                onBlur={onBlur}
                                placeholder="Conte o que vai acontecer e quem pode participar"
                                multiline
                                inputRef={descricaoRef}
                            />
                        )}
                    />
                    {renderError(errors.descricao?.message)}
                </View>

                <TouchableOpacity
                    style={[styles.primaryButton, (isSaving || isLoadingEvento) && { opacity: 0.7 }]}
                    onPress={handleSubmit(handleSave)}
                    disabled={isSaving || isLoadingEvento}
                >
                    <Icon name="sparkles-outline" size={18} color="#fff" />
                    <Text style={styles.primaryButtonText}>
                        {isLoadingEvento
                            ? "Carregando..."
                            : isSaving
                                ? "Salvando..."
                                : isEditing
                                    ? "Salvar alteracoes"
                                    : "Criar evento"}
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
    keyboardType?: "default" | "numeric";
    multiline?: boolean;
    inputRef?: React.RefObject<TextInput | null>;
    onSubmitEditing?: () => void;
    returnKeyType?: "next" | "done";
};

function Field({
    label,
    value,
    onChangeText,
    onBlur,
    placeholder,
    keyboardType = "default",
    multiline = false,
    inputRef,
    onSubmitEditing,
    returnKeyType,
}: FieldProps) {
    return (
        <View style={styles.fieldWrap}>
            {label ? <Text style={styles.label}>{label}</Text> : null}
            <TextInput
                ref={inputRef}
                style={[styles.input, multiline && styles.inputMultiline]}
                value={value}
                onChangeText={onChangeText}
                onBlur={onBlur}
                placeholder={placeholder}
                placeholderTextColor="#8C8C8C"
                keyboardType={keyboardType}
                multiline={multiline}
                onSubmitEditing={onSubmitEditing}
                returnKeyType={returnKeyType}
                blurOnSubmit={!multiline}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: colors.surface,
        paddingTop: 100,
    },
    safeTop: {
        backgroundColor: colors.surface,
    },
    scroll: {
        flex: 1,
    },
    content: {
        paddingTop: 24,
        paddingHorizontal: 20,
        paddingBottom: 90,
        gap: 18,
    },
    identitySection: {
        alignItems: "center",
        marginBottom: 4,
    },
    heroIcon: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: colors.primary,
        alignItems: "center",
        justifyContent: "center",
    },
    heroTitle: {
        marginTop: 14,
        color: colors.primary,
        fontSize: 28,
        lineHeight: 34,
        fontWeight: "900",
        textAlign: "center",
    },
    heroSubtitle: {
        marginTop: 4,
        color: colors.secondary,
        fontSize: 14,
        textAlign: "center",
    },
    formCard: {
        backgroundColor: colors.surfaceLow,
        borderRadius: 24,
        padding: 18,
        gap: 12,
    },
    gridTwo: {
        flexDirection: "row",
        gap: 10,
    },
    block: {
        gap: 10,
    },
    blockTitle: {
        fontSize: 15,
        fontWeight: "800",
        color: colors.text,
    },
    fieldWrap: {
        gap: 6,
        flex: 1,
    },
    label: {
        marginLeft: 4,
        fontSize: 11,
        letterSpacing: 0.8,
        textTransform: "uppercase",
        color: colors.primary,
        fontWeight: "800",
    },
    input: {
        borderRadius: 14,
        backgroundColor: colors.surfaceLowest,
        paddingHorizontal: 14,
        paddingVertical: 13,
        color: colors.text,
    },
    inputMultiline: {
        minHeight: 130,
        textAlignVertical: "top",
        backgroundColor: colors.surfaceLow,
        borderRadius: 20,
        paddingTop: 16,
    },
    timePickerButton: {
        position: "absolute",
        right: 12,
        top: 36,
        width: 36,
        height: 36,
        borderRadius: 8,
        backgroundColor: colors.primary,
        alignItems: "center",
        justifyContent: "center",
    },
    primaryButton: {
        minHeight: 58,
        borderRadius: 18,
        backgroundColor: colors.primary,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        gap: 8,
        shadowColor: colors.primary,
        shadowOpacity: 0.28,
        shadowOffset: { width: 0, height: 10 },
        shadowRadius: 16,
        elevation: 6,
    },
    primaryButtonText: {
        color: "#fff",
        fontWeight: "800",
        fontSize: 17,
    },
    datePickerButton: {
        backgroundColor: "#f3f2f2ff",
        width: "100%",
        minHeight: 44,
        paddingHorizontal: 12,
        borderRadius: 14,
        justifyContent: "center",
    },
});