import { useRouter } from "expo-router";
import { navigate } from "expo-router/build/global-state/routing";
import { Image, StyleSheet, Text, Touchable, TouchableOpacity, View } from "react-native";

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
    const router = useRouter();

    if(!onlyPicture){
        return(
            <TouchableOpacity style={styles.container} onPress={()=>(router.push("/perfil-pet"))}>
                <Image style={styles.image} source={{uri:animal.imagem}}></Image>

                <View>
                    <Text style={styles.name}>{animal.nome}</Text>
                    <Text style={styles.location}>Santos</Text>
                </View>
            </TouchableOpacity>
        );
    } else {
        return(
            <TouchableOpacity style={styles.image} onPress={()=>(router.push("/perfil-pet"))}>
                <Image style={styles.image} source={{uri:animal.imagem}}></Image>
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        backgroundColor:"white",
        padding:15,
        borderRadius:25,
        display:"flex",
        gap:10
    },
    image:{
        width:"100%",
        height:"100%",
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