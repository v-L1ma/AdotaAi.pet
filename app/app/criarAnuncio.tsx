import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { useCreatePet } from "../hooks/useCreatePet";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Alert, Image, InputAccessoryView, Keyboard, Linking, Platform, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import Icon1 from "react-native-vector-icons/Ionicons";
import { colors } from "@/styles/variables";
import { petFormLinkStore } from "@/lib/petFormLinkStore";
import { formularioService } from "@/services/formularioService";
import { petService } from "@/services/petService";
import { FormularioTemplateDTO } from "@/types/formulario";
import { PetDTO } from "@/types/pet";

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

function toUtcMidnightIso(date: Date) {
    return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())).toISOString();
}

export default function CriarAnuncioScreen() {
    const [showDatePicker, setShowDatePicker] = useState(false);
    const { createPet, isCreating } = useCreatePet();
    const params = useLocalSearchParams<{ id?: string | string[] }>();
    const petId = Array.isArray(params.id) ? params.id[0] : params.id;
    const isEditMode = Boolean(petId);

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
            dt_nasc: toUtcMidnightIso(new Date()),
            especie: undefined,
            porte: undefined,
            raca: "",
            descricao: "",
        },
    });

    const router = useRouter();
    const [image, setImage] = useState<string | undefined>(undefined);
    const [peso, setPeso] = useState<string>("");
    const [petStatus, setPetStatus] = useState<string>("PENDENTE");
    const [isLoadingPet, setIsLoadingPet] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [wantsTriagemForm, setWantsTriagemForm] = useState<boolean>(false);
    const [selectedFormId, setSelectedFormId] = useState<string | null>(null);
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [isLoadingForms, setIsLoadingForms] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);
    const [userForms, setUserForms] = useState<FormularioTemplateDTO[]>([]);
    const [focusedField, setFocusedField] = useState<"nome" | "idade" | "peso" | null>(null);

    const nomeRef = useRef<TextInput>(null);
    const idadeRef = useRef<TextInput>(null);
    const pesoRef = useRef<TextInput>(null);
    const toolbarId = "pet-form-toolbar";
    const selectedForm = userForms.find((form) => form.id === selectedFormId) || null;

    const focusNextField = () => {
        if (focusedField === "nome") {
            idadeRef.current?.focus();
            return;
        }

        if (focusedField === "idade") {
            pesoRef.current?.focus();
        }
    };

    const showPermissionAlert = (canAskAgain: boolean) => {
        if (canAskAgain) {
            Alert.alert(
                "Permissão necessária",
                "Precisamos de acesso à câmera para tirar a foto do pet.",
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
             const isoDate = `${rawDate}T00:00:00.000Z`;
            setValue("dt_nasc", isoDate, { shouldValidate: true });
        }
    };

    async function loadMyForms() {
        setIsLoadingForms(true);
        setFormError(null);

        try {
            const forms = await formularioService.listMine();
            setUserForms(forms);
        } catch {
            setFormError("Não foi possível carregar seus formulários.");
        } finally {
            setIsLoadingForms(false);
        }
    }

    async function openFormModal() {
        setIsFormModalOpen(true);
        await loadMyForms();
    }

    useEffect(() => {
        async function loadPetForEdit() {
            if (!petId) {
                return;
            }

            setIsLoadingPet(true);
            try {
                const pet = await petService.getById(petId);
                const especie = pet.especie === "gato" || pet.especie === "cachorro" ? pet.especie : undefined;
                const porte = pet.porte === "pequeno" || pet.porte === "medio" || pet.porte === "grande" ? pet.porte : undefined;

                reset({
                    nome: pet.nome || "",
                    dt_nasc: pet.dt_nasc || toUtcMidnightIso(new Date()),
                    especie,
                    porte,
                    raca: pet.raca || "",
                    descricao: pet.descricao || "",
                });

                setImage(pet.link_foto || undefined);
                setPeso("");
                setPetStatus(pet.status || "PENDENTE");

                const linkedFormId = await petFormLinkStore.getFormIdByPetId(petId);
                setSelectedFormId(linkedFormId);
                setWantsTriagemForm(Boolean(linkedFormId));
            } catch {
                Alert.alert("Erro", "Não foi possível carregar os dados do pet para edição.");
                router.back();
            } finally {
                setIsLoadingPet(false);
            }
        }

        void loadPetForEdit();
    }, [petId, reset, router]);

    const handleSave = async (data: CriarAnuncioFormData) => {
        try {
            if (wantsTriagemForm && !selectedFormId) {
                Alert.alert("Formulário de triagem", "Selecione um formulário para continuar.");
                return;
            }

            if (isEditMode && petId) {
                setIsUpdating(true);

                const payload: PetDTO = {
                    status: petStatus || "PENDENTE",
                    nome: data.nome,
                    descricao: data.descricao,
                    dt_nasc: data.dt_nasc,
                    porte: data.porte,
                    raca: data.raca,
                    especie: data.especie,
                    link_foto: image,
                };

                await petService.update(petId, payload);

                if (wantsTriagemForm && selectedFormId) {
                    await petFormLinkStore.setLink(petId, selectedFormId);
                } else {
                    await petFormLinkStore.removeLink(petId);
                }

                Alert.alert("Sucesso", "Informações do pet atualizadas com sucesso!");
                router.back();
                return;
            }

            const createdPet = await createPet({
                ...data,
                link_foto: image,
            });

            if (createdPet?.id) {
                if (wantsTriagemForm && selectedFormId) {
                    await petFormLinkStore.setLink(createdPet.id, selectedFormId);
                } else {
                    await petFormLinkStore.removeLink(createdPet.id);
                }
            }

            Alert.alert("Sucesso", "Anuncio criado com sucesso!");
            reset();
            setImage(undefined);
            setPeso("");
            setWantsTriagemForm(false);
            setSelectedFormId(null);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Falha ao criar anuncio";
            Alert.alert("Erro", errorMessage);
        } finally {
            setIsUpdating(false);
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
                        {image ? (
                            <Image source={{ uri: image }} style={styles.avatarImage} />
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

                    <Text style={styles.heroTitle}>{isEditMode ? "Editar Pet" : "Nova História"}</Text>
                    <Text style={styles.heroSubtitle}>{isEditMode ? "Atualize as informações do seu pet" : "Dê voz a um novo companheiro"}</Text>
                </View>

                {isLoadingPet && (
                    <View style={styles.loadingCard}>
                        <ActivityIndicator color={colors.primary} />
                        <Text style={styles.loadingText}>Carregando informações do pet...</Text>
                    </View>
                )}

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
                            value={peso}
                            onChangeText={setPeso}
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
                                <Chip label="Cão" selected={value === "cachorro"} onPress={() => onChange("cachorro")} />
                                <Chip label="Gato" selected={value === "gato"} onPress={() => onChange("gato")} />
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
                                            if (date) onChange(toUtcMidnightIso(date));
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

                    <View style={styles.triagemSection}>
                        <Text style={styles.blockTitle}>Adicionar formulário de triagem?</Text>

                        <View style={styles.row}>
                            <Chip
                                label="Sim"
                                selected={wantsTriagemForm}
                                onPress={() => setWantsTriagemForm(true)}
                            />
                            <Chip
                                label="Não"
                                selected={!wantsTriagemForm}
                                onPress={() => {
                                    setWantsTriagemForm(false);
                                    setSelectedFormId(null);
                                }}
                            />
                        </View>

                        {wantsTriagemForm && (
                            <View style={styles.triagemActions}>
                                <TouchableOpacity style={styles.secondaryButton} onPress={openFormModal}>
                                    <Text style={styles.secondaryButtonText}>
                                        {selectedForm
                                            ? `Formulário selecionado (${selectedForm.perguntas.length} perguntas)`
                                            : "Selecionar formulário"}
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.tertiaryButton}
                                    onPress={() => router.push("/criarFormulario")}
                                >
                                    <Text style={styles.tertiaryButtonText}>Criar novo formulário</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                </View>

                <TouchableOpacity 
                    style={[styles.primaryButton, (isCreating || isUpdating || isLoadingPet) && { opacity: 0.7 }]} 
                    onPress={handleSubmit(handleSave)}
                    disabled={isCreating || isUpdating || isLoadingPet}
                >
                    <Icon1 name="sparkles-outline" size={18} color="#fff" />
                    <Text style={styles.primaryButtonText}>
                        {isLoadingPet ? "Carregando..." : isCreating ? "Criando..." : isUpdating ? "Salvando..." : isEditMode ? "Salvar alterações" : "Criar anúncio"}
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

            {isFormModalOpen && (
                <Pressable style={styles.modalBackdrop} onPress={() => setIsFormModalOpen(false)}>
                    <Pressable style={styles.modalCard} onPress={(event) => event.stopPropagation()}>
                        <Text style={styles.modalTitle}>Selecionar formulário</Text>
                        <Text style={styles.modalSubtitle}>Escolha um formulário para usar na triagem deste pet.</Text>

                        {isLoadingForms ? (
                            <View style={styles.modalStatusRow}>
                                <ActivityIndicator color={colors.primary} />
                                <Text style={styles.modalStatusText}>Carregando formulários...</Text>
                            </View>
                        ) : formError ? (
                            <View style={styles.modalStatusRow}>
                                <Text style={styles.modalStatusText}>{formError}</Text>
                                <TouchableOpacity style={styles.tertiaryButton} onPress={loadMyForms}>
                                    <Text style={styles.tertiaryButtonText}>Tentar novamente</Text>
                                </TouchableOpacity>
                            </View>
                        ) : userForms.length === 0 ? (
                            <View style={styles.modalStatusRow}>
                                <Text style={styles.modalStatusText}>Você ainda não possui formulários.</Text>
                                <TouchableOpacity
                                    style={styles.secondaryButton}
                                    onPress={() => {
                                        setIsFormModalOpen(false);
                                        router.push("/criarFormulario");
                                    }}
                                >
                                    <Text style={styles.secondaryButtonText}>Criar formulário</Text>
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <ScrollView style={styles.formsList} contentContainerStyle={styles.formsListContent}>
                                {userForms.map((form) => {
                                    const selected = selectedFormId === form.id;
                                    return (
                                        <TouchableOpacity
                                            key={form.id}
                                            style={[styles.formOption, selected && styles.formOptionSelected]}
                                            onPress={() => {
                                                setSelectedFormId(form.id);
                                                setIsFormModalOpen(false);
                                            }}
                                        >
                                            <Text style={[styles.formOptionTitle, selected && styles.formOptionTitleSelected]}>
                                                Formulário #{form.id.slice(0, 8)}
                                            </Text>
                                            <Text style={[styles.formOptionSubtitle, selected && styles.formOptionSubtitleSelected]}>
                                                {form.perguntas.length} perguntas
                                            </Text>
                                        </TouchableOpacity>
                                    );
                                })}
                            </ScrollView>
                        )}
                    </Pressable>
                </Pressable>
            )}
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
    triagemSection: {
        marginTop: 8,
        gap: 10,
    },
    triagemActions: {
        gap: 8,
    },
    tertiaryButton: {
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.primary,
        minHeight: 44,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 12,
        backgroundColor: "#fff",
    },
    tertiaryButtonText: {
        color: colors.primary,
        fontWeight: "700",
        fontSize: 13,
    },
    modalBackdrop: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.35)",
        justifyContent: "center",
        paddingHorizontal: 16,
    },
    modalCard: {
        backgroundColor: "#fff",
        borderRadius: 18,
        padding: 16,
        maxHeight: "76%",
        gap: 10,
    },
    modalTitle: {
        fontSize: 20,
        color: colors.primary,
        fontWeight: "800",
    },
    modalSubtitle: {
        color: colors.textMuted,
        fontSize: 13,
    },
    modalStatusRow: {
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        paddingVertical: 10,
    },
    modalStatusText: {
        color: "#666",
        textAlign: "center",
        fontWeight: "600",
    },
    formsList: {
        maxHeight: 320,
    },
    formsListContent: {
        gap: 8,
    },
    formOption: {
        borderRadius: 14,
        borderWidth: 1,
        borderColor: "#E7E7E7",
        backgroundColor: "#F9F9F9",
        paddingHorizontal: 12,
        paddingVertical: 10,
        gap: 2,
    },
    formOptionSelected: {
        borderColor: colors.primary,
        backgroundColor: "#FFE9E6",
    },
    formOptionTitle: {
        fontSize: 14,
        fontWeight: "700",
        color: "#222",
    },
    formOptionTitleSelected: {
        color: colors.primary,
    },
    formOptionSubtitle: {
        fontSize: 12,
        color: "#666",
    },
    formOptionSubtitleSelected: {
        color: colors.primary,
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
    loadingCard: {
        paddingVertical: 14,
        paddingHorizontal: 12,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: "#ececec",
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
    },
    loadingText: {
        color: colors.textMuted,
        textAlign: "center",
        fontWeight: "600",
    },
});
