import CardPet from "@/components/CardPet";
import NavBar from "@/components/NavBar";
import { colors } from "@/styles/variables";
import { useState } from "react";
import { Alert, FlatList, Pressable, ScrollView } from "react-native";
import { StyleSheet, Text, TextInput, View } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5"

type animal = {
    nome:string,
    imagem:string
}

export default function ListagemPets(){
    const [inputText, setInputText] = useState('');

    const pets :animal[] = [
    {
    nome:"Alfredo",
    imagem:"https://img.freepik.com/fotos-gratis/fotografia-vertical-de-foco-superficial-de-um-bonito-cachorro-de-golden-retriever-sentado-em-um-chao-de-grama_181624-27259.jpg?w=360",

    },
    {
    nome:"Bob",
    imagem:"https://img.freepik.com/fotos-gratis/fotografia-vertical-de-foco-superficial-de-um-bonito-cachorro-de-golden-retriever-sentado-em-um-chao-de-grama_181624-27259.jpg?w=360",

    },
    {
    nome:"Lucky",
    imagem:"https://img.freepik.com/fotos-gratis/fotografia-vertical-de-foco-superficial-de-um-bonito-cachorro-de-golden-retriever-sentado-em-um-chao-de-grama_181624-27259.jpg?w=360",
    },
    {
    nome:"Lucky",
    imagem:"https://img.freepik.com/fotos-gratis/fotografia-vertical-de-foco-superficial-de-um-bonito-cachorro-de-golden-retriever-sentado-em-um-chao-de-grama_181624-27259.jpg?w=360",
    },
    {
    nome:"Lucky",
    imagem:"https://img.freepik.com/fotos-gratis/fotografia-vertical-de-foco-superficial-de-um-bonito-cachorro-de-golden-retriever-sentado-em-um-chao-de-grama_181624-27259.jpg?w=360",
    },
    {
    nome:"Lucky",
    imagem:"https://img.freepik.com/fotos-gratis/fotografia-vertical-de-foco-superficial-de-um-bonito-cachorro-de-golden-retriever-sentado-em-um-chao-de-grama_181624-27259.jpg?w=360",
    },
    {
    nome:"Lucky",
    imagem:"https://img.freepik.com/fotos-gratis/fotografia-vertical-de-foco-superficial-de-um-bonito-cachorro-de-golden-retriever-sentado-em-um-chao-de-grama_181624-27259.jpg?w=360",
    },
    {
    nome:"Lucky",
    imagem:"https://img.freepik.com/fotos-gratis/fotografia-vertical-de-foco-superficial-de-um-bonito-cachorro-de-golden-retriever-sentado-em-um-chao-de-grama_181624-27259.jpg?w=360",
    },
    {
    nome:"Lucky",
    imagem:"https://img.freepik.com/fotos-gratis/fotografia-vertical-de-foco-superficial-de-um-bonito-cachorro-de-golden-retriever-sentado-em-um-chao-de-grama_181624-27259.jpg?w=360",
    },
    {
    nome:"Lucky",
    imagem:"https://img.freepik.com/fotos-gratis/fotografia-vertical-de-foco-superficial-de-um-bonito-cachorro-de-golden-retriever-sentado-em-um-chao-de-grama_181624-27259.jpg?w=360",
    }
  ]

    return(
        <View style={styles.main}>
           <TextInput 
           style={styles.input}
           placeholder="Pesquise aqui"
           value={inputText}
           onChangeText={setInputText}
           >
            </TextInput> 

            <FlatList
                data={pets}
                contentContainerStyle={{
                    display:"flex",
                    flexDirection:"row",
                    justifyContent:"space-between",
                    paddingBottom:150,
                    gap:"1%",
                    flexWrap:"wrap"
                }}

                renderItem={({item,index}) => (
                    <View style={{height:200,width:180, display:"flex",flexDirection:"row"}}>
                        <CardPet animal={item} index={index} onlyPicture={true}></CardPet>
                    </View>
                )}
            
                />
                

            <Pressable style={styles.filterButton} onPress={()=> Alert.alert("Em desenvolvimento")}>
                <Icon name="filter" size={20} color={"white"}></Icon>
            </Pressable>

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
        height:"100%"
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
        zIndex:5,
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
    }
});