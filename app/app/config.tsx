import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "@/styles/variables";
import AppHeader from "@/components/AppHeader";

type SettingItem = {
    title: string;
    icon: keyof typeof Ionicons.glyphMap;
    route: string;
    badge?: string;
};

export default function ConfigScreen() {
    const router = useRouter();
    const { width } = useWindowDimensions();
    const isTablet = width >= 768;

    const accountItems: SettingItem[] = [
        { title: "Conta", icon: "person-circle-outline", route: "/perfil-user" },
        { title: "Meus pets", icon: "paw-outline", route: "/meus-pets" },
        { title: "Solicitações", icon: "notifications-outline", route: "/solicitacoes", badge: "3" },
        { title: "Meus favoritos", icon: "heart-outline", route: "/meus-favoritos" },
        { title: "Formulários", icon: "document-text-outline", route: "/gerenciar-formularios" },
        { title: "Meus Eventos", icon: "calendar-outline", route: "/meus-eventos" },
        { title: "Eventos Inscritos", icon: "calendar-outline", route: "/eventos-inscritos" },
    ];

    const infoItems: SettingItem[] = [
        { title: "Sobre nós", icon: "help-circle-outline", route: "/sobre-nos" },
    ];

    function renderItem(item: SettingItem) {
        return (
            <TouchableOpacity
                key={item.title}
                style={[styles.card, isTablet && styles.cardTablet]}
                onPress={() => router.push(item.route as never)}
                activeOpacity={0.8}
            >
                <View style={styles.cardRow}>
                    <View style={styles.iconWrap}>
                        <Ionicons name={item.icon} size={22} color={colors.primary} />
                    </View>

                    <View style={styles.cardTextWrap}>
                        <Text style={styles.cardTitle}>{item.title}</Text>
                    </View>

                    <View style={styles.cardActions}>
                        {item.badge ? (
                            <View style={styles.badge}>
                                <Text style={styles.badgeText}>{item.badge}</Text>
                            </View>
                        ) : null}
                        <Ionicons name="chevron-forward" size={18} color="#6A5A59" />
                    </View>
                </View>
            </TouchableOpacity>
        );
    }

    return (
        <SafeAreaView style={styles.screen} edges={["top", "left", "right"]}>
            <AppHeader title="Configurações" onBackPress={() => router.back()} />

            <ScrollView
                style={styles.scroll}
                contentContainerStyle={[styles.content, isTablet && styles.contentTablet]}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.profileTeaser}>
                    <View style={styles.avatar}>
                        <Ionicons name="person" size={24} color={colors.primary} />
                    </View>

                    <View style={styles.profileTextWrap}>
                        <Text style={styles.profileName}>Fulano</Text>
                        <Text style={styles.profileSub}>Santos • São Paulo</Text>
                    </View>
                </View>

                <Text style={styles.sectionLabel}>Preferências da conta</Text>
                <View style={styles.cardsWrap}>{accountItems.map(renderItem)}</View>

                <Text style={styles.sectionLabel}>Informações</Text>
                <View style={styles.cardsWrap}>{infoItems.map(renderItem)}</View>

                <TouchableOpacity style={styles.logout} onPress={() => router.replace("/login") }>
                    <Ionicons name="exit-outline" size={20} color="#A31A14" />
                    <Text style={styles.logoutText}>Sair da conta</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: colors.surface,
    },
    scroll: {
        flex: 1,
        paddingTop: 50,
    },
    content: {
        paddingHorizontal: 20,
        paddingTop: 14,
        paddingBottom: 30,
        gap: 12,
    },
    contentTablet: {
        alignSelf: "center",
        width: "100%",
        maxWidth: 980,
    },
    header: {
        backgroundColor: colors.surfaceLowest,
        borderBottomLeftRadius: 26,
        borderBottomRightRadius: 26,
        paddingTop: 10,
        paddingBottom: 16,
        paddingHorizontal: 16,
        flexDirection: "row",
        alignItems: "center",
        shadowColor: "#000",
        shadowOpacity: 0.06,
        shadowRadius: 6,
        elevation: 2,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.surface,
    },
    headerContent: {
        flex: 1,
        alignItems: "center",
        paddingRight: 40,
    },
    headerTitle: {
        fontSize: 26,
        fontWeight: "900",
        color: colors.primary,
        textAlign: "center",
    },
    headerSubtitle: {
        marginTop: 2,
        fontSize: 13,
        color: colors.textMuted,
        textAlign: "center",
    },
    profileTeaser: {
        marginTop: 4,
        marginBottom: 4,
        padding: 14,
        borderRadius: 20,
        backgroundColor: colors.surfaceLowest,
        borderWidth: 1,
        borderColor: "#ECECEC",
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    avatar: {
        width: 58,
        height: 58,
        borderRadius: 18,
        backgroundColor: "#FFE5E2",
        alignItems: "center",
        justifyContent: "center",
    },
    profileTextWrap: {
        flex: 1,
    },
    profileName: {
        fontSize: 18,
        color: colors.text,
        fontWeight: "800",
    },
    profileSub: {
        fontSize: 13,
        color: colors.textMuted,
        marginTop: 2,
    },
    sectionLabel: {
        marginTop: 10,
        marginBottom: 4,
        fontSize: 11,
        textTransform: "uppercase",
        letterSpacing: 1,
        color: "#8A8A8A",
        fontWeight: "800",
        paddingHorizontal: 4,
    },
    cardsWrap: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 10,
    },
    card: {
        width: "100%",
        minHeight: 66,
        borderRadius: 18,
        backgroundColor: colors.surfaceLowest,
        borderWidth: 1,
        borderColor: "#ECECEC",
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
    },
    cardTablet: {
        width: "49%",
    },
    cardRow: {
        flexDirection: "row",
        alignItems: "center",
        minHeight: 66,
        paddingHorizontal: 12,
        gap: 10,
    },
    iconWrap: {
        width: 38,
        height: 38,
        borderRadius: 12,
        backgroundColor: "#FFF2F0",
        alignItems: "center",
        justifyContent: "center",
    },
    cardTextWrap: {
        flex: 1,
        minWidth: 0,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: "700",
        color: colors.text,
    },
    cardActions: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    badge: {
        backgroundColor: colors.primary,
        borderRadius: 999,
        paddingHorizontal: 8,
        paddingVertical: 2,
    },
    badgeText: {
        color: "#fff",
        fontSize: 11,
        fontWeight: "800",
    },
    logout: {
        marginTop: 14,
        backgroundColor: "#FFE7E5",
        borderWidth: 1,
        borderColor: "#FFCDC9",
        borderRadius: 16,
        minHeight: 56,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        gap: 8,
    },
    logoutText: {
        color: "#A31A14",
        fontSize: 16,
        fontWeight: "800",
    },
});