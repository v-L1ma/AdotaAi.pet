import { StyleSheet, View } from "react-native";
import Icon from 'react-native-vector-icons/Octicons';
import IconMat from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from "@/styles/variables";
import { useRouter } from "expo-router";
import { BlurView } from "expo-blur";

export default function NavBar(){

    const router = useRouter();

    return(
        <View style={styles.wrapper}>
            <BlurView style={styles.container}  intensity={60} tint="light" >
                <Icon onPress={()=>router.replace("/Home")}  style={styles.icon} name="home" size={30} color={colors.primary}></Icon>
                <Icon onPress={()=>router.push("/listagemPets")} style={styles.icon} name="search" size={30} color={colors.primary}></Icon>
                
                <IconMat style={styles.icon} name="heart-plus-outline" size={30} color={colors.primary}></IconMat>
                <IconMat style={styles.icon} name="menu" size={30} color={colors.primary}></IconMat>
            </BlurView>
        </View>
    );
}

const styles = StyleSheet.create({

    wrapper:{
        display:"flex", 
        flexDirection:"row", 
        alignItems:"center",
        justifyContent:"center", 
        borderRadius:20, 
        overflow:"hidden",
        position:"fixed",
        width:"100%",
        bottom:10,
        left:0,
        borderWidth:2,
        borderColor:"white"
    },
    container:{
        backgroundColor:"rgba(255, 255, 255, 0.74)",
        width:"100%",
        paddingTop:20,
        paddingBottom:20,
        borderRadius:20,
        display:"flex",
        flexDirection:"row",
        justifyContent:"space-around",
    },
    icon:{
        borderRadius:"100%"
    }
});