import { StyleSheet, View } from "react-native";
import Icon from 'react-native-vector-icons/Octicons';
import IconMat from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from "@/styles/variables";
import { useRouter } from "expo-router";
import { BlurView } from "expo-blur";
import React from "react";

export default function NavBar(){

    const router = useRouter();

    return(
        <View style={styles.wrapper}>
            <BlurView style={styles.container}  intensity={60} tint="light" >
                <Icon onPress={()=>router.replace("/Home")}  style={styles.icon} name="home" size={30} color={colors.primary}></Icon>
                <Icon onPress={()=>router.push("/listar-pets")} style={styles.icon} name="search" size={30} color={colors.primary}></Icon>
                <IconMat onPress={()=>router.push("/criar-formulario")} style={styles.icon} name="heart-plus-outline" size={30} color={colors.primary}></IconMat>
                <IconMat onPress={()=>router.push("/meus-eventos")} style={styles.icon} name="menu" size={30} color={colors.primary}></IconMat>
            </BlurView>
        </View>
    );
}

const styles = StyleSheet.create({

    wrapper:{
        width:"100%",
        margin:"auto",
        display:"flex", 
        flexDirection:"row", 
        alignSelf:"center",
        alignItems:"center",
        justifyContent:"center", 
        borderRadius:20, 
        overflow:"hidden",
        position:"fixed",
        bottom:10,
        left:0,
        borderWidth:2,
        borderColor:"white"
    },
    container:{
        width:"100%",
        margin:"auto",
        backgroundColor:"rgba(255, 255, 255, 0.74)",
        paddingTop:20,
        paddingBottom:20,
        borderRadius:20,
        display:"flex",
        flexDirection:"row",
        justifyContent:"space-around",
    },
    icon:{
        borderRadius:100
    }
});