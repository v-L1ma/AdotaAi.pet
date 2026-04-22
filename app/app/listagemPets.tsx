import CardPet from "@/components/CardPet";
import NavBar from "@/components/NavBar";
import apiService from "@/services/apiService";
import { colors } from "@/styles/variables";
import { animal } from "@/types/TAnimal";
import React, { useEffect, useMemo, useState } from "react";
import { Animated, Dimensions, Easing, Image, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const width = Dimensions.get("window").width
const columnGap = 12;
const columnWidth = (width - 40 - columnGap) / 2;

type PetApiDTO = {
    id: string;
    nome: string;
    especie: string;
    porte: string;
    link_foto: string;
};

export default function ListagemPets(){
    const insets = useSafeAreaInsets();
    const [isPopUpOpen, setIsPopUpOpen] = useState<boolean>(false);
    const [isPopUpMounted, setIsPopUpMounted] = useState<boolean>(false);
    const [genero, setGenero] = useState<"M" | "F" | null>(null);
    const [especie, setEspecie] = useState<"cachorro" | "gato" | null>(null);
    const [porte, setPorte] = useState<"pequeno" | "medio" | "grande" | null>(null);
    const [searchText, setSearchText] = useState<string>("")
    const [pets, setPets] = useState<animal[]>([]);
    const [isLoadingPets, setIsLoadingPets] = useState<boolean>(true);
    const [petsError, setPetsError] = useState<string | null>(null);
    const width = Dimensions.get(`window`).width;

    useEffect(() => {
        async function loadPets() {
            setIsLoadingPets(true);
            setPetsError(null);

            try {
                const response = await apiService.get<PetApiDTO[]>("/pets");
                const parsedPets = response.data
                    .map((pet): animal | null => {
                        const especieNormalizada = pet.especie?.toLowerCase();
                        const porteNormalizado = pet.porte?.toLowerCase();

                        if ((especieNormalizada !== "cachorro" && especieNormalizada !== "gato") ||
                            (porteNormalizado !== "pequeno" && porteNormalizado !== "medio" && porteNormalizado !== "grande")) {
                            return null;
                        }

                        return {
                            id: pet.id,
                            nome: pet.nome,
                            imagem: pet.link_foto,
                            especie: especieNormalizada,
                            porte: porteNormalizado,
                            genero: null,
                        };
                    })
                    .filter((pet): pet is animal => Boolean(pet));

                setPets(parsedPets);
            } catch {
                setPetsError("Nao foi possivel carregar os pets.");
            } finally {
                setIsLoadingPets(false);
            }
        }

        void loadPets();
    }, []);
    const [imageRatios, setImageRatios] = useState<Record<string, number>>({});
    const sheetTranslateY = useMemo(() => new Animated.Value(460), []);
    const backdropOpacity = useMemo(() => new Animated.Value(0), []);

    function closePopUp():void{
        setEspecie(null)
        setGenero(null)
        setPorte(null)
    }

    function openFilterSheet(): void {
        setIsPopUpMounted(true);
        setIsPopUpOpen(true);
    }

    function closeFilterSheet(): void {
        setIsPopUpOpen(false);
    }

    const filteredPets: animal[] = pets.filter((animal)=>
           (searchText ? animal.nome.toLowerCase().includes(searchText.toLowerCase()) : true) &&
           (especie ? animal.especie===especie : true) &&
           (genero ? animal.genero===genero || animal.genero===null : true) &&
           (porte ? animal.porte===porte : true) 
        )

    useEffect(() => {
        filteredPets.forEach((pet) => {
            if (imageRatios[pet.imagem]) return;

            Image.getSize(
                pet.imagem,
                (imgWidth, imgHeight) => {
                    const ratio = imgWidth / imgHeight;
                    setImageRatios((prev) => ({ ...prev, [pet.imagem]: ratio }));
                },
                () => {
                    setImageRatios((prev) => ({ ...prev, [pet.imagem]: 1 }));
                }
            );
        });
    }, [filteredPets, imageRatios]);

    const masonryItems = useMemo(
        () => filteredPets.map((pet, index) => {
            const ratio = imageRatios[pet.imagem] ?? 1;

            let cardType: "landscape" | "square" | "portrait" | "tall" = "square";
            if (ratio >= 1.25) {
                cardType = "landscape";
            } else if (ratio >= 0.9 && ratio < 1.25) {
                cardType = "square";
            } else if (ratio >= 0.7 && ratio < 0.9) {
                cardType = "portrait";
            } else {
                cardType = "tall";
            }

            const typeHeightMap = {
                landscape: columnWidth * 0.72,
                square: columnWidth * 1.02,
                portrait: columnWidth * 1.3,
                tall: columnWidth * 1.55,
            };

            const height = typeHeightMap[cardType];

            return {
                pet,
                index,
                cardType,
                height,
            };
        }),
        [filteredPets, imageRatios]
    );

    const { leftColumn, rightColumn } = useMemo(() => {
        let leftHeight = 0;
        let rightHeight = 0;
        const left: typeof masonryItems = [];
        const right: typeof masonryItems = [];

        masonryItems.forEach((item) => {
            if (leftHeight <= rightHeight) {
                left.push(item);
                leftHeight += item.height + 12;
            } else {
                right.push(item);
                rightHeight += item.height + 12;
            }
        });

        return { leftColumn: left, rightColumn: right };
    }, [masonryItems]);

    function toggleEspecie(value: "cachorro" | "gato") {
        setEspecie((prev) => (prev === value ? null : value));
    }

    useEffect(() => {
        if (isPopUpOpen) {
            Animated.parallel([
                Animated.timing(backdropOpacity, {
                    toValue: 1,
                    duration: 220,
                    easing: Easing.out(Easing.cubic),
                    useNativeDriver: true,
                }),
                Animated.timing(sheetTranslateY, {
                    toValue: 0,
                    duration: 280,
                    easing: Easing.out(Easing.cubic),
                    useNativeDriver: true,
                }),
            ]).start();
            return;
        }

        if (isPopUpMounted) {
            Animated.parallel([
                Animated.timing(backdropOpacity, {
                    toValue: 0,
                    duration: 180,
                    easing: Easing.in(Easing.cubic),
                    useNativeDriver: true,
                }),
                Animated.timing(sheetTranslateY, {
                    toValue: 460,
                    duration: 230,
                    easing: Easing.in(Easing.cubic),
                    useNativeDriver: true,
                }),
            ]).start(() => {
                setIsPopUpMounted(false);
            });
        }
    }, [backdropOpacity, isPopUpMounted, isPopUpOpen, sheetTranslateY]);

    return(
        <View style={styles.screenWrapper}>
            <View style={styles.content}>
                <View style={styles.searchZone}>
                    <Text style={styles.title}>Buscar pets</Text>

                <View style={styles.inputContainer}>
                    <TextInput 
                        style={styles.input}
                        placeholder="Pesquise por nome"
                        placeholderTextColor="#8C8C8C"
                        value={searchText}
                        onChangeText={setSearchText}
                    />
                    <Pressable style={styles.filterInlineButton} onPress={openFilterSheet}>
                        <Icon name="filter" size={17} color={colors.primary}></Icon>
                    </Pressable>
                </View>

                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsRow}>
                    <TouchableOpacity
                        style={[styles.chip, especie === null && styles.chipActive]}
                        onPress={() => setEspecie(null)}
                    >
                        <Text style={especie === null ? styles.chipActiveText : styles.chipText}>Todos</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.chip, especie === "cachorro" && styles.chipActive]}
                        onPress={() => toggleEspecie("cachorro")}
                    >
                        <Text style={especie === "cachorro" ? styles.chipActiveText : styles.chipText}>Cachorros</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.chip, especie === "gato" && styles.chipActive]}
                        onPress={() => toggleEspecie("gato")}
                    >
                        <Text style={especie === "gato" ? styles.chipActiveText : styles.chipText}>Gatos</Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>

            {filteredPets.length === 0 ? (
                    <View style={styles.emptyWrap}>
                        <Image source={require("../assets/images/nothingfound.png")} style={styles.emptyImage}></Image>
                        <Text style={styles.emptyText}>Não encontramos nenhum animal com esses filtros.</Text>
                    </View>
                ) : (
                <ScrollView
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.masonryRow}>
                        <View style={styles.masonryColumn}>
                            {leftColumn.map(({ pet, index, height, cardType }) => (
                                <View key={`${pet.nome}-${index}`} style={[styles.cardWrap, styles[`cardWrap_${cardType}`], { height }]}> 
                                    <CardPet animal={pet} index={index} onlyPicture={true}></CardPet>
                                </View>
                            ))}
                        </View>

                        <View style={styles.masonryColumn}>
                            {rightColumn.map(({ pet, index, height, cardType }) => (
                                <View key={`${pet.nome}-${index}`} style={[styles.cardWrap, styles[`cardWrap_${cardType}`], { height }]}> 
                                    <CardPet animal={pet} index={index} onlyPicture={true}></CardPet>
                                </View>
                            ))}
                        </View>
                    </View>
                </ScrollView>
            )}

                {isPopUpMounted && (
                    <View style={styles.popupFiltro}>
                        <Animated.View style={[styles.backdropAnimated, { opacity: backdropOpacity }]}>
                            <Pressable style={styles.backdrop} onPress={closeFilterSheet}></Pressable>
                        </Animated.View>

                        <Animated.View style={[styles.sheetContainer, { transform: [{ translateY: sheetTranslateY }] }]}>
                        <View style={styles.container}>

                            <View style={styles.sheetHandle}></View>

                            <View style={styles.modalHeader}>
                                <Text style={styles.modalTitle}>Filtros</Text>
                                <Pressable onPress={()=> closePopUp()}>
                                    <Text style={styles.clearText}>Limpar</Text>
                                </Pressable>
                            </View>

                            <ScrollView
                                style={styles.modalBody}
                                contentContainerStyle={styles.modalBodyContent}
                                showsVerticalScrollIndicator={false}
                            >
                                <Text style={styles.sectionTitle}>Espécie</Text>

                                <View style={styles.optionRow}>
                                    <TouchableOpacity 
                                    style={[styles.button,  especie === "cachorro" && styles.selected]}
                                    onPress={() => setEspecie("cachorro")}>
                                        <Text style={[styles.buttonText, especie === "cachorro" && styles.selectedText]}>Cachorro</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity 
                                    style={[styles.button,  especie === "gato" && styles.selected]}
                                    onPress={() => setEspecie("gato")}>
                                        <Text style={[styles.buttonText, especie === "gato" && styles.selectedText]}>Gato</Text>
                                    </TouchableOpacity>
                                </View>

                                <Text style={styles.sectionTitle}>Gênero</Text>

                                <View style={styles.optionRow}>
                                    <TouchableOpacity 
                                    style={[styles.button,  genero === "M" && styles.selected]} 
                                    onPress={() => setGenero("M")}>
                                        <Text style={[styles.buttonText, genero === "M" && styles.selectedText]}>Macho</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity 
                                    style={[styles.button,  genero === "F" && styles.selected]} 
                                    onPress={() => setGenero("F")}>
                                        <Text style={[styles.buttonText, genero === "F" && styles.selectedText]}>Fêmea</Text>
                                    </TouchableOpacity>
                                </View>

                                <Text style={styles.sectionTitle}>Porte</Text>

                                <View style={styles.optionRow}>
                                    <TouchableOpacity 
                                    style={[styles.button, styles.buttonThird,  porte === "pequeno" && styles.selected]} 
                                    onPress={() => setPorte("pequeno")}>
                                        <Text style={[styles.buttonText, porte === "pequeno" && styles.selectedText]}>Pequeno</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity 
                                    style={[styles.button, styles.buttonThird,  porte === "medio" && styles.selected]} 
                                    onPress={() => setPorte("medio")}>
                                        <Text style={[styles.buttonText, porte === "medio" && styles.selectedText]}>Médio</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity 
                                    style={[styles.button, styles.buttonThird,  porte === "grande" && styles.selected]} 
                                    onPress={() => setPorte("grande")}>
                                        <Text style={[styles.buttonText, porte === "grande" && styles.selectedText]}>Grande</Text>
                                    </TouchableOpacity>
                                </View>
                            </ScrollView>

                            <View
                                style={[
                                    styles.footerActions,
                                    { paddingBottom: Math.max(insets.bottom, 12) },
                                ]}
                            >
                                <TouchableOpacity style={styles.submit} onPress={closeFilterSheet}>
                                    <Text style={styles.submitText}>Aplicar filtro</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        </Animated.View>
                    </View>
                )}
                </View>
            {!isPopUpMounted && <NavBar></NavBar>}
        </View>
    )
}

const styles = StyleSheet.create({
    screenWrapper: {
        flex: 1,
        backgroundColor: "#F8F9FA",
        position: "relative",
    },
    content: {
        paddingHorizontal: 20,
        gap: 14,
        flex: 1,
    },
    screen:{
        paddingTop:50,
        paddingHorizontal:20,
        gap:14,
        flex:1,
        backgroundColor:"#F8F9FA",
        position:"relative"
    },
    searchZone: {
        paddingTop: 50,
        gap: 10,
    },
    title: {
        color: "#1E1E1E",
        fontSize: 30,
        fontWeight: "800",
        marginBottom: 2,
    },
    input:{
        flex: 1,
        paddingVertical: 12,
        paddingHorizontal: 12,
        fontSize: 15,
        color:"rgba(0, 0, 0, 0.8)",
    },
    inputContainer: {
        borderRadius: 18,
        backgroundColor:"white",
        paddingLeft: 6,
        paddingRight: 14,
        minHeight: 52,
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#E9E9E9",
        shadowColor: "#000",
        shadowOpacity: 0.04,
        shadowOffset: { width: 2, height: 2 },
        shadowRadius: 6,
    },
    filterInlineButton:{
        width: 28,
        height: 28,
        marginRight: 12,
        justifyContent:"center",
        alignItems:"center",
    },
    chipsRow: {
        gap: 8,
        paddingVertical: 4,
    },
    chip: {
        backgroundColor: "#ECECEC",
        borderRadius: 999,
        paddingHorizontal: 14,
        paddingVertical: 8,
    },
    chipActive: {
        backgroundColor: colors.primary,
    },
    chipText: {
        color: "#575757",
        fontWeight: "600",
    },
    chipActiveText: {
        color: "white",
        fontWeight: "700",
    },
    listContent: {
        paddingBottom: 170,
        paddingTop: 8,
    },
    masonryRow: {
        flexDirection: "row",
        gap: columnGap,
        alignItems: "flex-start",
    },
    masonryColumn: {
        flex: 1,
        gap: 14,
    },
    cardWrap: {
        width: "100%",
    },
    cardWrap_landscape: {
        borderRadius: 18,
    },
    cardWrap_square: {
        borderRadius: 18,
    },
    cardWrap_portrait: {
        borderRadius: 20,
    },
    cardWrap_tall: {
        borderRadius: 22,
    },
    emptyWrap:{
        marginTop: 40,
        alignItems: "center",
        justifyContent: "center",
        paddingBottom: 50,
    },
    emptyImage: {
        height: 200,
        width: 200,
    },
    emptyText: {
        marginTop: 8,
        color: "#666",
        width: "80%",
        textAlign: "center",
    },
    popupFiltro:{
        zIndex:2,
        position:"absolute",
        left:0,
        top:0,
        right:0,
        bottom:0,
        backgroundColor:"rgba(0, 0, 0, 0.25)", 
        display:"flex",
        justifyContent:"flex-end",
        alignItems:"stretch",
    },
    sheetContainer: {
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
    },
    backdrop: {
        flex: 1,
        width: "100%",
    },
    backdropAnimated: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0, 0, 0, 0.25)",
    },
    container:{
        backgroundColor:"white",
        maxHeight:"82%",
        minHeight:420,
        width:"100%",
        borderTopLeftRadius:40,
        borderTopRightRadius:40,
        paddingHorizontal:20,
        paddingTop:10,
        overflow: "hidden",
    },
    sheetHandle: {
        alignSelf: "center",
        width: 42,
        height: 5,
        borderRadius: 10,
        backgroundColor: "#D7D7D7",
        marginBottom: 10,
    },
    modalHeader: {
        flexDirection:"row",
        justifyContent:"space-between",
        alignItems:"center",
        paddingBottom: 8,
    },
    modalTitle: {
        fontSize:22,
        fontWeight:"bold",
    },
    clearText: {
        color:colors.primary,
        fontWeight:"bold",
    },
    modalBody: {
        flex: 1,
    },
    modalBodyContent: {
        gap:16,
        paddingTop: 4,
        paddingBottom: 14,
    },
    sectionTitle: {
        fontSize:18,
        fontWeight:"600",
        marginTop: 2,
    },
    optionRow: {
        flexDirection:"row",
        justifyContent:"space-between",
        alignItems:"center",
        gap: 8,
    },
    button:{
        borderWidth:1,
        borderColor:"rgba(0, 0, 0, 0.31)",
        flex:1,
        minHeight:48,
        borderRadius:12,
        justifyContent: "center",
        alignItems: "center",
    },
    buttonThird: {
        flex: undefined,
        width: "32%",
    },
    buttonText: {
        textAlign:"center",
        color: "#333",
    },
    selected:{
        borderColor:colors.primary,
        backgroundColor:colors.primary,
    },
    selectedText: {
        color:"white",
        fontWeight:"bold",
    },
    footerActions: {
        paddingTop: 0,
        paddingBottom: 0,
        backgroundColor: "white",
    },
    submit:{
        width:"100%",
        backgroundColor:colors.primary,
        display:"flex",
        justifyContent:"center",
        minHeight:56,
        borderRadius:15,
        marginBottom:0,
    },
    submitText: {
        textAlign:"center",
        color:"white",
        fontWeight:"bold",
    }
});