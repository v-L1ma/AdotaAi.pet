import { Image, StyleSheet, Text, View } from "react-native";

export default function CardPet(){
    return(
        <View style={styles.container}>
            <Image style={styles.image} source={{uri:"https://img.freepik.com/fotos-gratis/fotografia-vertical-de-foco-superficial-de-um-bonito-cachorro-de-golden-retriever-sentado-em-um-chao-de-grama_181624-27259.jpg?w=360"}}></Image>

            <View>
                <Text style={styles.name}>Alfredo</Text>
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
        gap:10
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