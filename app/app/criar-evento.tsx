import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Alert, Keyboard, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import Icon1 from "react-native-vector-icons/Ionicons";
import { colors } from "@/styles/variables";
import apiService from "@/services/apiService";
import AppHeader from "@/components/AppHeader";

const timeRegex = /^([01]\d|2[0-3]):[0-5]\d$/;

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
            (valor) => timeRegex.test(valor) || !Number.isNaN(Date.parse(valor)),
            "Informe o horario no formato HH:mm ou ISO",
        ),
    hrfim: z
        .string()
        .trim()
        .refine(
            (valor) => timeRegex.test(valor) || !Number.isNaN(Date.parse(valor)),
            "Informe o horario no formato HH:mm ou ISO",
        ),
    descricao: z.string().trim().min(10, "Descricao deve ter pelo menos 10 caracteres"),
});

type CriarEventoFormData = z.infer<typeof criarEventoSchema>;

type EventoDTO = {
    id?: string;
    nome: string;
    endereco?: string;
    bairro?: string;
    cidade?: string;
    cep?: string;
    hrinicio?: string;
    hrfim?: string;
    descricao?: string;
    data?: string;
};

export default function CriarEventoScreen() {
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showStartTimePicker, setShowStartTimePicker] = useState(false);
    const [showEndTimePicker, setShowEndTimePicker] = useState(false);

    const params = useLocalSearchParams<{ id?: string }>();
    const eventoId = Array.isArray(params.id) ? params.id[0] : params.id;
    const isEditing = !!eventoId;

    const [eventoData, setEventoData] = useState<EventoDTO | null>(null);
    const [isLoadingEvento, setIsLoadingEvento] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (!isEditing || !eventoId) {
            return;
        }

        let isMounted = true;

        async function loadEvento() {
            setIsLoadingEvento(true);
            try {
                const response = await apiService.get<EventoDTO>(`/eventos/${eventoId}`);
                if (isMounted) {
                    setEventoData(response.data);
                }
            } catch {
                Alert.alert("Erro", "Nao foi possivel carregar os dados do evento.");
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
    }, [eventoData, reset]);

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

    const formatarHora = (value: string) => {
        if (!value) {
            return "Selecionar horario";
        }

        if (timeRegex.test(value)) {
            return value;
        }

        const parsed = new Date(value);
        if (Number.isNaN(parsed.getTime())) {
            return "Selecionar horario";
        }

        return parsed.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
    };

    const buildDateTimeIso = (time: Date, dateString?: string) => {
        const base = dateString && /^\d{4}-\d{2}-\d{2}$/.test(dateString)
            ? new Date(`${dateString}T00:00:00`)
            : new Date();
        const result = new Date(base);
        result.setHours(time.getHours(), time.getMinutes(), 0, 0);
        return result.toISOString();
    };

    const normalizeTime = (value: string, dateString?: string) => {
        if (timeRegex.test(value)) {
            const baseDate = dateString && /^\d{4}-\d{2}-\d{2}$/.test(dateString)
                ? dateString
                : new Date().toISOString().slice(0, 10);
            return new Date(`${baseDate}T${value}:00`).toISOString();
        }
        return value;
    };

    const handleSave = async (data: CriarEventoFormData) => {
        const payload = {
            ...data,
            hrinicio: normalizeTime(data.hrinicio, data.data),
            hrfim: normalizeTime(data.hrfim, data.data),
        };

        setIsSaving(true);
        try {
            if (isEditing && eventoId) {
                await apiService.put(`/eventos/${eventoId}`, payload);
                Alert.alert("Sucesso", "Evento atualizado com sucesso!");
                router.back();
                return;
            }

            await apiService.post("/eventos", payload);
            Alert.alert("Sucesso", "Evento criado com sucesso!");
            reset();
        } catch {
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
                    <View style={styles.heroIcon}>
                        <Icon1 name="calendar-outline" size={28} color="#fff" />
                    </View>
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
                                            <Icon1 name="calendar-outline" size={20} color={colors.primary} />
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
                                render={({ field: { onChange, value } }) => (
                                    <View>
                                        <Field
                                            label="Inicio"
                                            value={value}
                                            onChangeText={onChange}
                                            placeholder="HH:mm"
                                        />
                                        {!isWeb && (
                                            <TouchableOpacity
                                                style={styles.timePickerButton}
                                                onPress={() => setShowStartTimePicker(true)}
                                            >
                                                <Icon1 name="time-outline" size={18} color="#fff" />
                                            </TouchableOpacity>
                                        )}
                                        {showStartTimePicker && (
                                            <DateTimePicker
                                                value={value && timeRegex.test(value)
                                                    ? new Date(`2000-01-01T${value}:00`)
                                                    : value && !Number.isNaN(Date.parse(value))
                                                        ? new Date(value)
                                                        : new Date()}
                                                mode="time"
                                                display="default"
                                                onChange={(event, date) => {
                                                    if (date) {
                                                        const hours = String(date.getHours()).padStart(2, "0");
                                                        const minutes = String(date.getMinutes()).padStart(2, "0");
                                                        onChange(`${hours}:${minutes}`);
                                                    }
                                                    setShowStartTimePicker(false);
                                                }}
                                            />
                                        )}
                                    </View>
                                )}
                            />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Controller
                                control={control}
                                name="hrfim"
                                render={({ field: { onChange, value } }) => (
                                    <View>
                                        <Field
                                            label="Fim"
                                            value={value}
                                            onChangeText={onChange}
                                            placeholder="HH:mm"
                                        />
                                        {!isWeb && (
                                            <TouchableOpacity
                                                style={styles.timePickerButton}
                                                onPress={() => setShowEndTimePicker(true)}
                                            >
                                                <Icon1 name="time-outline" size={18} color="#fff" />
                                            </TouchableOpacity>
                                        )}
                                        {showEndTimePicker && (
                                            <DateTimePicker
                                                value={value && timeRegex.test(value)
                                                    ? new Date(`2000-01-01T${value}:00`)
                                                    : value && !Number.isNaN(Date.parse(value))
                                                        ? new Date(value)
                                                        : new Date()}
                                                mode="time"
                                                display="default"
                                                onChange={(event, date) => {
                                                    if (date) {
                                                        const hours = String(date.getHours()).padStart(2, "0");
                                                        const minutes = String(date.getMinutes()).padStart(2, "0");
                                                        onChange(`${hours}:${minutes}`);
                                                    }
                                                    setShowEndTimePicker(false);
                                                }}
                                            />
                                        )}
                                    </View>
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
                    <Icon1 name="sparkles-outline" size={18} color="#fff" />
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