import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Platform,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import BrandLogo from "./BrandLogo";
import AccountMenu from "./AccountMenu";
import { appColorTheme } from "../../config/appconfig";
import useAuth from "../../hooks/useAuth";

export default function Header() {
  const navigation = useNavigation();
  const { auth } = useAuth();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.logoContainer}
          onPress={() => navigation.navigate("Home")}
        >
          <BrandLogo />
        </TouchableOpacity>

        <View style={styles.rightSection}>
          <AccountMenu />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
    paddingTop: Platform.OS === "ios" ? 0 : StatusBar.currentHeight,
    zIndex: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  logoContainer: {
    flex: 1,
  },
  rightSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
  iconButton: {
    padding: 5,
  },
});
