import { Image, StyleSheet, Text, View } from "react-native";

type animal = {
    nome:string,
    imagem:string
}

type Props = {
    animal:animal,
    index:number,
    onlyPicture:boolean
}

export default function CardPet({animal,index, onlyPicture}:Props){
    const teste:string =""

    if(!onlyPicture){
        return(
            <View style={styles.container}>
                <Image style={styles.image} source={{uri:animal.imagem}}></Image>

                <View>
                    <Text style={styles.name}>{animal.nome}</Text>
                    <Text style={styles.location}>Santos</Text>
                </View>
            </View>
        );
    } else {
        return(
            <Image style={styles.image} source={{uri:animal.imagem}}></Image>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        backgroundColor:"white",
        padding:15,
        borderRadius:25,
        display:"flex",
        marginRight:15,
        marginBottom:15,
        gap:10
    },
    image:{
        width:"100%",
        height:"80%",
        borderRadius:15
    },
    name:{
        fontSize:18
    },
    location:{
        color:"gray",
        marginTop:5
    }
});