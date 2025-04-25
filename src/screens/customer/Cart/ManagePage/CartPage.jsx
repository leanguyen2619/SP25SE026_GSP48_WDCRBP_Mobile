import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Dimensions,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import DesignCartTab from "../Design/DesignCartTab.jsx";
import ProductCartTab from "../Product/ProductCartTab.jsx";
import { appColorTheme } from "../../../../config/appconfig.js";
import useAuth from "../../../../hooks/useAuth.js";
import RootLayout from "../../../../layouts/RootLayout.jsx";

export default function CartPage() {
  const route = useRoute();
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    if (route.params?.tab) {
      const tabParam = route.params.tab;
      if (tabParam === "product") {
        setActiveTab(1);
      } else if (tabParam === "design") {
        setActiveTab(0);
      }
    }
  }, [route.params]);

  const handleTabChange = (index) => {
    setActiveTab(index);
  };

  return (
    <RootLayout>
      <SafeAreaView style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.heading}>Giỏ hàng</Text>
        </View>

        {/* Tab navigation */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 0 && styles.activeTab]}
            onPress={() => handleTabChange(0)}
          >
            <Text
              style={[styles.tabText, activeTab === 0 && styles.activeTabText]}
            >
              Thiết kế
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabButton, activeTab === 1 && styles.activeTab]}
            onPress={() => handleTabChange(1)}
          >
            <Text
              style={[styles.tabText, activeTab === 1 && styles.activeTabText]}
            >
              Sản phẩm
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tab content */}
        <ScrollView
          style={styles.contentContainer}
          contentContainerStyle={styles.scrollContent}
        >
          {activeTab === 0 ? <DesignCartTab /> : <ProductCartTab />}
        </ScrollView>
      </SafeAreaView>
    </RootLayout>
  );
}

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  headerContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    color: appColorTheme.brown_2,
    fontFamily: "Montserrat",
  },
  tabContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
    backgroundColor: "white",
  },
  tabButton: {
    flex: 1,
    paddingVertical: 14,
    alignItems: "center",
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: appColorTheme.brown_2,
  },
  tabText: {
    fontSize: 16,
    color: "#4A5568",
    fontWeight: "500",
  },
  activeTabText: {
    color: appColorTheme.brown_2,
    fontWeight: "bold",
  },
  contentContainer: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
});
