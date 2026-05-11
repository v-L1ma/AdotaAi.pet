import { animal } from "@/types/TAnimal";
import { useRouter } from "expo-router";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
    animal:animal,
    index:number,
    onlyPicture:boolean
}

export default function CardPet({animal,index, onlyPicture}:Props){
    const router = useRouter();
    const locationText = animal.localizacao || [animal.bairro, animal.cidade, animal.uf].filter(Boolean).join(", ") || "Santos";

    function goToPetProfile() {
        router.push({
            pathname:"/perfil-pet",
            params:{
                id: animal.id,
                nome: animal.nome,
                imagem: animal.imagem,
                localizacao: animal.localizacao,
                bairro: animal.bairro,
                cidade: animal.cidade,
                uf: animal.uf,
            }
        });
    }

    if(!onlyPicture){
        return(
            <TouchableOpacity style={styles.container} onPress={goToPetProfile}>
                <Image style={styles.image} source={{uri:animal.imagem}}></Image>

                <View style={styles.info}>
                    <Text style={styles.name}>{animal.nome}</Text>
                    <Text style={styles.location}>{locationText}</Text>
                </View>
            </TouchableOpacity>
        );
    } else {
        return(
            <TouchableOpacity style={styles.onlyPictureContainer} onPress={goToPetProfile}>
                <Image style={styles.onlyPictureImage} resizeMode="cover" source={{uri:animal.imagem}}></Image>
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        backgroundColor:"white",
        width: "100%",
        padding:0,
        borderRadius:25,
        height:"100%",
        overflow: "hidden",
    },
    image:{
        width:"100%",
        height:"100%",
        borderRadius:15,
    },
    onlyPictureContainer: {
        width: "100%",
        height: "100%",
        borderRadius: 18,
        overflow: "hidden",
        backgroundColor: "#FFFFFF",
    },
    onlyPictureImage: {
        width: "100%",
        height: "100%",
    },
    name:{
        fontSize:18,
        color:"white",
        fontWeight:"bold"
    },
    location:{
        color:"white",
        marginTop:5,
        fontWeight:"700"
    },
    info:{
        position:"absolute",
        bottom:0,
        left:0,
        right:0,
        backgroundColor:"rgba(0, 0, 0, 0.3)",
        borderBottomLeftRadius:25,
        borderBottomRightRadius:25,
        paddingHorizontal:15,
        paddingBottom:10
    }
});