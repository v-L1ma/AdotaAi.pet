import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Alert, Image, Platform, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import IconMat from "react-native-vector-icons/MaterialCommunityIcons";
import IconIonic from "react-native-vector-icons/Ionicons";
import { colors } from "@/styles/variables";
import React from "react";
import { petFormLinkStore } from "@/lib/petFormLinkStore";
import { sentSolicitacoesStore } from "@/lib/sentSolicitacoesStore";
import { getPetImageUrl, petService } from "../services/petService";
import { solicitacaoService } from "@/services/solicitacaoService";
import { WebView } from "react-native-webview";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BuscarPetDTO } from "@/types/pet";
import apiService from "@/services/apiService";

type UsuarioResumoDTO = {
    id?: string;
    nome?: string;
    link_foto?: string;
    endereco?: string;
    bairro?: string;
    cidade?: string;
    sg_estado?: string;
};

type ApiResponse<T> = {
    data?: T[];
};

export default function PerfilPet(){

    function formatWithFirstUpper(value?: string) {
        if (!value) {
            return "Nao informado";
        }

        const normalized = value.trim().toLowerCase();
        if (!normalized) {
            return "Nao informado";
        }

        if (normalized === "medio") {
            return "Médio";
        }

        return normalized.charAt(0).toUpperCase() + normalized.slice(1);
    }

    const router = useRouter();
    const insets = useSafeAreaInsets();
    const [mapLoading, setMapLoading] = useState<boolean>(true);
    const [mapError, setMapError] = useState<string | null>(null);
    const [coordinates, setCoordinates] = useState<{ lat: number; lon: number } | null>(null);
    const [ownerLocation, setOwnerLocation] = useState<string | null>(null);
    const [ownerPhoto, setOwnerPhoto] = useState<string | null>(null);

    const {nome, imagem, localizacao, bairro, cidade, uf} = useLocalSearchParams<{
        nome?: string | string[];
        imagem?: string | string[];
        localizacao?: string | string[];
        bairro?: string | string[];
        cidade?: string | string[];
        uf?: string | string[];
    }>();

    const paramPetName = Array.isArray(nome) ? nome[0] : nome;
    const paramPetImage = Array.isArray(imagem) ? imagem[0] : imagem;
    const locationText = useMemo(() => {
        if (ownerLocation && ownerLocation.trim().length > 0) {
            return ownerLocation;
        }

        const localizacaoValue = Array.isArray(localizacao) ? localizacao[0] : localizacao;
        if (localizacaoValue && localizacaoValue.trim().length > 0) return localizacaoValue;

        const bairroValue = Array.isArray(bairro) ? bairro[0] : bairro;
        const cidadeValue = Array.isArray(cidade) ? cidade[0] : cidade;
        const ufValue = Array.isArray(uf) ? uf[0] : uf;

        const dynamicParts = [bairroValue, cidadeValue, ufValue].filter(Boolean).join(", ");
        return dynamicParts || "Localizacao nao informada";
    }, [bairro, cidade, localizacao, ownerLocation, uf]);

    const IFrameTag = "iframe" as unknown as React.ElementType;

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

     const [isTogglingFavorite, setIsTogglingFavorite] = useState<boolean>(false);
    const [isPetFavorited, setIsPetFavorited] = useState<boolean>(false);
    const [pet, setPet] = useState<BuscarPetDTO | null>(null);
    const [isLoadingPet, setIsLoadingPet] = useState<boolean>(false);
    const [isCreatingSolicitacao, setIsCreatingSolicitacao] = useState<boolean>(false);
    const [petError, setPetError] = useState<string | null>(null);

    const params = useLocalSearchParams<{ id?: string }>();
    const petId = Array.isArray(params.id) ? params.id[0] : params.id;

    useEffect(() => {
        async function loadPetById() {
            if (!petId) {
                setPetError("ID do pet nao informado.");
                return;
            }

            setIsLoadingPet(true);
            setPetError(null);

            try {
                const data = await petService.getById(petId);
                const favoritado =
                    data.isFavoritado ??
                    (data as BuscarPetDTO & { isFavorito?: boolean }).isFavorito ??
                    (data as BuscarPetDTO & { favoritado?: boolean }).favoritado ??
                    false;

                setPet({ ...data, isFavoritado: favoritado });
                setIsPetFavorited(favoritado);
            } catch {
                setPetError("Nao foi possivel carregar os dados do pet.");
            } finally {
                setIsLoadingPet(false);
            }
        }

        loadPetById();
    }, [petId]);

    useEffect(() => {
        if (!pet) {
            setIsPetFavorited(false);
            return;
        }

        const favoritado = pet.isFavoritado ?? false;
        setIsPetFavorited(favoritado);
    }, [pet]);

    useEffect(() => {
        async function loadOwnerLocation() {
            const ownerId = pet?.dono?.id;
            if (!ownerId) {
                setOwnerLocation(null);
                setOwnerPhoto(null);
                return;
            }

            try {
                const response = await apiService.get<ApiResponse<UsuarioResumoDTO>>("/usuario");
                const usuarios = response.data?.data ?? [];
                const owner = usuarios.find((usuario) => usuario.id === ownerId);

                if (!owner) {
                    setOwnerLocation(null);
                    setOwnerPhoto(null);
                    return;
                }

                const location = [owner.bairro, owner.cidade, owner.sg_estado].filter(Boolean).join(", ");
                setOwnerLocation(location || owner.endereco || null);
                setOwnerPhoto(owner.link_foto?.trim() || null);
            } catch {
                setOwnerLocation(null);
                setOwnerPhoto(null);
            }
        }

        void loadOwnerLocation();
    }, [pet?.dono?.id]);

    const ageLabel = useMemo(() => {
        if (!pet?.dt_nasc) {
            return "Nao informado";
        }

        const birthDate = new Date(pet.dt_nasc);
        if (Number.isNaN(birthDate.getTime())) {
            return "Nao informado";
        }

        const today = new Date();

        if (birthDate > today) {
            return "Nao informado";
        }

        let years = today.getFullYear() - birthDate.getFullYear();
        let months = today.getMonth() - birthDate.getMonth();

        if (today.getDate() < birthDate.getDate()) {
            months -= 1;
        }

        if (months < 0) {
            years -= 1;
            months += 12;
        }

        if (years < 0) {
            return "Nao informado";
        }

        const parts: string[] = [];

        if (years > 0) {
            parts.push(`${years} ${years === 1 ? "ano" : "anos"}`);
        }

        if (months > 0) {
            parts.push(`${months} ${months === 1 ? "mes" : "meses"}`);
        }

        if (parts.length === 0) {
            return "0 meses";
        }

        return parts.join(" e ");
    }, [pet?.dt_nasc]);

    async function favoritePet(){
        if (!petId || !pet || isTogglingFavorite) {
            return;
        }

        setIsTogglingFavorite(true);
        try {
            if (isPetFavorited) {
                await petService.unfavorite(petId);
                setIsPetFavorited(false);
                setPet((currentPet) => currentPet ? { ...currentPet, isFavoritado: false } : currentPet);
                return;
            }

            await petService.favorite(petId);
            setIsPetFavorited(true);
            setPet((currentPet) => currentPet ? { ...currentPet, isFavoritado: true } : currentPet);
        } finally {
            setIsTogglingFavorite(false);
        }
    }

    async function startAdoptionFlow() {
        if (!petId || isCreatingSolicitacao) {
            return;
        }

        setIsCreatingSolicitacao(true);
        try {
            const formularioId = await petFormLinkStore.getFormIdByPetId(petId);
            if (!formularioId) {
                Alert.alert("Adoção", "Este pet ainda não possui formulário de triagem vinculado.");
                return;
            }

            const solicitacao = await solicitacaoService.criar(formularioId);
            await sentSolicitacoesStore.add(solicitacao.id);

            router.push({
                pathname: "/responder-formulario",
                params: {
                    solicitacaoId: solicitacao.id,
                },
            });
        } catch (error) {
            const message = error instanceof Error ? error.message : "Não foi possível iniciar a adoção.";
            Alert.alert("Erro", message);
        } finally {
            setIsCreatingSolicitacao(false);
        }
    }

    const petName = pet?.nome || paramPetName || "Pet";
    const petImage = getPetImageUrl(pet?.link_foto || paramPetImage);
    const petDescription = pet?.descricao || "Sem descricao no momento.";
    const petOwnerName = pet?.dono?.nome || "Responsavel nao informado";

    function goToOwnerPets() {
        const ownerId = pet?.dono?.id;
        if (!ownerId) {
            return;
        }

        router.push({
            pathname: "/listagem-pets",
            params: {
                ownerId,
                ownerName: petOwnerName,
            },
        });
    }

    return(
        <View style={style.container}>
            <ScrollView contentContainerStyle={style.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={style.heroWrapper}>
                    <Image style={style.heroImage} resizeMode="cover" source={{uri:petImage ?? "../assets/images/dog1.png"}}></Image>
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
                        <IconMat name={isPetFavorited ? "heart" : "heart-outline"} size={29} color={colors.primary}></IconMat>
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
                            <Text style={style.tituloCard}>{ageLabel}</Text>
                        </View>

                        <View style={style.caracteristicasCard}>
                            <Text style={style.kicker}>Espécie</Text>
                            <Text style={style.tituloCard}>{formatWithFirstUpper(pet?.especie)}</Text>
                        </View>

                        <View style={style.caracteristicasCard}>
                            <Text style={style.kicker}>Porte</Text>
                            <Text style={style.tituloCard}>{formatWithFirstUpper(pet?.porte)}</Text>
                        </View>
                    </View>

                    <View style={style.aboutCard}>
                        <View style={style.aboutHeader}>
                            <Text style={style.aboutTitle}>Sobre</Text>
                            <View style={style.divider}></View>
                        </View>
                        <Text style={style.aboutText}>{petDescription}</Text>

                        <View style={style.publisher}>
                            {ownerPhoto ? (
                                <Image source={{ uri: ownerPhoto }} style={style.publisherImage}></Image>
                            ) : (
                                <View style={[style.publisherImage, style.publisherImageFallback]}>
                                    <IconIonic name="person-outline" size={22} color={colors.primary} />
                                </View>
                            )}

                            <View style={style.publisherInfo}>
                                <Text style={style.publisherLabel}>Publicado por</Text>
                                <Text style={style.publisherName}>{petOwnerName}</Text>
                            </View>

                            <TouchableOpacity
                                style={[style.ownerPetsButton, !pet?.dono?.id && style.ownerPetsButtonDisabled]}
                                onPress={goToOwnerPets}
                                disabled={!pet?.dono?.id}
                                activeOpacity={0.8}
                            >
                                <IconMat name="paw" size={20} color={colors.primary}></IconMat>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {isLoadingPet && (
                        <View style={style.statusCard}>
                            <ActivityIndicator size="small" color={colors.primary} />
                            <Text style={style.statusText}>Carregando dados do pet...</Text>
                        </View>
                    )}

                    {petError && (
                        <View style={style.statusCard}>
                            <Text style={style.statusText}>{petError}</Text>
                        </View>
                    )}

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
                <TouchableOpacity
                    style={[style.button, isCreatingSolicitacao && { opacity: 0.7 }]}
                    onPress={startAdoptionFlow}
                    disabled={isCreatingSolicitacao}
                >
                    <Text style={style.buttonText}>{isCreatingSolicitacao ? "Iniciando..." : "Quero adotar!"}</Text>
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
        statusCard: {
            backgroundColor: "#FFFFFF",
            borderRadius: 16,
            borderWidth: 1,
            borderColor: "#EDEDED",
            padding: 14,
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
        },
        statusText: {
            color: "#666",
            textAlign: "center",
            fontWeight: "600",
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
    publisherImageFallback: {
        backgroundColor: "#FFE9E6",
        alignItems: "center",
        justifyContent: "center",
    },
    publisherInfo: {
        flex: 1,
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
    ownerPetsButton: {
        marginLeft: "auto",
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#FFE9E6",
        justifyContent: "center",
        alignItems: "center",
    },
    ownerPetsButtonDisabled: {
        opacity: 0.5,
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
