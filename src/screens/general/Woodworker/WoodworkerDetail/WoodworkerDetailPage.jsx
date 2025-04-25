import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import RootLayout from "../../../../layouts/RootLayout";
import ReviewSection from "./Tab/ReviewTab/ReviewSection";
import StarReview from "../../../../components/Utility/StarReview";
import WoodworkerProductTab from "./Tab/ProductTab/WoodworkerProductTab";
import WoodworkerDesignsTab from "./Tab/DesignTab/WoodworkerDesignsTab";
import AvailableService from "./Tab/ServiceTab/AvailableService";
import PostTab from "./Tab/PostTab/PostTab";
import PackageFrame from "../../../../components/Utility/PackageFrame";
import { useGetWoodworkerByIdQuery } from "../../../../services/woodworkerApi";
import { appColorTheme, getPackTypeLabel } from "../../../../config/appconfig";
import useAuth from "../../../../hooks/useAuth";

export default function WoodworkerDetailPage() {
  const route = useRoute();
  const navigation = useNavigation();
  const { id } = route.params || {};
  const { auth } = useAuth();

  const [tabIndex, setTabIndex] = useState(0);
  const { data: response, isLoading, error } = useGetWoodworkerByIdQuery(id);

  const changeTab = (index) => {
    setTabIndex(index);
  };

  const handleServiceAction = (serviceType, path, action, newTabIndex) => {
    if (action === "navigate") {
      navigation.navigate(path, { id });
    } else if (action === "changeTab" && newTabIndex !== undefined) {
      changeTab(newTabIndex);
    }
  };

  if (isLoading) {
    return (
      <RootLayout>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={appColorTheme.brown_2} />
        </View>
      </RootLayout>
    );
  }

  if (error) {
    return (
      <RootLayout>
        <View style={styles.centerContainer}>
          <Text>Đã có lỗi xảy ra khi tải dữ liệu</Text>
        </View>
      </RootLayout>
    );
  }

  const woodworker = response?.data;

  if (!woodworker) {
    return (
      <RootLayout>
        <View style={styles.centerContainer}>
          <Text>Không tìm thấy thông tin xưởng mộc</Text>
        </View>
      </RootLayout>
    );
  }

  const isPublic = woodworker?.publicStatus;
  const isOwner = woodworker?.user?.userId == auth?.userId;

  if (!isPublic && !isOwner) {
    return (
      <RootLayout>
        <View style={styles.centerContainer}>
          <Text>Xưởng mộc hiện đang ẩn trạng thái hiển thị</Text>
        </View>
      </RootLayout>
    );
  }

  const tabs = [
    { label: "Trang cá nhân", icon: "person" },
    { label: "Dịch vụ", icon: "construct" },
    { label: "Thiết kế", icon: "brush" },
    { label: "Sản phẩm", icon: "cube" },
    { label: "Đánh giá", icon: "star" },
  ];

  const renderTabContent = () => {
    switch (tabIndex) {
      case 0:
        return <PostTab woodworkerId={woodworker.woodworkerId} />;
      case 1:
        return (
          <AvailableService
            woodworker={woodworker}
            woodworkerId={woodworker.woodworkerId}
            onServiceAction={handleServiceAction}
          />
        );
      case 2:
        return <WoodworkerDesignsTab woodworkerId={woodworker.woodworkerId} />;
      case 3:
        return <WoodworkerProductTab woodworkerId={woodworker.woodworkerId} />;
      case 4:
        return <ReviewSection woodworkerId={woodworker.woodworkerId} />;
      default:
        return null;
    }
  };

  return (
    <RootLayout>
      <ScrollView style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>Chi tiết xưởng mộc</Text>
        </View>

        <PackageFrame packageType={woodworker.servicePack?.name}>
          <View style={styles.detailCard}>
            <Image
              source={{ uri: woodworker.imgUrl }}
              style={styles.woodworkerImage}
              resizeMode="cover"
            />

            <View style={styles.infoContainer}>
              <View style={styles.headerRow}>
                <Text style={styles.brandName}>{woodworker.brandName}</Text>
                <StarReview
                  totalStar={woodworker.totalStar}
                  totalReviews={woodworker.totalReviews}
                />
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.location}>
                  {woodworker.address || "Chưa cập nhật"}
                </Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Loại hình kinh doanh:</Text>
                <Text style={styles.infoValue}>
                  {woodworker.businessType || "Chưa cập nhật"}
                </Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Loại xưởng:</Text>
                <Text style={styles.infoValue}>
                  {getPackTypeLabel(woodworker?.servicePack?.name) ||
                    "Chưa cập nhật"}
                </Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Số điện thoại:</Text>
                <Text style={styles.infoValue}>
                  {woodworker.user?.phone || "Chưa cập nhật"}
                </Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Email:</Text>
                <Text style={styles.infoValue}>
                  {woodworker.user?.email || "Chưa cập nhật"}
                </Text>
              </View>

              <View style={styles.bioContainer}>
                <Text style={styles.infoLabel}>Giới thiệu:</Text>
                <Text style={styles.bioText}>
                  {woodworker.bio || "Chưa cập nhật"}
                </Text>
              </View>
            </View>
          </View>
        </PackageFrame>

        <View style={styles.tabContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.tabScrollView}
          >
            {tabs.map((tab, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.tabButton,
                  tabIndex === index && styles.activeTabButton,
                ]}
                onPress={() => setTabIndex(index)}
              >
                <Ionicons
                  name={tab.icon}
                  size={16}
                  color={tabIndex === index ? appColorTheme.brown_2 : "#4A5568"}
                />
                <Text
                  style={[
                    styles.tabLabel,
                    tabIndex === index && styles.activeTabLabel,
                  ]}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={styles.tabContent}>{renderTabContent()}</View>
        </View>
      </ScrollView>
    </RootLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  headerContainer: {
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: appColorTheme.brown_2,
    fontFamily: "Montserrat",
  },
  detailCard: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  woodworkerImage: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginBottom: 16,
  },
  infoContainer: {
    gap: 8,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  brandName: {
    fontSize: 20,
    fontWeight: "bold",
  },
  infoRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 4,
  },
  location: {
    color: "#718096",
    fontSize: 14,
  },
  infoLabel: {
    fontWeight: "bold",
    marginRight: 4,
    fontSize: 14,
  },
  infoValue: {
    fontSize: 14,
  },
  bioContainer: {
    marginTop: 8,
  },
  bioText: {
    marginTop: 4,
  },
  tabContainer: {
    marginTop: 16,
  },
  tabScrollView: {
    marginBottom: 8,
  },
  tabButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderBottomWidth: 2,
    borderBottomColor: "#E2E8F0",
    marginRight: 8,
  },
  activeTabButton: {
    backgroundColor: appColorTheme.brown_0,
    borderBottomColor: appColorTheme.brown_1,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  tabLabel: {
    marginLeft: 4,
    fontSize: 14,
    color: "#4A5568",
  },
  activeTabLabel: {
    color: appColorTheme.brown_2,
    fontWeight: "bold",
  },
  tabContent: {
    paddingTop: 16,
  },
});
