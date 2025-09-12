import CardPet from "@/components/CardPet";
import NavBar from "@/components/NavBar";
import { colors } from "@/styles/variables";
import { animal } from "@/types/TAnimal";
import { useState } from "react";
import { Dimensions, FlatList, Image, Pressable, TouchableOpacity } from "react-native";
import { StyleSheet, Text, TextInput, View } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";

const width = Dimensions.get("window").width

export default function ListagemPets(){
    const [isPopUpOpen, setIsPopUpOpen] = useState<boolean>(false);
    const [genero, setGenero] = useState<"M" | "F" | null>(null);
    const [especie, setEspecie] = useState<"cachorro" | "gato" | null>(null);
    const [porte, setPorte] = useState<"pequeno" | "medio" | "grande" | null>(null);
    const [searchText, setSearchText] = useState<string>("")
    const width = Dimensions.get(`window`).width;

    const pets: animal[] = [
    {
        nome: "Alfredo",
        imagem:
        "https://img.freepik.com/fotos-gratis/fotografia-vertical-de-foco-superficial-de-um-bonito-cachorro-de-golden-retriever-sentado-em-um-chao-de-grama_181624-27259.jpg?w=360",
        genero: "M",
        especie: "cachorro",
        porte: "medio",
    },
    {
        nome: "Luna",
        imagem:
        "https://www.petz.com.br/blog/wp-content/uploads/2019/07/vida-de-gato.jpg",
        genero: "F",
        especie: "gato",
        porte: "pequeno",
    },
    {
        nome: "Thor",
        imagem:
        "https://img.freepik.com/fotos-gratis/fotografia-vertical-de-foco-superficial-de-um-bonito-cachorro-de-golden-retriever-sentado-em-um-chao-de-grama_181624-27259.jpg?w=360",
        genero: "M",
        especie: "cachorro",
        porte: "grande",
    },
    {
        nome: "Mimi",
        imagem:
        "https://www.petz.com.br/blog/wp-content/uploads/2019/07/vida-de-gato.jpg",
        genero: "F",
        especie: "gato",
        porte: "pequeno",
    },
    {
        nome: "Rex",
        imagem:
        "https://img.freepik.com/fotos-gratis/fotografia-vertical-de-foco-superficial-de-um-bonito-cachorro-de-golden-retriever-sentado-em-um-chao-de-grama_181624-27259.jpg?w=360",
        genero: "M",
        especie: "cachorro",
        porte: "medio",
    },
    {
        nome: "Mel",
        imagem:
        "https://img.freepik.com/fotos-gratis/fotografia-vertical-de-foco-superficial-de-um-bonito-cachorro-de-golden-retriever-sentado-em-um-chao-de-grama_181624-27259.jpg?w=360",
        genero: "F",
        especie: "cachorro",
        porte: "pequeno",
    },
    {
        nome: "Simba",
        imagem:
        "https://www.petz.com.br/blog/wp-content/uploads/2019/07/vida-de-gato.jpg",
        genero: "M",
        especie: "gato",
        porte: "medio",
    },
    {
        nome: "Bela",
        imagem:
        "https://img.freepik.com/fotos-gratis/fotografia-vertical-de-foco-superficial-de-um-bonito-cachorro-de-golden-retriever-sentado-em-um-chao-de-grama_181624-27259.jpg?w=360",
        genero: "F",
        especie: "cachorro",
        porte: "grande",
    },
    {
        nome: "Nina",
        imagem:
        "https://www.petz.com.br/blog/wp-content/uploads/2019/07/vida-de-gato.jpg",
        genero: "F",
        especie: "gato",
        porte: "pequeno",
    },
    {
        nome: "Max",
        imagem:
        "https://img.freepik.com/fotos-gratis/fotografia-vertical-de-foco-superficial-de-um-bonito-cachorro-de-golden-retriever-sentado-em-um-chao-de-grama_181624-27259.jpg?w=360",
        genero: "M",
        especie: "cachorro",
        porte: "medio",
    },
    ];

    function closePopUp():void{
        setEspecie(null)
        setGenero(null)
        setPorte(null)
    }

    function filter():animal[]{
        return pets.filter((animal)=>
           (searchText ? animal.nome.toLowerCase().includes(searchText.toLowerCase()) : true) &&
           (especie ? animal.especie===especie : true) &&
           (genero ? animal.genero===genero : true) &&
           (porte ? animal.porte===porte : true) 
        )
    }

    return(
        <View style={styles.main}>
           <TextInput 
           style={styles.input}
           placeholder="Pesquise aqui"
           value={searchText}
           onChangeText={setSearchText}
           >
            </TextInput> 

            <FlatList
                data={filter()}
                contentContainerStyle={{
                    display:"flex",
                    flexDirection:"row",
                    justifyContent:"space-between",
                    paddingBottom:150,
                    gap:"1%",
                    flexWrap:"wrap"
                }}

                renderItem={({item,index}) => (
                    <View style={{height:200,width:width/2.5, display:"flex",flexDirection:"row"}}>
                        <CardPet animal={item} index={index} onlyPicture={true}></CardPet>
                    </View>
                )}
                ListEmptyComponent={
                    <View style={{height:200, margin:"auto", marginTop:"10%"}}>
                        <Image source={require("../assets/images/nothingfound.png")} style={{height:250,width:250}}></Image>
                        <Text> Não encontramos nenhum animal no momento...</Text>
                    </View>
                }
           
                />

            <Pressable style={styles.filterButton} onPress={()=> setIsPopUpOpen(true)}>
                <Icon name="filter" size={20} color={"white"}></Icon>
            </Pressable>

            {
                isPopUpOpen && (
                    <View style={styles.popupFiltro} >
                        <Pressable  onPress={()=>setIsPopUpOpen(false)}>

                        </Pressable>
                        <View style={styles.container}>

                            <View style={{flexDirection:"row", justifyContent:"space-between", alignItems:"center"}}>
                                <Text style={{fontSize:22, fontWeight:"bold"}}>Filtros</Text>
                                <Pressable onPress={()=> closePopUp()} ><Text style={{color:colors.primary, fontWeight:"bold"}}>Limpar</Text></Pressable>
                            </View>

                            <Text style={{fontSize:18, fontWeight:"600"}}>Espécie</Text>

                            <View style={{flexDirection:"row", justifyContent:"space-between", alignItems:"center"}}>
                                <TouchableOpacity 
                                style={[styles.button,  especie === "cachorro" && styles.selected]}
                                onPress={() => setEspecie("cachorro")}>
                                    <Text style={{textAlign:"center"}}>Cachorro</Text>
                                </TouchableOpacity>

                                <TouchableOpacity 
                                style={[styles.button,  especie === "gato" && styles.selected]}
                                onPress={() => setEspecie("gato")}>
                                    <Text style={{textAlign:"center"}}>Gato</Text>
                                </TouchableOpacity>
                            </View>

                            <Text style={{fontSize:18, fontWeight:"600"}}>Gênero</Text>

                            <View style={{flexDirection:"row", justifyContent:"space-between", alignItems:"center"}}>
                                <TouchableOpacity 
                                style={[styles.button,  genero === "M" && styles.selected]} 
                                onPress={() => setGenero("M")}>
                                    <Text style={{textAlign:"center"}}>Macho</Text>
                                </TouchableOpacity>

                                <TouchableOpacity 
                                style={[styles.button,  genero === "F" && styles.selected]} 
                                onPress={() => setGenero("F")}>
                                    <Text style={{textAlign:"center"}}>Fêmea</Text>
                                </TouchableOpacity>
                            </View>

                            <Text style={{fontSize:18, fontWeight:"600"}}>Porte</Text>

                            <View style={{flexDirection:"row", justifyContent:"space-between", alignItems:"center"}}>
                                <TouchableOpacity 
                                style={[styles.button, {width:"32%"},  porte === "pequeno" && styles.selected]} 
                                onPress={() => setPorte("pequeno")}>
                                    <Text style={{textAlign:"center"}}>Pequeno</Text>
                                </TouchableOpacity>

                                <TouchableOpacity 
                                style={[styles.button, {width:"32%"},  porte === "medio" && styles.selected]} 
                                onPress={() => setPorte("medio")}>
                                    <Text style={{textAlign:"center"}}>Médio</Text>
                                </TouchableOpacity>

                                <TouchableOpacity 
                                style={[styles.button, {width:"32%"},  porte === "grande" && styles.selected]} 
                                onPress={() => setPorte("grande")}>
                                    <Text style={{textAlign:"center"}}>Grande</Text>
                                </TouchableOpacity>
                            </View>
                            
                            <TouchableOpacity style={styles.submit} onPress={()=>{setIsPopUpOpen(false)}}>
                                <Text style={{textAlign:"center", color:"white", fontWeight:"bold"}}>Aplicar filtro</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )
            }

            <View style={{position:"fixed",bottom:50}}>
                <NavBar></NavBar>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    main:{
        marginTop:40,
        padding:25,
        gap:25,
        height:"100%",
        position:"relative"
    },
    input:{
        borderRadius: 25,
        padding:25,
        backgroundColor:"white",
        color:"rgba(187, 33, 33, 1)",
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowOffset: { width: 2, height: 2 },
        shadowRadius: 15,
    },
    galery:{
        display:"flex",
        flexWrap:"wrap",
        flexDirection:"row"
    },
    filterButton:{
        zIndex:1,
        backgroundColor:colors.primary,
        position:"absolute",
        bottom:"20%",
        padding:20,
        right:35,
        borderRadius:60,
        borderWidth:2,
        borderColor:colors.secondary,
        display:"flex",
        justifyContent:"center",
        alignItems:"center",

        shadowColor: "#000",
        shadowOpacity: 0.3,
        shadowOffset: { width: 2, height: 2 },
        shadowRadius: 15,
    },
    popupFiltro:{
        zIndex:2,
        position:"absolute",
        left:0,
        top:10,
        backgroundColor:"rgba(0, 0, 0, 0.25)", 
        height:"100%",
        width:width,
        display:"flex",
        justifyContent:"flex-end",
        alignItems:"center",
    },
    container:{
        backgroundColor:"white",
        height:"80%",
        width:"100%",
        borderRadius:40,
        padding:25,
        paddingTop:40,
        gap:20,
    },
    button:{
        borderWidth:1,
        borderColor:"rgba(0, 0, 0, 0.31)",
        width:"49%",
        padding:15,
        borderRadius:10
    },
    selected:{
        borderColor:colors.primary,
        backgroundColor:colors.primary,
        color:"white",
        fontWeight:"bold"
    },
    submit:{
        width:"100%",
        backgroundColor:colors.primary,
        display:"flex",
        justifyContent:"center",
        padding:20,
        borderRadius:15,
        marginTop:"auto",
        marginBottom:20,
    }
});