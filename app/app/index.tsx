import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View, Image, StyleSheet, Animated, Easing, useWindowDimensions } from "react-native";
import React, { useEffect, useRef } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const drawerTranslateY = useRef(new Animated.Value(260)).current;
  const drawerOpacity = useRef(new Animated.Value(0)).current;
  const logoTopPadding = Math.round(insets.top + height * 0.25);

  const drawerHeight = Math.round(Math.max(170, Math.min(240, height * 0.25)));
  const drawerRadius = Math.round(Math.max(42, Math.min(64, width * 0.16)));

  const primaryButtonWidth = Math.round(Math.max(180, Math.min(80, width * 0.6)));
  const primaryButtonHeight = Math.round(Math.max(46, Math.min(56, height * 0.06)));

  const secondaryButtonWidth = Math.round(Math.max(170, Math.min(250, width * 0.5)));
  const secondaryButtonHeight = Math.round(Math.max(38, Math.min(46, height * 0.045)));

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
      <Animated.View style={[styles.logoSection, { opacity: logoOpacity, paddingTop: logoTopPadding }]}> 
        <Image
          source={require("../assets/images/letra.png")}
          style={styles.logo}
        />
        <Text style={styles.title}>Adotaí</Text>
      </Animated.View>

      <Animated.View style={[styles.actionsBackground, {
        opacity: drawerOpacity,
        transform: [{ translateY: drawerTranslateY }],
        height: drawerHeight,
        borderTopLeftRadius: drawerRadius,
        borderTopRightRadius: drawerRadius,
        paddingBottom: 0 + insets.bottom * 0.0,
      }]}> 
        <View style={styles.actionsSection}>
          <TouchableOpacity
            style={[styles.primaryButton, { width: primaryButtonWidth, height: primaryButtonHeight }]}
            onPress={() => router.push("/login")}
          >
            <Text style={styles.buttonText}>Entre</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.secondaryButton, { width: secondaryButtonWidth, height: secondaryButtonHeight }]}
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
    justifyContent: "center",
    alignItems: "center",
  },
  secondaryButton: {
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#634744",
    fontSize: 17,
    fontWeight: "bold",
  },
});
