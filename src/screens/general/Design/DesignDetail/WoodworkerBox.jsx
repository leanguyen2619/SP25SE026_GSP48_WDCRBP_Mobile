import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import PackageFrame from "../../../../components/Utility/PackageFrame";
import StarReview from "../../../../components/Utility/StarReview";
import { appColorTheme, getPackTypeLabel } from "../../../../config/appconfig";
import { useNavigation } from "@react-navigation/native";

export default function WoodworkerBox({ designDetail }) {
  const navigation = useNavigation();

  const navigateToWoodworker = () => {
    navigation.navigate("WoodworkerDetail", {
      id: designDetail?.woodworkerProfile?.woodworkerId,
    });
  };

  return (
    <View style={styles.container}>
      <PackageFrame
        packageType={designDetail?.woodworkerProfile?.servicePack?.name}
      >
        <View style={styles.contentContainer}>
          <View style={styles.imageContainer}>
            <Image
              source={{
                uri:
                  designDetail?.woodworkerProfile?.imgUrl ||
                  "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png",
              }}
              style={styles.image}
            />
          </View>

          <View style={styles.infoContainer}>
            <View style={styles.headerContainer}>
              <Text style={styles.title}>
                {designDetail?.woodworkerProfile?.brandName || "Xưởng mộc"}
              </Text>

              <StarReview
                totalReviews={designDetail?.woodworkerProfile?.totalReviews}
                totalStar={designDetail?.woodworkerProfile?.totalStar}
              />
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.label}>Địa chỉ xưởng:</Text>
              <Text style={styles.value}>
                {designDetail?.woodworkerProfile?.address || "Chưa cập nhật"}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.label}>Loại hình kinh doanh:</Text>
              <Text style={styles.value}>
                {designDetail?.woodworkerProfile?.businessType ||
                  "Chưa cập nhật"}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.label}>Loại xưởng:</Text>
              <Text style={styles.value}>
                {getPackTypeLabel(
                  designDetail?.woodworkerProfile?.servicePack?.name
                ) || "Chưa cập nhật"}
              </Text>
            </View>

            <View style={styles.linkContainer}>
              <TouchableOpacity
                onPress={navigateToWoodworker}
                style={styles.linkButton}
              >
                <Text style={styles.linkText}>Xem xưởng</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </PackageFrame>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
  },
  contentContainer: {
    flexDirection: "column",
    borderRadius: 10,
    padding: 16,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    gap: 16,
  },
  imageContainer: {
    alignItems: "center",
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  infoContainer: {
    flex: 1,
    gap: 10,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  title: {
    fontWeight: "bold",
    fontSize: 18,
  },
  detailRow: {
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
  linkContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 8,
  },
  linkButton: {
    padding: 8,
  },
  linkText: {
    color: appColorTheme.brown_2,
    textDecorationLine: "underline",
  },
});
