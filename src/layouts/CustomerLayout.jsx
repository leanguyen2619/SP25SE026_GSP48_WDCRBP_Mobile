import React, { useState } from "react";
import { View, Text, StyleSheet, SafeAreaView, Dimensions } from "react-native";
import { appColorTheme } from "../config/appconfig.js";
import CustomerSidebar from "../components/Sidebar/CustomerSidebar.jsx";
import Header from "../components/Header/Header.jsx";

export default function CustomerLayout({ children }) {
  const [isCollapsed, setIsCollapsed] = useState(true);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Header />

        <View style={styles.content}>
          {/* Sidebar */}
          {!isCollapsed ? (
            <View style={[styles.sidebar, { width: 300 }]}>
              <Text style={styles.sidebarTitle}>Menu khách hàng</Text>
              <CustomerSidebar
                isCollapsed={isCollapsed}
                setIsCollapsed={setIsCollapsed}
              />
            </View>
          ) : (
            <CustomerSidebar
              isCollapsed={isCollapsed}
              setIsCollapsed={setIsCollapsed}
            />
          )}

          {/* Main Content - Only show when sidebar is collapsed or on desktop */}
          {isCollapsed && (
            <View
              style={[
                styles.mainContent,
                { marginLeft: isCollapsed ? 0 : 300 },
              ]}
            >
              {children}
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: appColorTheme.grey_1,
    position: "relative",
  },
  content: {
    flex: 1,
    flexDirection: "row",
  },
  sidebar: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    backgroundColor: "white",
    paddingHorizontal: 20,
    zIndex: 10,
  },
  sidebarTitle: {
    color: appColorTheme.brown_2,
    marginTop: 8,
    marginBottom: 8,
    fontWeight: "bold",
    borderBottomWidth: 2,
    borderBottomColor: appColorTheme.brown_1,
    paddingBottom: 8,
  },
  mainContent: {
    flex: 1,
    backgroundColor: appColorTheme.grey_1,
    minHeight: "100%",
  },
});
