import { HeaderBackButton } from "@react-navigation/elements";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Image, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import IconMat from "react-native-vector-icons/MaterialCommunityIcons";
import IconIonic from "react-native-vector-icons/Ionicons";
import { colors } from "@/styles/variables";
import React from "react";
import apiService from "../services/apiService";

type BuscarPetDTO = {
    id: string;
    descricao?: string;
    dt_nasc?: string;
    nome?: string;
    porte?: string;
    raca?: string;
    especie?: string;
    link_foto?: string;
    isFavoritado?: boolean;
    isFavorito?: boolean;
    dono?: {
        id: string;
        nome: string;
    };
};

export default function PerfilPet(){

    const router = useRouter();
    const [isTogglingFavorite, setIsTogglingFavorite] = useState<boolean>(false);
    const [isPetFavorited, setIsPetFavorited] = useState<boolean>(false);
    const [pet, setPet] = useState<BuscarPetDTO | null>(null);
    const [isLoadingPet, setIsLoadingPet] = useState<boolean>(false);
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
                const response = await apiService.get<BuscarPetDTO>(`/pets/${petId}`);
                const favoritado =
                    response.data.isFavoritado ??
                    response.data.isFavorito ??
                    (response.data as BuscarPetDTO & { favoritado?: boolean }).favoritado ??
                    false;

                setPet({ ...response.data, isFavoritado: favoritado, isFavorito: favoritado });
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

        const favoritado = pet.isFavoritado ?? pet.isFavorito ?? false;
        setIsPetFavorited(favoritado);
    }, [pet]);

    const birthDateLabel = useMemo(() => {
        if (!pet?.dt_nasc) {
            return "Nao informado";
        }

        const date = new Date(pet.dt_nasc);
        if (Number.isNaN(date.getTime())) {
            return "Nao informado";
        }

        return date.toLocaleDateString("pt-BR");
    }, [pet?.dt_nasc]);

    const petName = pet?.nome || "Pet";
    const petImage = pet?.link_foto || "";
    const petDescription = pet?.descricao || "Descricao nao informada.";
    const petSpecies = pet?.especie || "Nao informado";
    const petPorte = pet?.porte || "Nao informado";

    async function favoritePet(){
        if (!petId || !pet || isTogglingFavorite) {
            return;
        }

        setIsTogglingFavorite(true);
        try {
            if (isPetFavorited) {
                await apiService.delete(`/pets/${petId}/favoritar`);
                setIsPetFavorited(false);
                setPet((currentPet) => currentPet ? { ...currentPet, isFavoritado: false, isFavorito: false } : currentPet);
                return;
            }

            await apiService.post(`/pets/${petId}/favoritar`);
            setIsPetFavorited(true);
            setPet((currentPet) => currentPet ? { ...currentPet, isFavoritado: true, isFavorito: true } : currentPet);
        } finally {
            setIsTogglingFavorite(false);
        }
    }

    return(
        <View style={style.container}>
            <View style={style.header}>
                <HeaderBackButton onPress={router.back} style={style.headerButtons}></HeaderBackButton>
                <Pressable onPress={()=>favoritePet()} style={style.headerButtons} disabled={isTogglingFavorite}>
                    {
                        isTogglingFavorite ? (
                            <ActivityIndicator size="small" color={colors.primary}></ActivityIndicator>
                        ) : (
                            <IconMat
                                name={isPetFavorited ? "heart" : "heart-outline"}
                                size={35}
                                color={isPetFavorited ? "red" : "black"}
                            ></IconMat>
                        )
                    }
                </Pressable>
            </View>

            <View style={style.image}>
                {
                    petImage ? (
                        <Image style={{height:"100%", width:"80%", margin:"auto"}} resizeMode="stretch" source={{uri:petImage}}></Image>
                    ) : (
                        <View style={style.emptyImage}>
                            <Text style={style.emptyImageText}>Sem imagem</Text>
                        </View>
                    )
                }

            </View>
        
            <View  style={style.infos}>
                
            <View style={{marginTop:-20}}>
                <Text style={{fontSize:26, fontWeight:"bold",color:colors.primary}}>{petName}</Text>
                <View style={style.location}>
                    <IconIonic name="location-outline" size={26} color={colors.primary}></IconIonic>
                    <Text style={style.location}> Marapé, Santos - SP</Text>
                </View>
            </View>

            {
                isLoadingPet && (
                    <View style={style.loadingContainer}>
                        <ActivityIndicator size="small" color={colors.primary}></ActivityIndicator>
                        <Text style={style.feedbackText}>Carregando dados do pet...</Text>
                    </View>
                )
            }

            {
                !!petError && (
                    <Text style={style.errorText}>{petError}</Text>
                )
            }

            <View style={style.caracteristicasContainer}>
                <View style={style.caracteristicasCard}>
                    <Text style={style.tituloCard}>{birthDateLabel}</Text>
                    <Text style={style.textoCard}>Nascimento</Text>
                </View>

                <View style={style.caracteristicasCard}>
                    <Text style={style.tituloCard}>{petSpecies}</Text>
                    <Text style={style.textoCard}>Espécie</Text>
                </View>

                <View style={style.caracteristicasCard}>
                    <Text style={style.tituloCard}>{petPorte}</Text>
                    <Text style={style.textoCard}>Porte</Text>
                </View>
            </View>

            <View>
                <Text style={{fontSize:26, fontWeight:"bold",color:colors.primary}}>Sobre</Text>
                <Text style={{fontSize:18, display:"flex", flexDirection:"column", alignItems:"center", color:"rgba(0, 0, 0, 0.53)"}}>
                    {
                        petDescription
                    }
                </Text>
            </View>
        
            <TouchableOpacity style={style.button}>
               <Text style={{textAlign:"center", fontWeight:"bold", fontSize:20, color:"white"}}>Adotar!</Text>
            </TouchableOpacity>
        </View>


        </View>
    )
}

const style = StyleSheet.create({
    container:{
        paddingTop:80,
        backgroundColor:"white",
        height:"100%",
        position:"relative",
        overflow:"hidden"
    },
    header:{
        flexDirection:"row",
        justifyContent:"space-between",
        alignItems:"flex-start",
        height:"45%",
        zIndex:2,
        paddingHorizontal:25,
    },
    image:{
        height:"50%",
        width:"130%",
        position:"absolute",
        top:0,
        left:"-15%",
        borderBottomRightRadius:300,
        borderBottomLeftRadius:300,
        overflow:"hidden",
    },
    location:{
        fontSize:18,
        display:"flex",
        flexDirection:"row",
        alignItems:"center", 
        color:"rgba(0, 0, 0, 0.53)",
    },
    infos:{
        paddingHorizontal:25,
        display:"flex",
        flexDirection:"column",
        alignContent:"space-between",
        height:"55%",
        gap:20
        
    },
    caracteristicasContainer:{
        display:"flex",
        flexDirection:"row",
        justifyContent:"space-between",
        gap:10
    },
    caracteristicasCard:{
        backgroundColor:colors.primary,
        width:"30%",
        paddingVertical:"5%",
        borderRadius:15,
    },
    textoCard:{
        textAlign:"center",
        color:"white",
        fontWeight:"500"
    },
    tituloCard:{
        textAlign:"center",
        color:"white",
        fontWeight:"900"
    },
    button:{
        margin:"auto",
        backgroundColor:colors.primary,
        width:"100%",
        padding:"5%",
        borderRadius:15,
        fontWeight:"bold",
        fontFamily:"sans",
        height:60,
        marginTop:"auto"
    },
    headerButtons:{
        backgroundColor:"white",
        width:50,
        height:50,
        display:"flex",
        justifyContent:"center",
        alignItems:"center",
        borderRadius:100
    },
    loadingContainer:{
        flexDirection:"row",
        alignItems:"center",
        gap:8,
    },
    feedbackText:{
        color:"rgba(0, 0, 0, 0.53)",
    },
    errorText:{
        color:"#B00020",
        fontWeight:"600",
    },
    emptyImage:{
        height:"100%",
        width:"80%",
        margin:"auto",
        justifyContent:"center",
        alignItems:"center",
        backgroundColor:"#f4f4f4",
        borderRadius:20,
    },
    emptyImageText:{
        color:"rgba(0,0,0,0.45)",
    }
});
