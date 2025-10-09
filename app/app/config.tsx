import { Ionicons } from '@expo/vector-icons';
import { useRouter } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon1 from "react-native-vector-icons/EvilIcons";
import Icon2 from "react-native-vector-icons/Ionicons";
import Icon3 from "react-native-vector-icons/MaterialIcons";
import colors from '../styles/colors';

export default function ConfigScreen() {
    const router = useRouter();

    return (
        <>
            {/* Safe area do topo branca */}
            <SafeAreaView edges={['top']} style={{ backgroundColor: '#fff' }} />
            {/* Header customizado padrão do app */}
            <View style={{
                width: "100%",
                backgroundColor: '#fff',
                borderBottomLeftRadius: 30,
                borderBottomRightRadius: 30,
                paddingTop: 50,
                paddingBottom: 20,
                shadowColor: '#000',
                shadowOpacity: 0.06,
                shadowRadius: 4,
                elevation: 2,
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 16,
            }}>
                <TouchableOpacity onPress={() => router.back()} style={{ position: 'absolute', left: 16, top: 52, zIndex: 2 }} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                    <Ionicons name="arrow-back" size={28} color={colors.primary} />
                </TouchableOpacity>
                <View style={{ flex: 1, alignItems: 'center' }}>
                      <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#e74c3c', textAlign: 'center', marginBottom: 0 }}>Configurações</Text>
                </View>
            </View>
            {/* ...restante da tela... */}
                        <View style={{ alignItems: "center", height: "100%", gap: 15, marginTop: 32 }}>
                                {/* Card: Conta */}
                                <View style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    backgroundColor: '#fff',
                                    borderRadius: 22,
                                    marginBottom: 10,
                                    width: '92%',
                                    minHeight: 64,
                                    shadowColor: '#000',
                                    shadowOpacity: 0.10,
                                    shadowRadius: 8,
                                    elevation: 3,
                                    padding: 8,
                                    borderWidth: 2,
                                    borderColor: '#ececec',
                                }}>
                                    <TouchableOpacity style={{ flex: 1 }} onPress={() => router.push("/perfil-user") } activeOpacity={0.7}>
                                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                                            <Icon2 name="person-circle-outline" size={30} color="#000000ff" />
                                            <Text style={{ fontSize: 20, fontWeight: "bold", justifyContent: "space-between", width: "80%", paddingHorizontal: 10 }}>Conta</Text>
                                            <Icon1 name="chevron-right" size={30} color="#000000ff" />
                                        </View>
                                    </TouchableOpacity>
                                </View>
                                {/* Card: Meus Pets */}
                                <View style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    backgroundColor: '#fff',
                                    borderRadius: 22,
                                    marginBottom: 10,
                                    width: '92%',
                                    minHeight: 64,
                                    shadowColor: '#000',
                                    shadowOpacity: 0.10,
                                    shadowRadius: 8,
                                    elevation: 3,
                                    padding: 8,
                                    borderWidth: 2,
                                    borderColor: '#ececec',
                                }}>
                                    <TouchableOpacity style={{ flex: 1 }} onPress={() => router.push("/MeusPets") } activeOpacity={0.7}>
                                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                                            <Icon3 name="pets" size={30} color="#000000ff" />
                                            <Text style={{ fontSize: 20, fontWeight: "bold", justifyContent: "space-between", width: "80%", paddingHorizontal: 10 }}>Meus pet's</Text>
                                            <Icon1 name="chevron-right" size={30} color="#000000ff" />
                                        </View>
                                    </TouchableOpacity>
                                </View>
                                {/* Card: Solicitações */}
                                <View style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    backgroundColor: '#fff',
                                    borderRadius: 22,
                                    marginBottom: 10,
                                    width: '92%',
                                    minHeight: 64,
                                    shadowColor: '#000',
                                    shadowOpacity: 0.10,
                                    shadowRadius: 8,
                                    elevation: 3,
                                    padding: 8,
                                    borderWidth: 2,
                                    borderColor: '#ececec',
                                }}>
                                    <TouchableOpacity style={{ flex: 1 }} onPress={() => router.push("/solicitacoes") } activeOpacity={0.7}>
                                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                                            <Icon2 name="notifications" size={30} color="#000000ff" />
                                            <Text style={{ fontSize: 20, fontWeight: "bold", justifyContent: "space-between", width: "80%", paddingHorizontal: 10 }}>Solicitações</Text>
                                            <Icon1 name="chevron-right" size={30} color="#000000ff" />
                                        </View>
                                    </TouchableOpacity>
                                </View>
                                {/* Card: Meus favoritos */}
                                <View style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    backgroundColor: '#fff',
                                    borderRadius: 22,
                                    marginBottom: 10,
                                    width: '92%',
                                    minHeight: 64,
                                    shadowColor: '#000',
                                    shadowOpacity: 0.10,
                                    shadowRadius: 8,
                                    elevation: 3,
                                    padding: 8,
                                    borderWidth: 2,
                                    borderColor: '#ececec',
                                }}>
                                    <TouchableOpacity style={{ flex: 1 }} onPress={() => router.push("/login") } activeOpacity={0.7}>
                                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                                            <Icon2 name="heart" size={30} color="#000000ff" />
                                            <Text style={{ fontSize: 20, fontWeight: "bold", justifyContent: "space-between", width: "80%", paddingHorizontal: 10 }}>Meus favoritos</Text>
                                            <Icon1 name="chevron-right" size={30} color="#000000ff" />
                                        </View>
                                    </TouchableOpacity>
                                </View>
                                {/* Card: Sobre nós */}
                                <View style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    backgroundColor: '#fff',
                                    borderRadius: 22,
                                    marginBottom: 10,
                                    width: '92%',
                                    minHeight: 64,
                                    shadowColor: '#000',
                                    shadowOpacity: 0.10,
                                    shadowRadius: 8,
                                    elevation: 3,
                                    padding: 8,
                                    borderWidth: 2,
                                    borderColor: '#ececec',
                                }}>
                                    <TouchableOpacity style={{ flex: 1 }} onPress={() => router.push("/sobre-nos") } activeOpacity={0.7}>
                                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                                            <Icon2 name="help-circle-outline" size={30} color="#000000ff" />
                                            <Text style={{ fontSize: 20, fontWeight: "bold", justifyContent: "space-between", width: "80%", paddingHorizontal: 10 }}>Sobre nós</Text>
                                            <Icon1 name="chevron-right" size={30} color="#000000ff" />
                                        </View>
                                    </TouchableOpacity>
                                </View>
                                {/* Card: Sair */}
                                <View style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    backgroundColor: '#fff',
                                    borderRadius: 22,
                                    marginBottom: 10,
                                    width: '92%',
                                    minHeight: 64,
                                    shadowColor: '#000',
                                    shadowOpacity: 0.10,
                                    shadowRadius: 8,
                                    elevation: 3,
                                    padding: 8,
                                    borderWidth: 2,
                                    borderColor: '#ececec',
                                }}>
                                    <TouchableOpacity style={{ flex: 1 }} onPress={() => router.push("/login") } activeOpacity={0.7}>
                                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                                            <Icon2 name="exit-outline" size={30} color="#000000ff" />
                                            <Text style={{ fontSize: 20, fontWeight: "bold", justifyContent: "space-between", width: "80%", paddingHorizontal: 10 }}>Sair</Text>
                                            <Icon1 name="chevron-right" size={30} color="#000000ff" />
                                        </View>
                                    </TouchableOpacity>
                                </View>
                        </View>
        </>
    );
}