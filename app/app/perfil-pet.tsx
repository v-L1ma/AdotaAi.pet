import { HeaderBackButton } from "@react-navigation/elements";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Image, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import IconMat from "react-native-vector-icons/MaterialCommunityIcons";
import IconIonic from "react-native-vector-icons/Ionicons";
import { colors } from "@/styles/variables";

export default function PerfilPet(){

    const router = useRouter();
    const [heartColor, setHeartColor]=useState<string>("black")
    const [heartIcon, setHeartIcon]=useState<string>("heart-outline")

    const {nome,imagem} = useLocalSearchParams();

    // const [descriptionLength, setDescriptionLength] = useState<number>(60)
    // const [verMaisText, setVerMaisText]= useState<string>("Ver mais")
        const [description, setDescription] = useState<string>("Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quidem architecto suscipit harum magnam sapiente delectus, nihil fugiat ducimus, ")

    function favoritePet(){
        heartColor === "black" ? setHeartColor("red") : setHeartColor("black");
        heartIcon === "heart-outline" ? setHeartIcon("heart") : setHeartIcon("heart-outline")
    }

    // function showHideDescription(){

    //     descriptionLength === 60 
    //     ?  setDescriptionLength(description.length)
    //     : setDescriptionLength(60)

    //     descriptionLength === 60
    //     ? setVerMaisText("Ver mais") 
    //     :  setVerMaisText("Ver menos")


    //     setDescription(description.split("", descriptionLength).toLocaleString)
    // }


    return(
        <View style={style.container}>
            <View style={style.header}>
                <HeaderBackButton onPress={router.back} style={{backgroundColor:"white"}}></HeaderBackButton>
                <Pressable onPress={()=>favoritePet()}>
                    <IconMat name={heartIcon} size={35} color={heartColor}></IconMat>
                </Pressable>
            </View>

            <View style={style.image}>
                <View style={{height:60}}></View>
            
                <Image style={{height:"100%", width:"80%", margin:"auto"}} resizeMode="stretch" source={{uri:imagem.toString()}}></Image>

            </View>
        
            <View  style={style.infos}>
                
            <View style={{marginTop:-20}}>
                <Text style={{fontSize:26, fontWeight:"bold",color:"white"}}>{nome}</Text>
                <View style={style.location}>
                    <IconIonic name="location-outline" size={26} color={"white"}></IconIonic>
                    <Text style={style.location}> Marapé, Santos - SP</Text>
                </View>
            </View>

            <View style={style.caracteristicasContainer}>
                <View style={style.caracteristicasCard}>
                    <Text style={style.tituloCard}>9 meses</Text>
                    <Text style={style.textoCard}>Idade</Text>
                </View>

                <View style={style.caracteristicasCard}>
                    <Text style={style.tituloCard}>Macho</Text>
                    <Text style={style.textoCard}>Gênero</Text>
                </View>

                <View style={style.caracteristicasCard}>
                    <Text style={style.tituloCard}>3.5kg</Text>
                    <Text style={style.textoCard}>Peso</Text>
                </View>
            </View>

            <View>
                <Text style={{fontSize:26, fontWeight:"bold",color:"white"}}>Sobre</Text>
                <Text style={{fontSize:18, display:"flex", flexDirection:"column", alignItems:"center", color:"rgba(236, 236, 236, 1)"}}>
                    {
                        description
                    }
                </Text>
            </View>
        
            <TouchableOpacity style={style.button}>
               <Text style={{textAlign:"center", fontWeight:"bold", fontSize:20, color:colors.primary}}>Adotar!</Text>
            </TouchableOpacity>
        </View>


        </View>
    )
}

const style = StyleSheet.create({
    container:{
        paddingTop:80,
        backgroundColor:colors.primary,
        height:"100%",
        position:"relative",
        overflow:"hidden"
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
        borderBottomRightRadius:300,
        borderBottomLeftRadius:300,
        overflow:"hidden",
    },
    location:{
        fontSize:18,
        display:"flex",
        flexDirection:"row",
        alignItems:"center", 
        color:"rgba(236, 236, 236, 1)",
    },
    infos:{
        paddingHorizontal:25,
        display:"flex",
        flexDirection:"column",
        gap:20
        
    },
    caracteristicasContainer:{
        display:"flex",
        flexDirection:"row",
        justifyContent:"space-between",
        gap:10
    },
    caracteristicasCard:{
        backgroundColor:"white",
        width:"30%",
        paddingVertical:"5%",
        borderRadius:15,
    },
    textoCard:{
        textAlign:"center",
        color:colors.primary,
        fontWeight:"500"
    },
    tituloCard:{
        textAlign:"center",
        color:colors.primary,
        fontWeight:"900"
    },
    button:{
        margin:"auto",
        backgroundColor:"white",
        width:"60%",
        padding:"5%",
        borderRadius:15,
        fontWeight:"bold",
        fontFamily:"sans",
        height:60
    }
});
