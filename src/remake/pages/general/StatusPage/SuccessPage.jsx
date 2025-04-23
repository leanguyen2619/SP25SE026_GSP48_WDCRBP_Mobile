import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { appColorTheme } from "../../../config/appconfig";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import RootLayout from "../../../layouts/RootLayout.jsx";

export default function SuccessPage() {
  const navigation = useNavigation();
  const route = useRoute();
  const params = route.params || {};

  const title = params.title || "Thành công";
  const desc = params.desc || "Thao tác của bạn đã được thực hiện thành công";
  const path = params.path;
  const buttonText = params.buttonText || "Tiếp tục";

  return (
    <RootLayout>
      <View style={styles.container}>
        <View style={styles.card}>
          {/* Title Section */}
          <View style={styles.titleSection}>
            <View style={styles.iconContainer}>
              <Ionicons name="checkmark" size={40} color="white" />
            </View>
            <Text style={styles.heading}>{title}</Text>
            <Text style={styles.description}>{desc}</Text>
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.homeButton}
              onPress={() => navigation.navigate("Home")}
            >
              <Ionicons name="home" size={20} color={appColorTheme.brown_2} />
              <Text style={styles.homeButtonText}>Về trang chủ</Text>
            </TouchableOpacity>

            {path && (
              <TouchableOpacity
                style={styles.continueButton}
                onPress={() => {
                  navigation.replace(path);
                }}
              >
                <Text style={styles.continueButtonText}>{buttonText}</Text>
                <Ionicons
                  name="arrow-forward"
                  size={20}
                  color={appColorTheme.brown_2}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </RootLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 24,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignItems: "center",
  },
  titleSection: {
    alignItems: "center",
    marginBottom: 24,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: appColorTheme.brown_2,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  heading: {
    color: appColorTheme.brown_2,
    fontFamily: "Montserrat",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    color: "#4A5568",
    marginBottom: 8,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 12,
  },
  homeButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: appColorTheme.brown_2,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginHorizontal: 6,
  },
  homeButtonText: {
    color: appColorTheme.brown_2,
    marginLeft: 8,
    fontSize: 16,
    fontWeight: "500",
  },
  continueButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: appColorTheme.brown_2,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginHorizontal: 6,
  },
  continueButtonText: {
    color: appColorTheme.brown_2,
    marginRight: 8,
    fontSize: 16,
    fontWeight: "500",
  },
});
