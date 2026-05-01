import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useCreatePet } from "../hooks/useCreatePet";
import { useEditPet } from "../hooks/useEditPet";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Alert, Image, InputAccessoryView, Keyboard, Linking, Platform, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import Icon1 from "react-native-vector-icons/Ionicons";
import { colors } from "@/styles/variables";
import SelecionarFormularioModal from "@/components/SelecionarFormularioModal";
import { Formulario } from "@/types/Formulario";
import apiService from "@/services/apiService";
import { animal } from "@/types/TAnimal";

const criarAnuncioSchema = z.object({
    nome: z.string().trim().min(2, "Nome deve ter pelo menos 2 caracteres"),
    dt_nasc: z
        .string()
        .trim()
        .refine((valor) => !Number.isNaN(Date.parse(valor)), "Informe uma data de nascimento valida")
        .refine((valor) => new Date(valor) <= new Date(), "Data de nascimento nao pode ser no futuro"),
    especie: z.enum(["Gato", "Cão"], {
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
    const [isModalFormulariosOpen, setIsModalFormulariosOpen] = useState(false);
    const [formularioSelecionado, setFormularioSelecionado] = useState<Formulario | null>(null);

    const params = useLocalSearchParams<{ petId?: string }>();
    const isEditing = !!params.petId;
    const [petData, setPetData] = useState<animal | null>(null);
    const [isLoadingPet, setIsLoadingPet] = useState(false);

    const onClose = () => setIsModalFormulariosOpen(false);

    const { createPet, isCreating } = useCreatePet();
    const { editPet, isEditing: isEditingPet } = useEditPet();

    useEffect(() => {
        if (!isEditing || !params.petId) {
            return;
        }

        async function loadPet() {
            setIsLoadingPet(true);
            try {
                const response = await apiService.get<animal>(`/pets/${params.petId}`);
                setPetData(response.data);
            } catch {
                Alert.alert("Erro", "Nao foi carregar os dados do pet.");
            } finally {
                setIsLoadingPet(false);
            }
        }

        loadPet();
    }, [isEditing, params.petId]);

    const getDefaultValues = () => {
        if (petData) {
            return {
                nome: petData.nome,
                dt_nasc: petData.dt_nasc,
                especie: petData.especie as "Gato" | "Cão",
                porte: petData.porte as "pequeno" | "medio" | "grande",
                raca: petData.raca,
                descricao: petData.descricao,
            };
        }
        return {
            nome: "",
            dt_nasc: "2026-04-24",
            especie: undefined,
            porte: undefined,
            raca: "",
            descricao: "",
        };
    };

    const {
        control,
        handleSubmit,
        setValue,
        reset,
        formState: { errors },
    } = useForm<CriarAnuncioFormData>({
        resolver: zodResolver(criarAnuncioSchema),
        defaultValues: getDefaultValues(),
    });

    useEffect(() => {
        if (petData) {
            reset({
                nome: petData.nome,
                dt_nasc: petData.dt_nasc,
                especie: petData.especie as "Gato" | "Cão",
                porte: petData.porte as "pequeno" | "medio" | "grande",
                raca: petData.raca,
                descricao: petData.descricao,
            });
            setExistingPhotoUrl(petData.link_foto);
            setFormularioSelecionado(null);
        }
    }, [petData, reset]);

    const router = useRouter();
    const [image, setImage] = useState<ImagePicker.ImagePickerAsset | null>(null);
    const [existingPhotoUrl, setExistingPhotoUrl] = useState<string | null>(null);
    const [focusedField, setFocusedField] = useState<"nome" | "idade" | "peso" | null>(null);

    const nomeRef = useRef<TextInput>(null);
    const idadeRef = useRef<TextInput>(null);
    const pesoRef = useRef<TextInput>(null);
    const toolbarId = "pet-form-toolbar";

    const focusNextField = () => {
        if (focusedField === "nome") {
            idadeRef.current?.focus();
            return;
        }

        if (focusedField === "idade") {
            pesoRef.current?.focus();
        }
    };

    const showPermissionAlert = (type: "camera" | "galeria", canAskAgain: boolean) => {
        const recurso = type === "camera" ? "à câmera" : "à galeria";

        if (canAskAgain) {
            Alert.alert(
                "Permissão necessária",
                `Precisamos de acesso ${recurso} para selecionar a foto do pet.`,
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

    const handleSelecionarFormulario = (formulario: Formulario | null) => {
        setFormularioSelecionado(formulario);
        setIsModalFormulariosOpen(false);
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
                aspect: [1, 1],
                quality: 1,
            });

            if (!result.canceled && result.assets && result.assets.length > 0) {
                setImage(result.assets[0]);
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
                aspect: [1, 1],
                quality: 1,
            });

            if (!result.canceled && result.assets && result.assets.length > 0) {
                setImage(result.assets[0]);
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
        if (isEditing) {
            const result = await editPet({
                petId: params.petId!,
                nome: data.nome,
                dt_nasc: data.dt_nasc,
                especie: data.especie as "Gato" | "Cão",
                porte: data.porte as "pequeno" | "medio" | "grande",
                raca: data.raca,
                descricao: data.descricao,
                formularioId: formularioSelecionado?.id ?? null,
                imagem: image ? {
                    uri: image.uri,
                    fileName: image.fileName,
                    mimeType: image.mimeType,
                } : null,
            });

            if (!result.ok) {
                Alert.alert("Erro", result.messages.join("\n"));
                return;
            }

            Alert.alert("Sucesso", "Anuncio atualizado com sucesso!");
            router.back();
            return;
        }

        if (!image?.uri) {
            Alert.alert("Imagem obrigatória", "Adicione uma foto do pet para criar o anúncio.");
            return;
        }

        const result = await createPet({
            ...data,
            formularioId: formularioSelecionado?.id ?? null,
            imagem: {
                uri: image.uri,
                fileName: image.fileName,
                mimeType: image.mimeType,
            },
        });

        if (!result.ok) {
            Alert.alert("Erro", result.messages.join("\n"));
            return;
        }

        Alert.alert("Sucesso", "Anuncio criado com sucesso!");
        reset();
        setImage(null);
        setFormularioSelecionado(null);
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
        <View style={styles.screen}>
            <SafeAreaView style={styles.safeTop} />
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
                    <Icon1 name="arrow-back" size={22} color={colors.primary} />
                </TouchableOpacity>
                <View style={styles.headerSpacer} />
            </View>

            <ScrollView                style={styles.scroll}
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.identitySection}>
                    <Pressable style={styles.avatarUploader} onPress={pickImage}>
                        {image?.uri ? (
                            <Image source={{ uri: image.uri }} style={styles.avatarImage} />
                        ) : existingPhotoUrl ? (
                            <Image source={{ uri: existingPhotoUrl }} style={styles.avatarImage} />
                        ) : (
                            <View style={styles.avatarPlaceholder}>
                                <Icon1 name="camera-outline" size={30} color="#8c8c8c" />
                                <Text style={styles.avatarHint}>ADICIONAR FOTO</Text>
                            </View>
                        )}
                        <View style={styles.avatarEditBadge}>
                            <Icon1 name="pencil" size={14} color="#fff" />
                        </View>
                    </Pressable>

                    <Text style={styles.heroTitle}>{isEditing ? "Editar História" : "Nova História"}</Text>
                    <Text style={styles.heroSubtitle}>{isEditing ? "Atualize as informações do seu companheiro" : "Dê voz a um novo companheiro"}</Text>
                </View>

                <View style={styles.formCard}>
                    <Controller
                        control={control}
                        name="nome"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <Field
                                label="Nome do Pet"
                                value={value}
                                onChangeText={onChange}
                                onBlur={onBlur}
                                placeholder="Como ele se chama?"
                                inputRef={nomeRef}
                                returnKeyType="next"
                                onSubmitEditing={() => idadeRef.current?.focus()}
                                onFocus={() => setFocusedField("nome")}
                                inputAccessoryViewID={Platform.OS === "ios" ? toolbarId : undefined}
                            />
                        )}
                    />
                    {renderError(errors.nome?.message)}

                    <View style={styles.gridTwo}>
                        <Controller
                            control={control}
                            name="raca"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <Field
                                    label="Raça"
                                    value={value}
                                    onChangeText={onChange}
                                    onBlur={onBlur}
                                    placeholder="Ex.: SRD"
                                    inputRef={idadeRef}
                                    returnKeyType="next"
                                    onSubmitEditing={() => pesoRef.current?.focus()}
                                    onFocus={() => setFocusedField("idade")}
                                    inputAccessoryViewID={Platform.OS === "ios" ? toolbarId : undefined}
                                />
                            )}
                        />
                        <Field
                            label="Peso (kg) - Opcional"
                            value={""}
                            onChangeText={() => {}}
                            placeholder="Ex.: 5"
                            keyboardType="numeric"
                            inputRef={pesoRef}
                            returnKeyType="done"
                            onSubmitEditing={() => Keyboard.dismiss()}
                            onFocus={() => setFocusedField("peso")}
                            inputAccessoryViewID={Platform.OS === "ios" ? toolbarId : undefined}
                        />
                    </View>
                    {renderError(errors.raca?.message)}
                </View>

                <View style={styles.block}>
                    <Text style={styles.blockTitle}>Espécie</Text>
                    <Controller
                        control={control}
                        name="especie"
                        render={({ field: { onChange, value } }) => (
                            <View style={styles.row}>
                                <Chip label="Cão" selected={value === "Cão"} onPress={() => onChange("Cão")} />
                                <Chip label="Gato" selected={value === "Gato"} onPress={() => onChange("Gato")} />
                            </View>
                        )}
                    />
                    {renderError(errors.especie?.message)}
                </View>

                <View style={styles.block}>
                    <Text style={styles.blockTitle}>Porte</Text>
                    <Controller
                        control={control}
                        name="porte"
                        render={({ field: { onChange, value } }) => (
                            <View style={styles.row}>
                                <Chip label="Pequeno" selected={value === "pequeno"} onPress={() => onChange("pequeno")} />
                                <Chip label="Médio" selected={value === "medio"} onPress={() => onChange("medio")} />
                                <Chip label="Grande" selected={value === "grande"} onPress={() => onChange("grande")} />
                            </View>
                        )}
                    />
                    {renderError(errors.porte?.message)}
                </View>

                <View style={styles.block}>
                    <View style={styles.blockHeaderRow}>
                        <Text style={styles.blockTitle}>Data de Nascimento</Text>
                    </View>
                    <Controller
                        control={control}
                        name="dt_nasc"
                        render={({ field: { onChange, value } }) => (
                            <>
                                <TouchableOpacity style={datePickerButtonStyle} onPress={() => setShowDatePicker(true)}>
                                    <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                                        <Icon1 name="calendar-outline" size={20} color={colors.primary} />
                                        <Text style={{ color: value ? colors.text : colors.textMuted }}>
                                            {formatarData(value)}
                                        </Text>
                                    </View>
                                </TouchableOpacity>

                                {showDatePicker && (
                                    <DateTimePicker
                                        value={value ? new Date(value) : new Date()}
                                        mode="date"
                                        display="default"
                                        maximumDate={new Date()}
                                        onChange={(event, date) => {
                                            setShowDatePicker(false);
                                            if (date) onChange(date.toISOString());
                                        }}
                                    />
                                )}
                            </>
                        )}
                    />
                    {renderError(errors.dt_nasc?.message)}
                </View>

                <View style={styles.block}>
                    <View style={styles.blockHeaderRow}>
                        <Text style={styles.blockTitle}>Descrição & História</Text>
                    </View>
                    <Controller
                        control={control}
                        name="descricao"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <Field
                                label=""
                                value={value}
                                onChangeText={onChange}
                                onBlur={onBlur}
                                placeholder="Conte um pouco sobre personalidade, temperamento e o que o torna especial..."
                                multiline
                            />
                        )}
                    />
                    {renderError(errors.descricao?.message)}

                    {formularioSelecionado ? (
                        <View style={styles.formularioCard}>
                            <View style={styles.formularioInfo}>
                                <View style={styles.formularioIcon}>
                                    <Icon1 name="list-outline" size={20} color={colors.primary} />
                                </View>
                                <View style={styles.formularioText}>
                                    <Text style={styles.formularioLabel}>Formulario selecionado</Text>
                                    <Text style={styles.formularioTitle}>{formularioSelecionado.titulo}</Text>
                                </View>
                            </View>
                            <TouchableOpacity
                                style={styles.formularioChangeButton}
                                onPress={() => setIsModalFormulariosOpen(true)}
                            >
                                <Text style={styles.formularioChangeText}>Mudar</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <TouchableOpacity style={styles.secondaryButton} onPress={() => setIsModalFormulariosOpen(true)}>
                            <Text style={styles.secondaryButtonText}>Escolher formulario</Text>
                        </TouchableOpacity>
                    )}
                </View>

                <TouchableOpacity 
                    style={[styles.primaryButton, (isCreating || isEditingPet) && { opacity: 0.7 }]} 
                    onPress={handleSubmit(handleSave)}
                    disabled={isCreating || isEditingPet || isLoadingPet}
                >
                    <Icon1 name="sparkles-outline" size={18} color="#fff" />
                    <Text style={styles.primaryButtonText}>
                        {isLoadingPet ? "Carregando..." : isEditing ? (isEditingPet ? "Salvando..." : "Salvar alteracoes") : (isCreating ? "Criando..." : "Criar anúncio")}
                    </Text>
                </TouchableOpacity>
            </ScrollView>

            {Platform.OS === "ios" && (
                <InputAccessoryView nativeID={toolbarId}>
                    <View style={styles.keyboardToolbar}>
                        <TouchableOpacity onPress={() => Keyboard.dismiss()}>
                            <Text style={styles.keyboardToolbarButton}>Fechar</Text>
                        </TouchableOpacity>

                        {focusedField !== "peso" && (
                            <TouchableOpacity onPress={focusNextField}>
                                <Text style={styles.keyboardToolbarButton}>Próximo</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </InputAccessoryView>
            )}

            <SelecionarFormularioModal
                visible={isModalFormulariosOpen}
                onClose={onClose}
                onFormularioSelecionado={handleSelecionarFormulario}
            />
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
    onFocus?: () => void;
    returnKeyType?: "next" | "done";
    inputAccessoryViewID?: string;
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
    onFocus,
    returnKeyType,
    inputAccessoryViewID,
}: FieldProps) {
    return (
        <View style={styles.fieldWrap}>
            <Text style={styles.label}>{label}</Text>
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
                onFocus={onFocus}
                returnKeyType={returnKeyType}
                blurOnSubmit={!multiline}
                inputAccessoryViewID={inputAccessoryViewID}
            />
        </View>
    );
}

function Chip({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) {
    return (
        <TouchableOpacity style={[styles.chip, selected && styles.chipSelected]} onPress={onPress}>
            <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{label}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: colors.surface,
    },
    safeTop: {
        backgroundColor: colors.surface,
    },
    header: {
        height: 62,
        paddingHorizontal: 16,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "rgba(248, 249, 250, 0.92)",
    },
    headerButton: {
        width: 38,
        height: 38,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.surfaceLowest,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: colors.primary,
    },
    headerSpacer: {
        width: 38,
        height: 38,
    },
    scroll: {
        flex: 1,
    },
    content: {
        paddingTop: 10,
        paddingHorizontal: 20,
        paddingBottom: 90,
        gap: 16,
    },
    identitySection: {
        alignItems: "center",
        marginBottom: 4,
    },
    avatarUploader: {
        width: 138,
        height: 138,
        borderRadius: 72,
        backgroundColor: colors.surfaceHigh,
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        borderWidth: 4,
        borderColor: colors.surfaceLowest,
    },
    avatarImage: {
        width: "100%",
        height: "100%",
        borderRadius: 72,
    },
    avatarPlaceholder: {
        alignItems: "center",
        justifyContent: "center",
        gap: 4,
    },
    avatarHint: {
        fontSize: 9,
        letterSpacing: 0.8,
        fontWeight: "800",
        color: "#8c8c8c",
    },
    avatarEditBadge: {
        position: "absolute",
        right: 8,
        bottom: 8,
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: colors.primary,
        alignItems: "center",
        justifyContent: "center"
    },
    heroTitle: {
        marginTop: 14,
        color: colors.primary,
        fontSize: 34,
        lineHeight: 40,
        fontWeight: "900",
    },
    heroSubtitle: {
        marginTop: 2,
        color: colors.secondary,
        fontSize: 14,
    },
    formCard: {
        backgroundColor: colors.surfaceLow,
        borderRadius: 28,
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
    blockHeaderRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    blockTitle: {
        fontSize: 15,
        fontWeight: "800",
        color: colors.text,
    },
    optional: {
        fontSize: 10,
        letterSpacing: 1,
        fontWeight: "800",
        color: "#8c706f",
    },
    fieldWrap: {
        gap: 6,
        flex: 1,
    },
    label: {
        marginLeft: 4,
        fontSize: 11,
        letterSpacing: 0.8,
        textTransform: 'uppercase',
        color: colors.primary,
        fontWeight: '800',
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
        textAlignVertical: 'top',
        backgroundColor: colors.surfaceLow,
        borderRadius: 20,
        paddingTop: 16,
    },
    row: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    chip: {
        borderRadius: 999,
        borderWidth: 1,
        borderColor: '#ddd',
        backgroundColor: '#f7f7f7',
        paddingHorizontal: 14,
        paddingVertical: 8,
    },
    chipSelected: {
        borderColor: colors.primaryContainer,
        backgroundColor: colors.primary,
    },
    chipText: {
        color: colors.textMuted,
        fontWeight: '700',
    },
    chipTextSelected: {
        color: "#fff",
    },
    secondaryButton: {
        paddingVertical: 14,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.secondaryContainer,
    },
    secondaryButtonText: {
        color: colors.text,
        fontWeight: "700",
        fontSize: 14,
    },
    formularioCard: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
        paddingVertical: 12,
        paddingHorizontal: 14,
        borderRadius: 16,
        backgroundColor: colors.surfaceLow,
        borderWidth: 1,
        borderColor: colors.surfaceLowest,
    },
    formularioInfo: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        flex: 1,
    },
    formularioIcon: {
        width: 34,
        height: 34,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.secondaryContainer,
    },
    formularioText: {
        flex: 1,
    },
    formularioLabel: {
        fontSize: 11,
        letterSpacing: 0.6,
        textTransform: "uppercase",
        color: colors.textMuted,
        fontWeight: "700",
    },
    formularioTitle: {
        fontSize: 15,
        fontWeight: "800",
        color: colors.text,
        marginTop: 2,
    },
    formularioChangeButton: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 999,
        backgroundColor: colors.primary,
    },
    formularioChangeText: {
        color: "#fff",
        fontSize: 12,
        fontWeight: "800",
    },
    keyboardToolbar: {
        backgroundColor: "#F5F5F7",
        borderTopWidth: 1,
        borderTopColor: "#D9D9DD",
        paddingHorizontal: 16,
        paddingVertical: 10,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    keyboardToolbarButton: {
        color: colors.primary,
        fontSize: 16,
        fontWeight: "700",
    },
    primaryButton: {
        minHeight: 58,
        borderRadius: 18,
        backgroundColor: colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: "row",
        gap: 8,
        shadowColor: colors.primary,
        shadowOpacity: 0.28,
        shadowOffset: { width: 0, height: 10 },
        shadowRadius: 16,
        elevation: 6,
    },
    primaryButtonText: {
        color: '#fff',
        fontWeight: "800",
        fontSize: 17,
    },
});
