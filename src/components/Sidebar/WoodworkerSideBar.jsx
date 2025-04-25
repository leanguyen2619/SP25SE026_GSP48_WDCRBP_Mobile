import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import {
  appColorTheme,
  servicePackNameConstants,
} from "../../config/appconfig.js";
import useAuth from "../../hooks/useAuth.js";
import { useNavigation, useRoute } from "@react-navigation/native";

export default function WoodworkerSideBar({ isCollapsed, setIsCollapsed }) {
  const { auth } = useAuth();
  const navigation = useNavigation();
  const route = useRoute();

  const packType =
    auth?.woodworker?.servicePackEndDate &&
    Date.now() <= new Date(auth?.woodworker?.servicePackEndDate).getTime()
      ? auth?.woodworker?.servicePack?.name
      : null;

  const navItems = [
    {
      label: "Đơn hàng",
      path: "WWServiceOrders",
      icon: "shopping-cart",
      needPack: true,
    },
    {
      label: "BH & Sữa chữa",
      path: "WWGuaranteeOrders",
      icon: "settings",
      needPack: true,
    },
    { label: "Dịch vụ", path: "ServiceConfig", icon: "tool", needPack: true },
    {
      label: "Thiết kế",
      path: "DesignManagement",
      icon: "edit-2",
      needPack: true,
    },
    {
      label: "Sản phẩm",
      path: "ProductManagement",
      icon: "box",
      needPack: true,
    },
    {
      label: "Bài đăng",
      path: "PostManagement",
      icon: "file-text",
      needPack: true,
    },
    {
      label: "Khiếu nại",
      path: "WWComplaintManagement",
      icon: "alert-triangle",
      needPack: true,
    },
    {
      label: "Đánh giá",
      path: "ReviewManagement",
      icon: "star",
      needPack: true,
    },
    { label: "Ví", path: "WWWallet", icon: "credit-card" },
    { label: "Hồ sơ", path: "WoodworkerProfile", icon: "user" },
  ];

  const isPathActive = (path) => {
    return route.name.toLowerCase().includes(path.toLowerCase());
  };

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
        style={[
          styles.toggleButton,
          { backgroundColor: appColorTheme.green_3 },
        ]}
        onPress={() => setIsCollapsed(true)}
      >
        <Feather name="chevron-left" size={24} color="white" />
      </TouchableOpacity>

      <ScrollView style={styles.scrollView}>
        {navItems.map((item, index) => {
          if (
            packType === servicePackNameConstants.BRONZE &&
            item.path === "product"
          ) {
            return null;
          }

          if (!packType && item.needPack) {
            return null;
          }

          const isActive = isPathActive(item.path);

          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.menuItem,
                styles.expandedItem,
                isActive && styles.activeExpandedItem,
              ]}
              onPress={() => {
                navigation.navigate(item.path);
              }}
            >
              <Feather
                name={item.icon}
                size={22}
                color={isActive ? "white" : appColorTheme.green_3}
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

const { width } = Dimensions.get("window");

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
    top: "50%",
    left: 0,
    width: 35,
    height: 35,
    borderRadius: 20,
    backgroundColor: appColorTheme.green_3,
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
    backgroundColor: "rgba(154, 230, 180, 0.2)",
  },
  activeExpandedItem: {
    backgroundColor: appColorTheme.green_3,
  },
  menuText: {
    marginLeft: 12,
    fontSize: 16,
    fontWeight: "bold",
    color: "gray",
  },
  activeMenuText: {
    color: "white",
  },
});
