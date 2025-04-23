import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { appColorTheme } from "../../../config/appconfig";
import RootLayout from "../../../layouts/RootLayout.jsx";

export default function ErrorPage() {
  const navigation = useNavigation();
  const route = useRoute();
  const error = route.params?.error || {
    message: "Đã xảy ra lỗi không xác định",
  };

  return (
    <RootLayout>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.container}>
          <View style={styles.content}>
            <View style={styles.iconContainer}>
              <Ionicons name="alert-circle" size={50} color="white" />
            </View>

            <Text style={styles.heading}>Oops! Có lỗi xảy ra</Text>

            <View style={styles.errorBox}>
              <Text style={styles.errorMessage}>{error.message}</Text>
            </View>

            <TouchableOpacity
              style={styles.homeButton}
              onPress={() => navigation.navigate("Home")}
            >
              <Ionicons name="home" size={20} color={appColorTheme.brown_2} />
              <Text style={styles.homeButtonText}>Về trang chủ</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </RootLayout>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    padding: 16,
    justifyContent: "center",
  },
  content: {
    alignItems: "center",
    padding: 16,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: appColorTheme.brown_2,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  heading: {
    color: appColorTheme.brown_2,
    fontFamily: "Montserrat",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
    textAlign: "center",
  },
  errorBox: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 12,
    width: "100%",
    maxWidth: 350,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  errorMessage: {
    color: "#4A5568",
    fontFamily: "monospace",
  },
  homeButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  homeButtonText: {
    marginLeft: 8,
    fontWeight: "500",
    fontSize: 16,
    color: appColorTheme.brown_2,
  },
});
