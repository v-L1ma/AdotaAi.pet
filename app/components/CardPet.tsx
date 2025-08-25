import { Image, StyleSheet, Text, View } from "react-native";

type animal = {
    nome:string,
    imagem:string
}

type Props = {
    animal:animal,
    index:number
}

export default function CardPet({animal,index}:Props){
    const teste:string =""
    return(
        <View style={styles.container}>
            <Image style={styles.image} source={{uri:animal.imagem}}></Image>

            <View>
                <Text style={styles.name}>{animal.nome}</Text>
                <Text style={styles.location}>Santos</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container:{
        backgroundColor:"white",
        padding:15,
        borderRadius:25,
        display:"flex",
        gap:10,
        marginRight:10
    },
    image:{
        width:220,
        height:220,
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