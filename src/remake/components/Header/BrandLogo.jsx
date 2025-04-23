import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function BrandLogo() {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => navigation.navigate("Home")}
    >
      <Image
        source={require("../../assets/images/logo.png")}
        style={styles.logo}
        resizeMode="contain"
      />
      <View>
        <Text style={styles.brandName}>WDCRBP</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  logo: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#E6CCAA", // app_brown.0 equivalent
  },
  brandName: {
    fontSize: 24,
    fontWeight: "bold",
    letterSpacing: 1,
    fontFamily: "Jockey One",
  },
  brandSubtitle: {
    fontSize: 14,
    fontFamily: "Montserrat",
  },
});
