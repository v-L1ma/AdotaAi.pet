import { StyleSheet, View } from "react-native";
import Icon from 'react-native-vector-icons/Octicons';
import IconMat from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from "@/styles/variables";

export default function NavBar(){
    return(
        <View style={styles.container}>
            <Icon style={styles.icon} name="home" size={30} color={colors.primary}></Icon>
            <IconMat style={styles.icon} name="cards-heart-outline" size={30} color={colors.primary}></IconMat>
            
            <IconMat style={styles.icon} name="cards-heart-outline" size={30} color={colors.primary}></IconMat>
        </View>
    );
}

const styles = StyleSheet.create({
    container:{
        backgroundColor:"white",
        width:"100%",
        paddingTop:20,
        paddingBottom:20,
        borderRadius:20,
        display:"flex",
        flexDirection:"row",
        justifyContent:"space-around"
    },
    icon:{
        borderRadius:"100%"
    }
});