import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { appColorTheme } from "../../config/appconfig.js";
import { useNavigation, useRoute } from "@react-navigation/native";

export default function CustomerSidebar({ isCollapsed, setIsCollapsed }) {
  const navigation = useNavigation();
  const route = useRoute();

  const isPathActive = (path) => {
    return route.name.toLowerCase().includes(path.toLowerCase());
  };

  const navItems = [
    { label: "Đơn hàng", path: "CustomerServiceOrders", icon: "shopping-cart" },
    {
      label: "BH & Sữa chữa",
      path: "CustomerGuaranteeOrders",
      icon: "settings",
    },
    { label: "Ví", path: "CustomerWallet", icon: "credit-card" },
    { label: "Khiếu nại", path: "CustomerComplaint", icon: "alert-triangle" },
    { label: "Hồ sơ", path: "CustomerProfile", icon: "user" },
  ];

  if (isCollapsed) {
    return (
      <TouchableOpacity
        style={styles.toggleButtonCollapsed}
        onPress={() => setIsCollapsed(false)}
      >
        <Feather name="chevron-right" size={24} color="white" />
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.toggleButton, { backgroundColor: "black" }]}
        onPress={() => setIsCollapsed(true)}
      >
        <Feather name="chevron-left" size={24} color="white" />
      </TouchableOpacity>

      <ScrollView style={styles.scrollView}>
        {navItems.map((item, index) => {
          const isActive = isPathActive(item.path);

          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.menuItem,
                styles.expandedItem,
                isActive && styles.activeExpandedItem,
              ]}
              onPress={() =>
                navigation.navigate(item.path === "/" ? "Home" : item.path)
              }
            >
              <Feather
                name={item.icon}
                size={22}
                color={isActive ? "white" : appColorTheme.brown_1}
              />

              <Text
                style={[styles.menuText, isActive && styles.activeMenuText]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  toggleButton: {
    position: "absolute",
    top: 10,
    right: -35,
    width: 35,
    height: 35,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },
  toggleButtonCollapsed: {
    position: "absolute",
    top: 10,
    left: 10,
    width: 35,
    height: 35,
    borderRadius: 20,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },
  menuItem: {
    marginBottom: 8,
    borderRadius: 10,
    overflow: "hidden",
  },
  expandedItem: {
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: appColorTheme.grey_0,
  },
  activeExpandedItem: {
    backgroundColor: appColorTheme.brown_1,
  },
  menuText: {
    marginLeft: 12,
    fontSize: 16,
    fontWeight: "bold",
    color: "black",
  },
  activeMenuText: {
    color: "white",
  },
});
