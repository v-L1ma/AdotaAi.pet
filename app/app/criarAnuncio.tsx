import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import { Alert, Image, InputAccessoryView, Keyboard, Linking, Platform, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import Icon1 from "react-native-vector-icons/Ionicons";
import { colors } from "@/styles/variables";

export default function CriarAnuncioScreen() {
    const router = useRouter();
    const [nome, setNome] = useState("");
    const [idade, setIdade] = useState("");
    const [peso, setPeso] = useState("");
    const [especie, setEspecie] = useState<"gato" | "cachorro" | null>(null);
    const [porte, setPorte] = useState<"pequeno" | "medio" | "grande" | null>(null);
    const [descricao, setDescricao] = useState("");
    const [image, setImage] = useState<string | undefined>(undefined);
    const [focusedField, setFocusedField] = useState<"nome" | "idade" | "peso" | null>(null);

    const nomeRef = useRef<TextInput>(null);
    const idadeRef = useRef<TextInput>(null);
    const pesoRef = useRef<TextInput>(null);
    const toolbarId = "pet-form-toolbar";

    const handleSave = () => {
        alert("Anúncio criado!");
    };

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

                    <Text style={styles.heroTitle}>Nova História</Text>
                    <Text style={styles.heroSubtitle}>Dê voz a um novo companheiro</Text>
                </View>

                <View style={styles.formCard}>
                    <Field
                        label="Nome do Pet"
                        value={nome}
                        onChangeText={setNome}
                        placeholder="Como ele se chama?"
                        inputRef={nomeRef}
                        returnKeyType="next"
                        onSubmitEditing={() => idadeRef.current?.focus()}
                        onFocus={() => setFocusedField("nome")}
                        inputAccessoryViewID={Platform.OS === "ios" ? toolbarId : undefined}
                    />

                    <View style={styles.gridTwo}>
                        <Field
                            label="Idade"
                            value={idade}
                            onChangeText={setIdade}
                            placeholder="Ex.: 2 anos"
                            keyboardType="numeric"
                            inputRef={idadeRef}
                            returnKeyType="next"
                            onSubmitEditing={() => pesoRef.current?.focus()}
                            onFocus={() => setFocusedField("idade")}
                            inputAccessoryViewID={Platform.OS === "ios" ? toolbarId : undefined}
                        />
                        <Field
                            label="Peso (kg)"
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
                </View>

                <View style={styles.block}>
                    <Text style={styles.blockTitle}>Espécie</Text>
                    <View style={styles.row}>
                        <Chip label="Cão" selected={especie === "cachorro"} onPress={() => setEspecie("cachorro")} />
                        <Chip label="Gato" selected={especie === "gato"} onPress={() => setEspecie("gato")} />
                        <Chip label="Outros" selected={false} onPress={() => {}} />
                    </View>
                </View>

                <View style={styles.block}>
                    <Text style={styles.blockTitle}>Porte</Text>
                    <View style={styles.row}>
                        <Chip label="Pequeno" selected={porte === "pequeno"} onPress={() => setPorte("pequeno")} />
                        <Chip label="Médio" selected={porte === "medio"} onPress={() => setPorte("medio")} />
                        <Chip label="Grande" selected={porte === "grande"} onPress={() => setPorte("grande")} />
                    </View>
                </View>

                <View style={styles.block}>
                    <View style={styles.blockHeaderRow}>
                        <Text style={styles.blockTitle}>Descrição & História</Text>
                        <Text style={styles.optional}>OPCIONAL</Text>
                    </View>
                    <Field
                        label=""
                        value={descricao}
                        onChangeText={setDescricao}
                        placeholder="Conte um pouco sobre personalidade, temperamento e o que o torna especial..."
                        multiline
                    />

                    <TouchableOpacity style={styles.secondaryButton} onPress={() => router.push("/gerenciar-formularios") }>
                        <Text style={styles.secondaryButtonText}>Escolher formulário</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.primaryButton} onPress={handleSave}>
                    <Icon1 name="sparkles-outline" size={18} color="#fff" />
                    <Text style={styles.primaryButtonText}>Criar anúncio</Text>
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
        </View>
    );
}

type FieldProps = {
    label: string;
    value: string;
    onChangeText: (text: string) => void;
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