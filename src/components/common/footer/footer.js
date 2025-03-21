import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import FooterBar from "../footerBar/footerBar"; // Import the common footer component

const Footer = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
     <FooterBar
        onPressHome={() => navigation.navigate("Home")}
        onPressDesign={() => navigation.navigate("Design")}
        onPressWoodworker={() => navigation.navigate("Woodworker")}
        onPressCart={() => navigation.navigate("Cart")}
        onPressProfile={() => navigation.navigate("Profile")}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  footerItem: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    marginTop: 4,
    color: 'orange',
  },
});

export default Footer;
