import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Image, Platform, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";
import IconMat from "react-native-vector-icons/MaterialCommunityIcons";
import IconIonic from "react-native-vector-icons/Ionicons";
import { colors } from "@/styles/variables";

export default function PerfilPet(){

    const router = useRouter();
    const insets = useSafeAreaInsets();
    const [heartIcon, setHeartIcon]=useState<string>("heart-outline")
    const [mapLoading, setMapLoading] = useState<boolean>(true);
    const [mapError, setMapError] = useState<string | null>(null);
    const [coordinates, setCoordinates] = useState<{ lat: number; lon: number } | null>(null);

    const {nome, imagem, localizacao, bairro, cidade, uf} = useLocalSearchParams<{
        nome?: string | string[];
        imagem?: string | string[];
        localizacao?: string | string[];
        bairro?: string | string[];
        cidade?: string | string[];
        uf?: string | string[];
    }>();

    const petName = Array.isArray(nome) ? nome[0] : nome || "Alfredo";
    const petImage = Array.isArray(imagem) ? imagem[0] : imagem || "https://img.freepik.com/fotos-gratis/fotografia-vertical-de-foco-superficial-de-um-bonito-cachorro-de-golden-retriever-sentado-em-um-chao-de-grama_181624-27259.jpg?w=360";
    const locationText = useMemo(() => {
        const localizacaoValue = Array.isArray(localizacao) ? localizacao[0] : localizacao;
        if (localizacaoValue && localizacaoValue.trim().length > 0) return localizacaoValue;

        const bairroValue = Array.isArray(bairro) ? bairro[0] : bairro;
        const cidadeValue = Array.isArray(cidade) ? cidade[0] : cidade;
        const ufValue = Array.isArray(uf) ? uf[0] : uf;

        const dynamicParts = [bairroValue, cidadeValue, ufValue].filter(Boolean).join(", ");
        return dynamicParts || "Marapé, Santos - SP";
    }, [bairro, cidade, localizacao, uf]);

    const [description] = useState<string>("É um pet muito carinhoso e cheio de energia, ideal para uma família que busca companhia no dia a dia. Já está vacinado e vermifugado, pronto para encontrar um lar seguro e cheio de amor.")
    const IFrameTag = "iframe" as unknown as React.ElementType;

    function favoritePet(){
        setHeartIcon((prev) => (prev === "heart-outline" ? "heart" : "heart-outline"));
    }

    useEffect(() => {
        let isMounted = true;

        async function geocodeLocation() {
            try {
                setMapLoading(true);
                setMapError(null);

                const query = encodeURIComponent(`${locationText}, Brasil`);
                const response = await fetch(
                    `https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=br&q=${query}`,
                    {
                        headers: {
                            "Accept-Language": "pt-BR",
                            "User-Agent": "AdotaAi.pet/1.0 (mobile app)",
                        },
                    }
                );

                const data = await response.json();
                const first = Array.isArray(data) ? data[0] : null;

                if (!first || !first.lat || !first.lon) {
                    throw new Error("Localização não encontrada.");
                }

                if (!isMounted) return;
                setCoordinates({ lat: Number(first.lat), lon: Number(first.lon) });
            } catch {
                if (!isMounted) return;
                setMapError("Não foi possível carregar o mapa para esta localização.");
            } finally {
                if (!isMounted) return;
                setMapLoading(false);
            }
        }

        geocodeLocation();

        return () => {
            isMounted = false;
        };
    }, [locationText]);

    const mapUrl = useMemo(() => {
        if (!coordinates) return "";

        const delta = 0.008;
        const left = coordinates.lon - delta;
        const right = coordinates.lon + delta;
        const top = coordinates.lat + delta;
        const bottom = coordinates.lat - delta;

        return `https://www.openstreetmap.org/export/embed.html?bbox=${left}%2C${bottom}%2C${right}%2C${top}&layer=mapnik&marker=${coordinates.lat}%2C${coordinates.lon}`;
    }, [coordinates]);

    return(
        <View style={style.container}>
            <ScrollView contentContainerStyle={style.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={style.heroWrapper}>
                    <Image style={style.heroImage} resizeMode="cover" source={{uri:petImage}}></Image>
                    <LinearGradient
                        pointerEvents="none"
                        colors={["rgba(248, 249, 250, 0)", "rgba(248, 249, 250, 0.12)", "rgba(248, 249, 250, 0.35)", "rgba(248, 249, 250, 0.7)", "#F8F9FA"]}
                        locations={[0, 0.42, 0.68, 0.88, 1]}
                        start={{ x: 0.5, y: 0 }}
                        end={{ x: 0.5, y: 1 }}
                        style={style.heroFade}
                    />

                    <SafeAreaView style={[style.header, { paddingTop: insets.top + 8, paddingHorizontal: 20 }]}>
                        <TouchableOpacity onPress={router.back} style={style.headerButtons} activeOpacity={0.8}>
                            <IconIonic name="arrow-back" size={24} color={colors.primary} />
                        </TouchableOpacity>
                        <View style={style.headerSpacer} />
                    </SafeAreaView>

                    <Pressable onPress={()=>favoritePet()} style={style.favoriteFloatingButton}>
                        <IconMat name={heartIcon} size={29} color={colors.primary}></IconMat>
                    </Pressable>
                </View>

                <View style={style.content}>
                    <View style={style.identity}>
                        <Text style={style.name}>{petName}</Text>
                        <View style={style.locationRow}>
                            <IconIonic name="location-outline" size={18} color={colors.primary}></IconIonic>
                            <Text style={style.locationText}>{locationText}</Text>
                        </View>
                    </View>

                    <View style={style.caracteristicasContainer}>
                        <View style={style.caracteristicasCard}>
                            <Text style={style.kicker}>Idade</Text>
                            <Text style={style.tituloCard}>9 meses</Text>
                        </View>

                        <View style={style.caracteristicasCard}>
                            <Text style={style.kicker}>Gênero</Text>
                            <Text style={style.tituloCard}>Macho</Text>
                        </View>

                        <View style={style.caracteristicasCard}>
                            <Text style={style.kicker}>Peso</Text>
                            <Text style={style.tituloCard}>3.5kg</Text>
                        </View>
                    </View>

                    <View style={style.aboutCard}>
                        <View style={style.aboutHeader}>
                            <Text style={style.aboutTitle}>Sobre</Text>
                            <View style={style.divider}></View>
                        </View>
                        <Text style={style.aboutText}>{description}</Text>

                        <View style={style.publisher}>
                            <Image
                                source={{uri: "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=300"}}
                                style={style.publisherImage}
                            ></Image>
                            <View>
                                <Text style={style.publisherLabel}>Publicado por</Text>
                                <Text style={style.publisherName}>Ricardo Silva</Text>
                            </View>
                            <Pressable style={style.chatButton}>
                                <IconIonic name="chatbubble-ellipses-outline" size={20} color={colors.primary}></IconIonic>
                            </Pressable>
                        </View>
                    </View>

                    <View style={style.mapSection}>
                        <Text style={style.mapTitle}>Encontre o {petName}</Text>
                        <View style={style.mapFrame}>
                            {mapLoading ? (
                                <View style={style.mapFallback}>
                                    <ActivityIndicator size="small" color={colors.primary} />
                                    <Text style={style.mapStatus}>Carregando mapa...</Text>
                                </View>
                            ) : mapError || !mapUrl ? (
                                <View style={style.mapFallback}>
                                    <IconIonic name="map-outline" size={24} color={colors.primary} />
                                    <Text style={style.mapStatus}>{mapError || "Mapa indisponível no momento."}</Text>
                                </View>
                            ) : (
                                Platform.OS === "web" ? (
                                    <IFrameTag
                                        src={mapUrl}
                                        style={style.mapIframe as never}
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                    />
                                ) : (
                                    <WebView
                                        style={style.mapWebview}
                                        source={{ uri: mapUrl }}
                                        scrollEnabled={false}
                                        showsHorizontalScrollIndicator={false}
                                        showsVerticalScrollIndicator={false}
                                    />
                                )
                            )}
                        </View>
                    </View>
                </View>
            </ScrollView>

            <View style={style.footer}>
                <TouchableOpacity style={style.button}>
                    <Text style={style.buttonText}>Quero adotar!</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const style = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:"#F8F9FA",
        position:"relative",
    },
    scrollContent: {
        paddingBottom: 130,
    },
    heroWrapper: {
        width: "100%",
        height: 320,
        position: "relative",
    },
    heroImage: {
        width: "100%",
        height: "100%",
    },
    heroFade: {
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        height: 150,
    },
    header:{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        flexDirection:"row",
        justifyContent:"space-between",
        alignItems:"center",
        zIndex:2,
        paddingHorizontal:20,
    },
    headerSpacer: {
        width: 44,
        height: 44,
    },
    favoriteFloatingButton: {
        position: "absolute",
        right: 10,
        top: 300,
        bottom: 2,
        width: 44,
        height: 44,
        borderRadius: 100,
        backgroundColor: "#ffffff",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 3,
    },
    content: {
        paddingHorizontal: 20,
        marginTop: 6,
        gap: 18,
    },
    identity: {
        marginTop: 18,
    },
    name: {
        fontSize:34,
        fontWeight:"900",
        color:"#202020",
        fontStyle: "italic",
    },
    locationRow: {
        marginTop: 4,
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
    },
    locationText:{
        fontSize:15,
        color:"rgba(0, 0, 0, 0.64)",
    },
    caracteristicasContainer:{
        flexDirection:"row",
        justifyContent:"space-between",
        gap:10,
    },
    caracteristicasCard:{
        backgroundColor:"#FFE3E0",
        width:"30%",
        paddingVertical:14,
        borderRadius:20,
        alignItems: "center",
    },
    kicker: {
        textTransform: "uppercase",
        fontSize: 10,
        letterSpacing: 0.6,
        color: "#8A5550",
        fontWeight: "700",
    },
    tituloCard:{
        marginTop: 3,
        color:"#3A1210",
        fontWeight:"900"
    },
    aboutCard: {
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: "#EFEFEF",
        borderRadius: 26,
        padding: 18,
        gap: 12,
    },
    aboutHeader: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
    aboutTitle: {
        fontSize: 23,
        color: colors.primary,
        fontWeight: "800",
    },
    divider: {
        flex: 1,
        height: 2,
        borderRadius: 999,
        backgroundColor: "#F1D6D2",
    },
    aboutText: {
        color:"rgba(0, 0, 0, 0.62)",
        fontSize:16,
        lineHeight:24,
    },
    publisher: {
        marginTop: 4,
        backgroundColor: "#F7F7F7",
        borderRadius: 16,
        padding: 12,
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
    publisherImage: {
        width: 46,
        height: 46,
        borderRadius: 12,
    },
    publisherLabel: {
        fontSize: 12,
        color: "#666",
    },
    publisherName: {
        fontSize: 15,
        fontWeight: "700",
        color: "#222",
    },
    chatButton: {
        marginLeft: "auto",
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#FFE9E6",
        justifyContent: "center",
        alignItems: "center",
    },
    mapSection: {
        gap: 10,
    },
    mapTitle: {
        fontSize: 22,
        color: "#222",
        fontWeight: "800",
    },
    mapFrame: {
        width: "100%",
        height: 180,
        borderRadius: 24,
        overflow: "hidden",
        backgroundColor: "#F1F1F1",
    },
    mapWebview: {
        flex: 1,
        backgroundColor: "transparent",
    },
    mapIframe: {
        width: "100%",
        height: "100%",
        borderWidth: 0,
    },
    mapFallback: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        paddingHorizontal: 20,
    },
    mapStatus: {
        color: "#555",
        fontSize: 13,
        textAlign: "center",
    },
    footer: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: 20,
        paddingTop: 14,
        paddingBottom: 22,
        backgroundColor: "rgba(255,255,255,0.94)",
        borderTopWidth: 1,
        borderTopColor: "#F0F0F0",
    },
    button:{
        backgroundColor:colors.primary,
        width:"100%",
        paddingVertical:16,
        borderRadius:16,
        alignItems:"center",
    },
    buttonText: {
        color: "white",
        fontSize: 19,
        fontWeight: "800",
    },
    headerButtons:{
        width:44,
        height:44,
        justifyContent:"center",
        alignItems:"center",
        borderRadius:14,
        position: "relative",
        backgroundColor: "#FFFFFF",
    },
    
});
