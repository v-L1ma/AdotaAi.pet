import { StyleSheet, View } from "react-native";
import Icon from 'react-native-vector-icons/Octicons';
import IconMat from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from "@/styles/variables";
import { usePathname } from "expo-router";
import { BlurView } from "expo-blur";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { TouchableOpacity } from "react-native";
import { useTabNavigation } from "@/hooks/useTabNavigation";

export default function NavBar(){

    const { navigateToTab } = useTabNavigation();
    const pathname = usePathname();
    const insets = useSafeAreaInsets();

    const normalizedPath = (pathname || "").toLowerCase();

    const isHomeSelected = normalizedPath === "/" || normalizedPath === "/home";
    const isListagemSelected = normalizedPath === "/listagem-pets" || normalizedPath === "/listagempets";
    const isCreateSelected = normalizedPath === "/criar-anuncio" || normalizedPath === "/criaranuncio";
    const isConfigSelected = normalizedPath === "/config";

    return(
        <View style={[styles.wrapper, { right: -insets.right, left: -insets.left }]}>
            <BlurView
                style={[
                    styles.container,
                    {
                        paddingBottom: Math.max(insets.bottom, 12),
                        paddingRight: insets.right || 0,
                        paddingLeft: insets.left || 0,
                    },
                ]}
                intensity={60}
                tint="light"
            >
                <TouchableOpacity style={[styles.iconButton, isHomeSelected && styles.iconButtonSelected]} onPress={()=>navigateToTab("/home") }>
                    <Icon style={styles.icon} name="home" size={30} color={colors.primary}></Icon>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.iconButton, isListagemSelected && styles.iconButtonSelected]} onPress={()=>navigateToTab("/listagem-pets") }>
                    <Icon style={styles.icon} name="search" size={30} color={colors.primary}></Icon>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.iconButton, isCreateSelected && styles.iconButtonSelected]} onPress={()=>navigateToTab("/criar-anuncio") }>
                    <IconMat style={styles.icon} name="heart-plus-outline" size={30} color={colors.primary}></IconMat>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.iconButton, isConfigSelected && styles.iconButtonSelected]} onPress={()=>navigateToTab("/config") }>
                    <IconMat style={styles.icon} name="menu" size={30} color={colors.primary}></IconMat>
                </TouchableOpacity>
            </BlurView>
        </View>
    );
}

const styles = StyleSheet.create({

    wrapper:{
        position:"absolute",
        bottom:0,
        left:0,
        right:0,
        width:"100%",
        overflow:"hidden",
    },
    container:{
        backgroundColor:"rgba(255, 255, 255, 0.92)",
        width:"100%",
        paddingTop:18,
        paddingHorizontal:0,
        borderTopLeftRadius:20,
        borderTopRightRadius:20,
        flexDirection:"row",
        justifyContent:"space-around",
        alignItems:"center",
        borderTopWidth: 1,
        borderTopColor: "rgba(255, 255, 255, 0.96)",
    },
    iconButton: {
        width: 44,
        height: 44,
        borderRadius: 14,
        alignItems: "center",
        justifyContent: "center",
    },
    iconButtonSelected: {
        backgroundColor: "#FFFFFF",
        transform: [{ translateY: -8 }],
        shadowColor: "#000",
        shadowOpacity: 0.12,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 8,
        elevation: 3,
    },
    icon:{
        borderRadius:100
    }
});