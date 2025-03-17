import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const FooterBar = ({
  onPressHome,
  onPressStore,
  onPressCart,
  onPressProfile,
  iconSize = 24,
  iconColor = "orange",
  textSize = 12,
  textColor = "orange",
}) => {
  return (
    <View style={styles.container}>
      {/* Home Button */}
      <TouchableOpacity onPress={onPressHome} style={styles.iconButton}>
        <Ionicons name="home-outline" size={iconSize} color={iconColor} />
        <Text style={[styles.iconText, { fontSize: textSize, color: textColor }]}>Home</Text>
      </TouchableOpacity>

      {/* Store Button */}
      <TouchableOpacity onPress={onPressStore} style={styles.iconButton}>
        <Ionicons name="storefront-outline" size={iconSize} color={iconColor} />
        <Text style={[styles.iconText, { fontSize: textSize, color: textColor }]}>Store</Text>
      </TouchableOpacity>

      {/* Cart Button */}
      <TouchableOpacity onPress={onPressCart} style={styles.iconButton}>
        <Ionicons name="cart-outline" size={iconSize} color={iconColor} />
        <Text style={[styles.iconText, { fontSize: textSize, color: textColor }]}>Cart</Text>
      </TouchableOpacity>

      {/* Profile Button */}
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
