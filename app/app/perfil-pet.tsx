import { HeaderBackButton } from "@react-navigation/elements";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Image, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import IconMat from "react-native-vector-icons/MaterialCommunityIcons";
import IconIonic from "react-native-vector-icons/Ionicons";

export default function PerfilPet(){

    const router = useRouter();
    const [heartColor, setHeartColor]=useState<string>("black")
    const [heartIcon, setHeartIcon]=useState<string>("heart-outline")

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
                <HeaderBackButton onPress={router.back}></HeaderBackButton>
                <Pressable onPress={()=>favoritePet()}>
                    <IconMat name={heartIcon} size={40} color={heartColor}></IconMat>
                </Pressable>
            </View>

            <Image style={style.image} source={{uri:"https://www.whiskas.com.br/sites/g/files/fnmzdf2156/files/2024-08/idade-dos-gatos-01.jpg"}}></Image>
        
            <View  style={style.infos}>
                
            <View>
                <Text style={{fontSize:26, fontWeight:"semibold"}}>Juninho Ruindade Pura</Text>
                <Text style={{fontSize:20, display:"flex",alignItems:"center", color:"rgb(34, 34, 34)"}}><IconIonic name="location-outline" size={26}></IconIonic> Marapé, Santos - SP</Text>
            </View>

            <View style={style.caracteristicasContainer}>
                <View style={style.caracteristicasCard}>
                    <Text style={style.texto}>9 meses</Text>
                    <Text style={style.texto}>Idade</Text>
                </View>

                <View style={style.caracteristicasCard}>
                    <Text style={style.texto}>Macho</Text>
                    <Text style={style.texto}>Gênero</Text>
                </View>

                <View style={style.caracteristicasCard}>
                    <Text style={style.texto}>3.5kg</Text>
                    <Text style={style.texto}>Peso</Text>
                </View>
            </View>

            <View>
                <Text style={{fontSize:26, fontWeight:"semibold"}}>Sobre</Text>
                <Text style={{fontSize:20, display:"flex", flexDirection:"column", alignItems:"center", color:"rgb(34, 34, 34)"}}>
                    {
                        description
                    }
                </Text>
            </View>
        
            <TouchableOpacity style={style.button}>
                Adotar!
            </TouchableOpacity>
        </View>


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
        borderBottomRightRadius:300,
        borderBottomLeftRadius:300
    },
    infos:{
        paddingHorizontal:25,
        display:"flex",
        flexDirection:"column",
        gap:20
        
    },
    texto:{
        textAlign:"center"
    },
    caracteristicasContainer:{
        display:"flex",
        flexDirection:"row",
        justifyContent:"space-between"
    },
    caracteristicasCard:{
        backgroundColor:"#FFC38B",
        paddingHorizontal:"10%",
        paddingVertical:"5%",
        borderRadius:15,
    },
    button:{
        backgroundColor:"white",
        textAlign:"center",
        padding:"5%",
        borderRadius:15,
        fontWeight:"bold",
        fontFamily:"sans"
    }
});
