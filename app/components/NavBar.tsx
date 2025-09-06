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
            <BlurView style={styles.container}  intensity={80} tint="light" >
                <Icon onPress={()=>router.push("/Home")}  style={styles.icon} name="home" size={30} color={colors.primary}></Icon>
                <IconMat onPress={()=>router.push("/listagemPets")} style={styles.icon} name="cards-heart-outline" size={30} color={colors.primary}></IconMat>
                
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
        width:"90%",
        bottom:10,
        left:20

    },
    container:{
        backgroundColor:"rgba(255, 255, 255, 0.86)",
        width:"100%",
        paddingTop:20,
        paddingBottom:20,
        borderRadius:20,
        display:"flex",
        flexDirection:"row",
        justifyContent:"space-around",
        borderWidth:2,
        borderColor:"white"
    },
    icon:{
        borderRadius:100
    }
});