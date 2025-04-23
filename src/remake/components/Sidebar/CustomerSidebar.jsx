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
    { label: "Trang chủ", path: "/", icon: "home" },
    { label: "Đơn hàng", path: "service-order", icon: "shopping-cart" },
    { label: "BH & Sữa chữa", path: "guarantee-order", icon: "settings" },
    { label: "Ví", path: "wallet", icon: "credit-card" },
    { label: "Khiếu nại", path: "complaint", icon: "alert-triangle" },
    { label: "Hồ sơ", path: "profile", icon: "user" },
  ];

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.toggleButton, { backgroundColor: "black" }]}
        onPress={() => setIsCollapsed(!isCollapsed)}
      >
        <Feather
          name={isCollapsed ? "chevron-right" : "chevron-left"}
          size={24}
          color="white"
        />
      </TouchableOpacity>

      <ScrollView style={styles.scrollView}>
        {navItems.map((item, index) => {
          const isActive = isPathActive(item.path);

          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.menuItem,
                isCollapsed ? styles.collapsedItem : styles.expandedItem,
                isActive &&
                  (isCollapsed
                    ? styles.activeCollapsedItem
                    : styles.activeExpandedItem),
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

              {!isCollapsed && (
                <Text
                  style={[styles.menuText, isActive && styles.activeMenuText]}
                >
                  {item.label}
                </Text>
              )}
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
  menuItem: {
    marginBottom: 8,
    borderRadius: 10,
    overflow: "hidden",
  },
  collapsedItem: {
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  expandedItem: {
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: appColorTheme.grey_0,
  },
  activeCollapsedItem: {
    backgroundColor: appColorTheme.brown_1,
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
