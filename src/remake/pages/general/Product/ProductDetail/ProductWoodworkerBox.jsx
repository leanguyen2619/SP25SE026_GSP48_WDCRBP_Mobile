import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import PackageFrame from "../../../../components/Utility/PackageFrame";
import StarReview from "../../../../components/Utility/StarReview";
import { appColorTheme, getPackTypeLabel } from "../../../../config/appconfig";

// Component to display woodworker information
export default function ProductWoodworkerBox({ product }) {
  const navigation = useNavigation();

  if (!product?.woodworkerId) return null;

  const handleViewWoodworker = () => {
    navigation.navigate("WoodworkerDetail", { id: product?.woodworkerId });
  };

  return (
    <PackageFrame packageType={product?.packType}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Image
            source={{
              uri:
                product?.woodworkerImgUrl ||
                "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png",
            }}
            style={styles.profileImage}
          />

          <View style={styles.infoContainer}>
            <View style={styles.nameRatingRow}>
              <Text style={styles.brandName}>
                {product?.woodworkerName || "Xưởng mộc"}
              </Text>
              <StarReview
                totalStar={product?.woodworkerTotalStar || 0}
                totalReviews={product?.woodworkerTotalReviews || 0}
              />
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.label}>Địa chỉ xưởng:</Text>
              <Text style={styles.value}>
                {product?.address || "Chưa cập nhật"}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.label}>Loại hình kinh doanh:</Text>
              <Text style={styles.value}>
                {product?.businessType || "Chưa cập nhật"}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.label}>Loại xưởng:</Text>
              <Text style={styles.value}>
                {getPackTypeLabel(product?.packType) || "Chưa cập nhật"}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.viewButton}
              onPress={handleViewWoodworker}
            >
              <Text style={styles.viewButtonText}>Xem xưởng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </PackageFrame>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    gap: 16,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  infoContainer: {
    flex: 1,
  },
  nameRatingRow: {
    marginBottom: 8,
  },
  brandName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  infoRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 4,
  },
  label: {
    fontWeight: "bold",
    marginRight: 4,
  },
  value: {
    flex: 1,
  },
  viewButton: {
    alignSelf: "flex-end",
    marginTop: 8,
  },
  viewButtonText: {
    color: appColorTheme.brown_2,
    textDecorationLine: "underline",
  },
});
