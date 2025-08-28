import CardPet from "@/components/CardPet";
import NavBar from "@/components/NavBar";
import { useState } from "react";
import { Dimensions, FlatList, ScrollView } from "react-native";
import { StyleSheet, Text, TextInput, View } from "react-native";

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
                    style={{marginBottom:160}}
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

                    <View style={{position:"fixed",bottom:195}}>
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
    },
    input:{
        borderRadius: 50,
        padding:25,
        backgroundColor:"white",
        color:"rgba(187, 33, 33, 1)",
        shadowColor: "#000",
        shadowOpacity: 0.01,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 10,
    },
    galery:{
        display:"flex",
        flexWrap:"wrap",
        flexDirection:"row"
    }
});