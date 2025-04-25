import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { appColorTheme } from "../../../config/appconfig";
import { useGetAllServicePacksQuery } from "../../../services/servicePackApi";

const baseFeatures = [
  "Quản lý dịch vụ cung cấp (Tùy chỉnh, sửa chữa)",
  "Quản lý tương thiết kế",
  "Quản lý đơn hàng dịch vụ",
  "Trang cá nhân (Profile) (Giới thiệu, thông tin, hình ảnh)",
];

const periodLabels = {
  1: "Hàng tháng",
  3: "Hàng quý",
  12: "Hàng năm",
};

export default function Pricing({
  handleButtonClick,
  label = "Đăng ký trở thành xưởng mộc",
  servicePackId,
  packName,
}) {
  const navigation = useNavigation();
  const [selectedPeriod, setSelectedPeriod] = useState(1);
  const { data: servicePacksResponse, isLoading } =
    useGetAllServicePacksQuery();

  const plans = useMemo(() => {
    if (!servicePacksResponse?.data) return [];

    const packsByName = {
      Bronze: { name: "Gói Đồng" },
      Silver: { name: "Gói Bạc" },
      Gold: { name: "Gói Vàng" },
    };

    // Nhóm các gói theo tên
    const groupedPacks = servicePacksResponse.data.reduce((acc, pack) => {
      if (!acc[pack.name]) {
        acc[pack.name] = {
          ...packsByName[pack.name],
          prices: {},
          features: [
            ...baseFeatures,
            `${pack.postLimitPerMonth} bài đăng trên trang cá nhân/tháng`,
            pack.productManagement
              ? "Quản lý sản phẩm & bán sản phẩm có sẵn"
              : "Quản lý sản phẩm & bán sản phẩm có sẵn",
            pack.searchResultPriority === 100
              ? "Ưu tiên cao nhất trong kết quả tìm kiếm"
              : pack.searchResultPriority > 1
              ? "Ưu tiên hiển thị trong kết quả tìm kiếm"
              : "Ưu tiên hiển thị trong kết quả tìm kiếm",
            pack.personalization
              ? "Chức năng cung cấp dịch vụ cá nhân hóa"
              : "Chức năng cung cấp dịch vụ cá nhân hóa",
          ].filter(Boolean),
          unavailableFeatures: [
            !pack.productManagement && 5,
            pack.searchResultPriority === 1 && 6,
            !pack.personalization && 7,
          ].filter(Boolean),
        };
      }
      acc[pack.name].prices[pack.duration] = {
        price: pack.price,
        servicePackId: pack.servicePackId,
        name: pack.name,
      };
      return acc;
    }, {});

    // Chuyển đổi object thành array và sắp xếp theo thứ tự Bronze, Silver, Gold
    return ["Bronze", "Silver", "Gold"].map((name) => groupedPacks[name]);
  }, [servicePacksResponse]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={appColorTheme.brown_2} />
      </View>
    );
  }

  const renderPlanItem = ({ item: plan, index }) => (
    <View style={styles.planCard}>
      <View style={styles.planContent}>
        <View style={styles.planHeader}>
          <Text style={styles.planTitle}>{plan.name}</Text>
          {servicePackId == plan.prices[selectedPeriod]?.servicePackId && (
            <Text style={styles.purchasedLabel}>(Đã mua trước đó)</Text>
          )}
        </View>

        <View style={styles.priceContainer}>
          <Text style={styles.priceText}>
            {plan.prices[selectedPeriod]?.price?.toLocaleString()}
          </Text>
          <Text style={styles.periodText}>
            đồng/
            {selectedPeriod === 12
              ? "năm"
              : selectedPeriod === 3
              ? "quý"
              : "tháng"}
          </Text>
        </View>

        <TouchableOpacity
          style={[
            styles.actionButton,
            (() => {
              // Logic to determine if button should be disabled
              if (!packName) return false; // No current package, enable all buttons

              const currentPackRank = {
                Bronze: 1,
                Silver: 2,
                Gold: 3,
              };

              const currentRank = currentPackRank[packName] || 0;
              const optionRank =
                currentPackRank[plan.prices[selectedPeriod]?.name] || 0;

              // Disable if this would be a downgrade
              return optionRank < currentRank ? styles.disabledButton : null;
            })(),
          ]}
          disabled={(() => {
            if (!packName) return false;

            const currentPackRank = {
              Bronze: 1,
              Silver: 2,
              Gold: 3,
            };

            const currentRank = currentPackRank[packName] || 0;
            const optionRank =
              currentPackRank[plan.prices[selectedPeriod]?.name] || 0;

            return optionRank < currentRank;
          })()}
          onPress={() => {
            handleButtonClick
              ? handleButtonClick(plan.prices[selectedPeriod])
              : navigation.navigate("WWRegister");
          }}
        >
          <Text style={styles.buttonText}>
            {packName == plan.prices[selectedPeriod]?.name
              ? "Gia hạn thêm"
              : label}
          </Text>
        </TouchableOpacity>

        <View style={styles.featuresContainer}>
          {plan.features.map((feature, featureIndex) => (
            <View key={featureIndex} style={styles.featureRow}>
              {plan.unavailableFeatures?.includes(featureIndex) ? (
                <Ionicons
                  name="close-circle"
                  size={20}
                  color="red"
                  style={styles.featureIcon}
                />
              ) : (
                <Ionicons
                  name="checkmark-circle"
                  size={20}
                  color={appColorTheme.brown_1}
                  style={styles.featureIcon}
                />
              )}
              <Text
                style={[
                  styles.featureText,
                  plan.unavailableFeatures?.includes(featureIndex) &&
                    styles.unavailableText,
                ]}
              >
                {feature}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      {/* Title Section */}
      <View style={styles.titleSection}>
        <Text style={styles.mainTitle}>Các gói dịch vụ dành cho xưởng mộc</Text>
        <Text style={styles.subtitle}>
          Tham gia cùng hàng nghìn Xưởng mộc dịch vụ khác
        </Text>
      </View>

      {/* Period Selection */}
      <View style={styles.periodSelection}>
        {Object.entries(periodLabels).map(([duration, label]) => (
          <TouchableOpacity
            key={duration}
            style={[
              styles.periodButton,
              selectedPeriod === Number(duration) && styles.selectedPeriod,
            ]}
            onPress={() => setSelectedPeriod(Number(duration))}
          >
            <Text
              style={[
                styles.periodButtonText,
                selectedPeriod === Number(duration) &&
                  styles.selectedPeriodText,
              ]}
            >
              {label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Plans */}
      <FlatList
        data={plans}
        renderItem={renderPlanItem}
        keyExtractor={(item, index) => `plan-${index}`}
        scrollEnabled={false}
        contentContainerStyle={styles.plansContainer}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: 400,
  },
  titleSection: {
    alignItems: "center",
    marginBottom: 24,
  },
  mainTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: appColorTheme.brown_2,
    fontFamily: "Montserrat",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: appColorTheme.brown_1,
    textAlign: "center",
  },
  periodSelection: {
    flexDirection: "row",
    backgroundColor: appColorTheme.grey_1,
    borderRadius: 25,
    padding: 4,
    marginHorizontal: 20,
    marginBottom: 24,
  },
  periodButton: {
    flex: 1,
    padding: 10,
    alignItems: "center",
    borderRadius: 25,
  },
  selectedPeriod: {
    backgroundColor: "white",
  },
  periodButtonText: {
    color: appColorTheme.brown_1,
  },
  selectedPeriodText: {
    color: appColorTheme.black_0,
    fontWeight: "bold",
  },
  plansContainer: {
    paddingBottom: 40,
  },
  planCard: {
    backgroundColor: "white",
    marginHorizontal: 16,
    marginBottom: 24,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  planContent: {
    padding: 16,
  },
  planHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  planTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginRight: 8,
  },
  purchasedLabel: {
    fontSize: 14,
    color: "#718096",
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: 16,
  },
  priceText: {
    fontSize: 28,
    fontWeight: "bold",
    color: appColorTheme.brown_2,
  },
  periodText: {
    fontSize: 16,
    color: appColorTheme.brown_1,
    marginLeft: 4,
  },
  actionButton: {
    backgroundColor: appColorTheme.brown_0,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 16,
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "black",
  },
  featuresContainer: {
    marginTop: 8,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  featureIcon: {
    marginRight: 8,
  },
  featureText: {
    flex: 1,
    fontSize: 14,
  },
  unavailableText: {
    color: "red",
  },
});
