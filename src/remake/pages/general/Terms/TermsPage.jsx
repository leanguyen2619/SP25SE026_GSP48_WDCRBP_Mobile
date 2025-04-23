import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useGetConfigurationByDescriptionMutation } from "../../../services/configurationApi";
import { appColorTheme } from "../../../config/appconfig";
import RootLayout from "../../../layouts/RootLayout.jsx";

export default function TermsPage() {
  const [platformTerms, setPlatformTerms] = useState("");
  const [getConfigurationByDescription, { isLoading }] =
    useGetConfigurationByDescriptionMutation();
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlatformTerms = async () => {
      try {
        const response = await getConfigurationByDescription({
          description: "SampleContract",
          value: "string",
        }).unwrap();

        if (response.data?.[0]?.value) {
          setPlatformTerms(response.data[0].value);
        } else {
          setError("Không tìm thấy điều khoản nền tảng");
        }
      } catch (error) {
        console.error("Error fetching platform terms:", error);
        setError("Không thể lấy điều khoản từ hệ thống");
      }
    };

    fetchPlatformTerms();
  }, [getConfigurationByDescription]);

  if (isLoading) {
    return (
      <RootLayout>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={appColorTheme.brown_2} />
        </View>
      </RootLayout>
    );
  }

  if (error) {
    return (
      <RootLayout>
        <View style={styles.container}>
          <View style={styles.errorAlert}>
            <Ionicons
              name="alert-circle"
              size={24}
              color="#E53E3E"
              style={styles.alertIcon}
            />
            <View style={styles.alertContent}>
              <Text style={styles.alertTitle}>Lỗi!</Text>
              <Text style={styles.alertDescription}>{error}</Text>
            </View>
          </View>
        </View>
      </RootLayout>
    );
  }

  return (
    <RootLayout>
      <ScrollView style={styles.container}>
        <Text style={styles.heading}>Điều Khoản Nền Tảng</Text>

        <View style={styles.termsBox}>
          {platformTerms ? (
            <Text style={styles.termsContent}>{platformTerms}</Text>
          ) : (
            <Text style={styles.emptyText}>
              Không có điều khoản nào được cung cấp.
            </Text>
          )}
        </View>
      </ScrollView>
    </RootLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  heading: {
    color: appColorTheme.brown_2,
    fontSize: 22,
    fontFamily: "Montserrat",
    fontWeight: "bold",
    marginBottom: 16,
  },
  termsBox: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 20,
  },
  termsContent: {
    fontSize: 14,
    lineHeight: 20,
  },
  emptyText: {
    color: "#718096",
    fontStyle: "italic",
  },
  errorAlert: {
    flexDirection: "row",
    backgroundColor: "#FED7D7",
    borderRadius: 8,
    padding: 12,
    marginVertical: 16,
    alignItems: "flex-start",
  },
  alertIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  alertContent: {
    flex: 1,
  },
  alertTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 4,
    color: "#E53E3E",
  },
  alertDescription: {
    fontSize: 14,
    color: "#2D3748",
  },
});
