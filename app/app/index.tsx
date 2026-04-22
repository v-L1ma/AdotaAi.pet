import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View, Image, StyleSheet, Animated, Easing } from "react-native";
import React, { useEffect, useRef } from "react";

export default function HomeScreen() {
  const router = useRouter();
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const drawerTranslateY = useRef(new Animated.Value(260)).current;
  const drawerOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 650,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.timing(drawerOpacity, {
          toValue: 1,
          duration: 220,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(drawerTranslateY, {
          toValue: 0,
          duration: 300,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, [drawerOpacity, drawerTranslateY, logoOpacity]);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.logoSection, { opacity: logoOpacity }]}> 
        <Image
          source={require("../assets/images/letra.png")}
          style={styles.logo}
        />
        <Text style={styles.title}>Adotaí</Text>
      </Animated.View>

      <Animated.View style={[styles.actionsBackground, { opacity: drawerOpacity, transform: [{ translateY: drawerTranslateY }] }]}> 
        <View style={styles.actionsSection}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => router.push("/login")}
          >
            <Text style={styles.buttonText}>Entre</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => router.push("/cadastro")}
          >
            <Text style={styles.buttonText}>Crie sua conta</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fda49c",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  logoSection: {
    flex: 1,
    width: "100%",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: 170,
  },
  logo: {
    height: 180,
    width: 180,
    resizeMode: "contain",
    marginBottom: -30,
  },
  title: {
    fontFamily: "Georgia",
    fontSize: 42,
    fontWeight: "bold",
    color: "#fcf3f2",
  },
  actionsBackground: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    width: "100%",
    height: 190,
    borderTopLeftRadius: 60,
    borderTopRightRadius: 60,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 8,
    paddingBottom: 12,
  },
  actionsSection: {
    width: "100%",
    alignItems: "center",
    rowGap: 10,
  },
  primaryButton: {
    backgroundColor: "#ffb49b",
    borderRadius: 12,
    width: 196,
    height: 58,
    justifyContent: "center",
    alignItems: "center",
  },
  secondaryButton: {
    width: 180,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#634744",
    fontSize: 17,
    fontWeight: "bold",
  },
});
