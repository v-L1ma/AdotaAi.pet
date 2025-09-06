import React from "react";
import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import styles from "../styles/AppStyles";
import Icon1 from "react-native-vector-icons/EvilIcons";
import Icon2 from "react-native-vector-icons/Ionicons";
import Icon3 from "react-native-vector-icons/MaterialIcons";

export default function ConfigScreen() {
    const router = useRouter();

    return (
        <SafeAreaView style={{ backgroundColor: "#ffffffff" }}>
            <View style={{ alignItems: "center", height: "100%", gap: 15 }}>
                <Text style={{ fontSize: 20, fontWeight: "bold", marginTop: 20 }}>Configurações</Text>
                
                <TouchableOpacity style={styles.settingsButton} onPress={() => router.push("/login")} >
                    <View style={{flexDirection: "row", alignItems: "center"}}>
                    <Icon2 name="person-circle-outline" size={30} color="#000000ff"></Icon2>
                    <Text style={{ fontSize: 20, fontWeight: "bold", justifyContent: "space-between", width: "80%", paddingHorizontal: 10}}>Conta</Text>
                    <Icon1 name="chevron-right" size={30} color="#000000ff"></Icon1>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity style={styles.settingsButton} onPress={() => router.push("/login")} >
                    <View style={{flexDirection: "row", alignItems: "center"}}>
                    <Icon3 name="pets" size={30} color="#000000ff"></Icon3>
                    <Text style={{ fontSize: 20, fontWeight: "bold", justifyContent: "space-between", width: "80%", paddingHorizontal: 10}}>Meus pet's</Text>
                    <Icon1 name="chevron-right" size={30} color="#000000ff"></Icon1>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity style={styles.settingsButton} onPress={() => router.push("/login")} >
                    <View style={{flexDirection: "row", alignItems: "center"}}>
                    <Icon2 name="notifications" size={30} color="#000000ff"></Icon2>
                    <Text style={{ fontSize: 20, fontWeight: "bold", justifyContent: "space-between", width: "80%", paddingHorizontal: 10}}>Solicitações</Text>
                    <Icon1 name="chevron-right" size={30} color="#000000ff"></Icon1>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity style={styles.settingsButton} onPress={() => router.push("/login")} >
                    <View style={{flexDirection: "row", alignItems: "center"}}>
                    <Icon2 name="heart" size={30} color="#000000ff"></Icon2>
                    <Text style={{ fontSize: 20, fontWeight: "bold", justifyContent: "space-between", width: "80%", paddingHorizontal: 10}}>Meus favoritos</Text>
                    <Icon1 name="chevron-right" size={30} color="#000000ff"></Icon1>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity style={styles.settingsButton} onPress={() => router.push("/login")} >
                    <View style={{flexDirection: "row", alignItems: "center"}}>
                    <Icon2 name="exit-outline" size={30} color="#000000ff"></Icon2>
                    <Text style={{ fontSize: 20, fontWeight: "bold", justifyContent: "space-between", width: "80%", paddingHorizontal: 10}}>Sair</Text>
                    <Icon1 name="chevron-right" size={30} color="#000000ff"></Icon1>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity style={styles.settingsButton} onPress={() => router.push("/login")} >
                    <View style={{flexDirection: "row", alignItems: "center"}}>
                    <Icon2 name="help-circle-outline" size={30} color="#000000ff"></Icon2>
                    <Text style={{ fontSize: 20, fontWeight: "bold", justifyContent: "space-between", width: "80%", paddingHorizontal: 10}}>Sobre nós</Text>
                    <Icon1 name="chevron-right" size={30} color="#000000ff"></Icon1>
                    </View>
                </TouchableOpacity>

            </View>
        </SafeAreaView>
    );
}