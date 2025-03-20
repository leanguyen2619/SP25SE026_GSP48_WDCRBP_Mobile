import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const FooterBar = ({
  onPressHome,
  onPressDesign,
  onPressWoodworker,
  onPressCart,
  onPressProfile,
  iconSize = 24,
  iconColor = "orange",
  textSize = 12,
  textColor = "orange",
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onPressHome} style={styles.iconButton}>
        <Ionicons name="home-outline" size={iconSize} color={iconColor} />
        <Text style={[styles.iconText, { fontSize: textSize, color: textColor }]}>Home</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={onPressDesign} style={styles.iconButton}>
        <Ionicons name="albums-outline" size={iconSize} color={iconColor} />
        <Text style={[styles.iconText, { fontSize: textSize, color: textColor }]}>Design</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={onPressWoodworker} style={styles.iconButton}>
        <Ionicons name="people-outline" size={iconSize} color={iconColor} />
        <Text style={[styles.iconText, { fontSize: textSize, color: textColor }]}>Woodworker</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={onPressCart} style={styles.iconButton}>
        <Ionicons name="cart-outline" size={iconSize} color={iconColor} />
        <Text style={[styles.iconText, { fontSize: textSize, color: textColor }]}>Cart</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={onPressProfile} style={styles.iconButton}>
        <Ionicons name="person-outline" size={iconSize} color={iconColor} />
        <Text style={[styles.iconText, { fontSize: textSize, color: textColor }]}>Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  iconButton: {
    alignItems: "center",
    padding: 10,
  },
  iconText: {
    marginTop: 4,
    fontWeight: "bold",
  },
});

export default FooterBar;
