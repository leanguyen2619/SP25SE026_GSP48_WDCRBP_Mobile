import React, { useState } from "react";
import { View, Text, StyleSheet, SafeAreaView } from "react-native";
import { appColorTheme } from "../config/appconfig.js";
import CustomerSidebar from "../components/Sidebar/CustomerSidebar.jsx";
import Header from "../components/Header/Header.jsx";
import RequireAuth from "../components/Utility/RequireAuth.jsx";

export default function CustomerLayout({ children }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <RequireAuth allowedRoles={["Customer"]}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <Header />

          <View style={styles.content}>
            {/* Sidebar */}
            <View style={[styles.sidebar, { width: isCollapsed ? 80 : 300 }]}>
              <Text
                style={[
                  styles.sidebarTitle,
                  { textAlign: isCollapsed ? "center" : "center" },
                ]}
              >
                {!isCollapsed ? "Menu khách hàng" : ""}
              </Text>

              <CustomerSidebar
                isCollapsed={isCollapsed}
                setIsCollapsed={setIsCollapsed}
              />
            </View>

            {/* Main Content */}
            <View
              style={[
                styles.mainContent,
                { marginLeft: isCollapsed ? 80 : 300 },
              ]}
            >
              {children}
            </View>
          </View>
        </View>
      </SafeAreaView>
    </RequireAuth>
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
    padding: 20,
  },
});
