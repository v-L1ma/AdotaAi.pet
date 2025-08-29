import { Header, HeaderBackButton } from "@react-navigation/elements";
import { useRouter } from "expo-router";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

export default function PerfilPet(){

    const router = useRouter();
    return(
        <View style={style.container}>
            <View style={style.header}>
                <HeaderBackButton onPress={router.back}></HeaderBackButton>
                <Pressable>&lt;3</Pressable>
            </View>

            <Image style={style.image} source={{uri:"https://www.whiskas.com.br/sites/g/files/fnmzdf2156/files/2024-08/idade-dos-gatos-01.jpg"}}></Image>
        
            <Text>Juninho Ruindade Pura</Text>
        
        </View>
    )
}

const style = StyleSheet.create({
    container:{
        paddingTop:60,
        backgroundColor:"#FFC7C2",
        height:"100%",
        position:"relative",
    },
    header:{
        flexDirection:"row",
        justifyContent:"space-between",
        alignItems:"flex-start",
        height:"50%",
        zIndex:2,
        paddingHorizontal:25
    },
    image:{
        height:"50%",
        width:"130%",
        position:"absolute",
        top:0,
        left:"-15%",
        borderBottomRightRadius:"50%",
        borderBottomLeftRadius:"50%"
    }
});

// /* Ellipse 23 */

// position: absolute;
// left: -26.67%;
// right: -26.41%;
// top: -9.24%;
// bottom: 48.7%;

// background: #FE6F61;
