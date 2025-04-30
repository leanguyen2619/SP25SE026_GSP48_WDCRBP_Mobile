// components/Footer.jsx
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import useAuth from "../../hooks/useAuth.js";
import { appColorTheme } from "../../config/appconfig.js";

export default function Footer() {
  const navigation = useNavigation();
  const route = useRoute();
  const { auth } = useAuth();

  const links = [
    { name: "Products", label: "Sản phẩm", icon: "shopping-bag" },
    { name: "Designs", label: "Thiết kế", icon: "grid" },
    { name: "Woodworkers", label: "Xưởng mộc", icon: "users" },
    { name: "GuaranteeRequest", label: "Sửa chữa / Bảo hành", icon: "tool" },
    { name: "Pricing", label: "Pricing", icon: "dollar-sign" },
  ];

  // apply same visibility rules as Header
  const filtered = links.filter((link) => {
    if (link.name === "Pricing" && auth?.role) return false;
    if (link.name === "Guarantee" && auth?.role !== "Customer") return false;
    return true;
  });

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {filtered.map((link) => {
          const isActive = route.name === link.name;
          return (
            <TouchableOpacity
              key={link.name}
              style={styles.button}
              onPress={() => navigation.navigate(link.name)}
            >
              <Feather
                name={link.icon}
                size={24}
                color={isActive ? appColorTheme.brown_2 : "#333"}
              />
              <Text
                style={[
                  styles.label,
                  isActive && { color: appColorTheme.brown_2 },
                ]}
              >
                {link.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
    paddingVertical: 8,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  button: {
    alignItems: "center",
    padding: 8,
  },
  label: {
    marginTop: 4,
    fontSize: 11,
    color: "#333",
  },
});
