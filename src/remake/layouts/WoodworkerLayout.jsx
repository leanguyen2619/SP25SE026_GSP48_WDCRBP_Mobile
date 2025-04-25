import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { useGetWoodworkerByUserIdQuery } from "../services/woodworkerApi.js";
import { appColorTheme } from "../config/appconfig.js";
import useAuth from "../hooks/useAuth.js";
import WoodworkerSideBar from "../components/Sidebar/WoodworkerSideBar.jsx";
import Header from "../components/Header/Header.jsx";

export default function WoodworkerLayout({ children }) {
  const [isCollapsed, setIsCollapsed] = useState(true);

  const { auth, setAuth } = useAuth();
  const {
    data: response,
    isLoading,
    error,
  } = useGetWoodworkerByUserIdQuery(auth?.userId);

  const woodworker = response?.data;

  useEffect(() => {
    if (woodworker?.woodworkerId) {
      setAuth((prev) => ({
        ...prev,
        wwId: woodworker.woodworkerId,
        woodworker: woodworker,
      }));
    }
  }, [woodworker, setAuth]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={appColorTheme.green_2} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: {error.message}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Header />

        <View style={styles.content}>
          {/* Sidebar */}
          {!isCollapsed ? (
            <View style={[styles.sidebar, { width: 300 }]}>
              <Text style={styles.sidebarTitle}>Menu xưởng mộc</Text>
              <WoodworkerSideBar
                isCollapsed={isCollapsed}
                setIsCollapsed={setIsCollapsed}
              />
            </View>
          ) : (
            <WoodworkerSideBar
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

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Xưởng mộc {auth?.woodworker?.brandName || woodworker?.brandName}
          </Text>
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
    paddingBottom: 50,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "red",
    fontSize: 16,
  },
  content: {
    flex: 1,
    flexDirection: "row",
  },
  sidebar: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 50,
    backgroundColor: "white",
    paddingHorizontal: 20,
    zIndex: 10,
  },
  sidebarTitle: {
    color: appColorTheme.green_3,
    marginTop: 8,
    marginBottom: 8,
    fontWeight: "bold",
    borderBottomWidth: 2,
    borderBottomColor: appColorTheme.green_2,
    paddingBottom: 8,
  },
  mainContent: {
    flex: 1,
    backgroundColor: appColorTheme.grey_1,
    minHeight: "100%",
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 50,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: appColorTheme.green_1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 10,
  },
  footerText: {
    fontSize: 18,
    fontWeight: "bold",
    color: appColorTheme.green_3,
  },
});
