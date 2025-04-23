import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import useAuth from "../../../hooks/useAuth";
import { appColorTheme } from "../../../config/appconfig";
import WoodworkerLayout from "../../../layouts/WoodworkerLayout";
import PublicProfileSwitch from "../../../components/Header/PublicProfileSwitch";

const QuickActionCard = ({ icon, title, description, onPress, color }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.cardContent}>
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: getLightColor(color) },
          ]}
        >
          <FontAwesome5 name={icon} size={24} color={getColor(color)} />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.cardTitle}>{title}</Text>
          <Text style={styles.cardDescription}>{description}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

// Helper functions for colors
const getColor = (colorName) => {
  const colors = {
    blue: "#3182CE",
    purple: "#805AD5",
    green: "#38A169",
    orange: "#DD6B20",
    red: "#E53E3E",
    pink: "#D53F8C",
    cyan: "#00B5D8",
    teal: "#319795",
  };
  return colors[colorName] || "#4A5568";
};

const getLightColor = (colorName) => {
  const colors = {
    blue: "#EBF8FF",
    purple: "#FAF5FF",
    green: "#F0FFF4",
    orange: "#FFFAF0",
    red: "#FFF5F5",
    pink: "#FFF5F7",
    cyan: "#E6FFFA",
    teal: "#E6FFFA",
  };
  return colors[colorName] || "#F7FAFC";
};

const WoodworkerWelcomePage = () => {
  const navigation = useNavigation();
  const { auth } = useAuth();
  const packType =
    auth?.woodworker?.servicePackEndDate &&
    Date.now() <= new Date(auth?.woodworker?.servicePackEndDate).getTime()
      ? auth?.woodworker?.servicePack?.name
      : null;

  const quickActions = [
    {
      icon: "file-alt",
      title: "Thêm bài đăng mới",
      description: "Đăng tải bài đăng mới của bạn",
      color: "blue",
      onPress: () => navigation.navigate("PostManagement"),
    },
    {
      icon: "cogs",
      title: "Cài đặt xưởng",
      description: "Cập nhật thông tin xưởng của bạn",
      color: "purple",
      onPress: () => navigation.navigate("WoodworkerProfile"),
    },
    {
      icon: "dollar-sign",
      title: "Quản lý gói dịch vụ",
      description: "Xem và nâng cấp gói dịch vụ",
      color: "green",
      onPress: () => navigation.navigate("WoodworkerProfile"),
    },
    {
      icon: "user",
      title: "Quản lý đơn hàng",
      description: "Xem và xử lý đơn hàng",
      color: "orange",
      onPress: () => navigation.navigate("WWServiceOrders"),
    },
    {
      icon: "star",
      title: "Xem đánh giá",
      description: "Xem đánh giá của khách hàng",
      color: "red",
      onPress: () => navigation.navigate("ReviewManagement"),
    },
    {
      icon: "drafting-compass",
      title: "Thêm thiết kế",
      description: "Thêm thiết kế mới",
      color: "pink",
      onPress: () => navigation.navigate("DesignManagement"),
    },
    {
      icon: "credit-card",
      title: "Xem ví",
      description: "Xem ví của bạn",
      color: "cyan",
      onPress: () => navigation.navigate("WWWallet"),
    },
    {
      icon: "tools",
      title: "Xem dịch vụ",
      description: "Xem dịch vụ của bạn",
      color: "teal",
      onPress: () => navigation.navigate("ServiceConfig"),
    },
  ];

  const renderItem = ({ item }) => (
    <QuickActionCard
      icon={item.icon}
      title={item.title}
      description={item.description}
      color={item.color}
      onPress={item.onPress}
    />
  );

  return (
    <WoodworkerLayout>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>
              Xin chào, {auth?.woodworker?.brandName || "Xưởng mộc"}
            </Text>
          </View>

          {packType && (
            <>
              <View style={styles.switchContainer}>
                <PublicProfileSwitch />
              </View>

              <TouchableOpacity
                style={styles.viewProfileButton}
                onPress={() =>
                  navigation.navigate("WoodworkerDetail", {
                    id: auth?.wwId,
                  })
                }
              >
                <FontAwesome5
                  name="home"
                  size={16}
                  color="white"
                  style={styles.buttonIcon}
                />
                <Text style={styles.buttonText}>Xem xưởng của bạn</Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        {packType ? (
          <>
            <Text style={styles.sectionTitle}>Thao tác nhanh</Text>
            <FlatList
              data={quickActions}
              renderItem={renderItem}
              keyExtractor={(item, index) => index.toString()}
              numColumns={2}
              columnWrapperStyle={styles.gridRow}
              scrollEnabled={false}
            />
          </>
        ) : (
          <>
            <Text style={styles.sectionTitle}>Mua gói dịch vụ</Text>
            <QuickActionCard
              icon="dollar-sign"
              title="Quản lý gói dịch vụ"
              description="Xem và nâng cấp gói dịch vụ"
              color="green"
              onPress={() => navigation.navigate("WoodworkerProfile")}
            />
          </>
        )}
      </ScrollView>
    </WoodworkerLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appColorTheme.grey_1,
    padding: 16,
  },
  header: {
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
    flexWrap: "wrap",
  },
  headerTextContainer: {
    flexDirection: "column",
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: appColorTheme.green_3,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "gray",
  },
  viewProfileButton: {
    backgroundColor: appColorTheme.brown_2,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  buttonIcon: {
    marginRight: 6,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    color: appColorTheme.green_3,
  },
  gridRow: {
    justifyContent: "space-between",
    marginBottom: 16,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    width: "48%",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardContent: {
    alignItems: "flex-start",
  },
  iconContainer: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  textContainer: {
    width: "100%",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 12,
    color: "gray",
  },
  switchContainer: {
    width: "100%",
    marginTop: 12,
    backgroundColor: "white",
    borderRadius: 8,
    padding: 4,
  },
});

export default WoodworkerWelcomePage;
