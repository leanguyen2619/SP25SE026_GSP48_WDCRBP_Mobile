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
import { useNavigation } from "@react-navigation/native";
import { appColorTheme } from "../../../config/appconfig";
import useAuth from "../../../hooks/useAuth";
import RootLayout from "../../../layouts/RootLayout.jsx";

const QuickActionCard = ({ icon, title, description, onPress, color }) => {
  // Simplified color mapping for React Native
  const colorMap = {
    blue: "#3182CE", // blue.500
    purple: "#805AD5", // purple.500
    green: "#38A169", // green.500
  };

  const bgColorMap = {
    blue: "#EBF8FF", // blue.50
    purple: "#FAF5FF", // purple.50
    green: "#F0FFF4", // green.50
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.cardContent}>
        <View
          style={[styles.iconContainer, { backgroundColor: bgColorMap[color] }]}
        >
          <Feather name={icon} size={24} color={colorMap[color]} />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.cardTitle}>{title}</Text>
          <Text style={styles.cardDescription}>{description}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default function HomePage() {
  const navigation = useNavigation();
  const { auth } = useAuth();

  const quickActions = [
    {
      icon: "tool",
      title: "Xưởng mộc",
      description: "Khám phá các xưởng mộc chất lượng",
      color: "blue",
      onPress: () => navigation.navigate("Woodworker"),
    },
    {
      icon: "edit-2",
      title: "Ý tưởng thiết kế",
      description: "Danh mục ý tưởng thiết kế đa dạng",
      color: "purple",
      onPress: () => navigation.navigate("Design"),
    },
    {
      icon: "package",
      title: "Sản phẩm",
      description: "Danh mục các sản phẩm chất lượng",
      color: "green",
      onPress: () => navigation.navigate("Product"),
    },
  ];

  return (
    <RootLayout>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.container}>
          {/* Header Section */}
          <View style={styles.header}>
            <View style={styles.headerTextContainer}>
              <Text style={styles.headerTitle}>Xin chào, Quý Khách Hàng</Text>
              <Text style={styles.headerSubtitle}>
                Chào mừng bạn đến với nền tảng kết nối xưởng mộc hàng đầu
              </Text>
            </View>

            <TouchableOpacity
              style={styles.headerButton}
              onPress={() => {
                if (auth?.userId) {
                  navigation.navigate(
                    auth?.role === "Woodworker" ? "WWProfile" : "CusProfile"
                  );
                } else {
                  navigation.navigate("Auth");
                }
              }}
            >
              <Feather
                name={auth?.userId ? "user" : "log-in"}
                size={18}
                color="white"
                style={styles.buttonIcon}
              />
              <Text style={styles.buttonText}>
                {auth?.userId ? "Xem hồ sơ" : "Đăng nhập"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Explore Section */}
          <Text style={styles.sectionTitle}>Khám phá ngay</Text>

          {/* Quick Actions Grid */}
          <View style={styles.grid}>
            {quickActions.map((action, index) => (
              <View style={styles.gridItem} key={index}>
                <QuickActionCard {...action} />
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </RootLayout>
  );
}

const { width } = Dimensions.get("window");
const isTablet = width >= 768;

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: isTablet ? "row" : "column",
    justifyContent: "space-between",
    alignItems: isTablet ? "center" : "flex-start",
    marginBottom: 24,
  },
  headerTextContainer: {
    marginBottom: isTablet ? 0 : 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#718096", // gray.500
  },
  headerButton: {
    backgroundColor: appColorTheme.brown_2,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignSelf: isTablet ? "flex-start" : "stretch",
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
    color: appColorTheme.brown_2,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -8,
  },
  gridItem: {
    width: isTablet ? (width >= 1024 ? "33.33%" : "50%") : "100%",
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0", // gray.200
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cardContent: {
    flexDirection: "column",
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  textContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 13,
    color: "#718096", // gray.500
  },
});
