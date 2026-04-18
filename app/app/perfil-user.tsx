import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, Image, Linking, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon1 from "react-native-vector-icons/Ionicons";
import AppHeader from '../components/AppHeader';
import colors from "../styles/colors";

export default function UserScreen() {
    const router = useRouter();
    
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [telefone, setTelefone] = useState("");
    const [senha, setSenha] = useState("");
    const [moradia, setMoradia] = useState("");
    const [metragem, setMetragem] = useState("");
    const [image, setImage] = useState<string | undefined>(undefined);
    const displayName = username.trim() || "Gabriel Santos";

    const handleSave = () => {
        Alert.alert("Sucesso", "Dados salvos com sucesso.");
    };

    const hasUnsavedChanges =
        username.trim().length > 0 ||
        email.trim().length > 0 ||
        telefone.trim().length > 0 ||
        senha.trim().length > 0 ||
        moradia.trim().length > 0 ||
        metragem.trim().length > 0 ||
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

                    <Text style={styles.profileTitle}>{displayName}</Text>
                </View>

                <SafeAreaView style={styles.formCard} edges={['left', 'right', 'bottom']}>
                    <Field label="Usuário" value={username} onChangeText={setUsername} placeholder="Digite seu nome" />
                    <Field label="E-mail" value={email} onChangeText={setEmail} placeholder="exemplo@gmail.com" keyboardType="email-address" editable={false} />
                    <Field label="Telefone" value={telefone} onChangeText={setTelefone} placeholder="(00) 00000-0000" />
                    <Field label="Senha" value={senha} onChangeText={setSenha} placeholder="Digite sua senha" secureTextEntry />
                    <Field label="Moradia" value={moradia} onChangeText={setMoradia} placeholder="Digite seu endereço..." multiline />
                    <Field label="Metragem" value={metragem} onChangeText={setMetragem} placeholder="Digite a metragem..." />
                </SafeAreaView>

                <TouchableOpacity style={styles.primaryButton} onPress={handleSave}>
                    <Text style={styles.primaryButtonText}>Salvar alterações</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}

type FieldProps = {
    label: string;
    value: string;
    onChangeText: (text: string) => void;
    placeholder: string;
    keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
    secureTextEntry?: boolean;
    editable?: boolean;
    multiline?: boolean;
};

function Field({ label, value, onChangeText, placeholder, keyboardType = "default", secureTextEntry = false, editable = true, multiline = false }: FieldProps) {
    return (
        <View style={styles.fieldWrap}>
            <Text style={styles.label}>{label}</Text>
            <TextInput
                style={[styles.input, multiline && styles.inputMultiline]}
                value={value}
                onChangeText={onChangeText}
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