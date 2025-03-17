import React from "react";
import { View, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import FooterBar from "./footerBar/footerBar"; // Import the common footer component

const Footer = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <FooterBar
        onPressHome={() => navigation.navigate("HomeScreen")}
        onPressStore={() => navigation.navigate("StoreScreen")}
        onPressCart={() => navigation.navigate("CartScreen")}
        onPressProfile={() => navigation.navigate("ProfileScreen")}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
});

export default Footer;
