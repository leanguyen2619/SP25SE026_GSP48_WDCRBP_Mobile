import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import PackageFrame from "../../../components/Utility/PackageFrame";
import StarReview from "../../../components/Utility/StarReview";
import { appColorTheme, getPackTypeLabel } from "../../../config/appconfig";

export default function WoodworkerBox({ woodworkerProfile, mt = 20 }) {
  const navigation = useNavigation();

  if (!woodworkerProfile) {
    return null;
  }

  const handleViewWorkshop = () => {
    if (woodworkerProfile?.woodworkerId) {
      navigation.navigate("WoodworkerDetail", {
        id: woodworkerProfile.woodworkerId,
      });
    }
  };

  return (
    <View style={[styles.container, { marginTop: mt }]}>
      <PackageFrame packageType={woodworkerProfile?.servicePack?.name}>
        <View style={styles.content}>
          {woodworkerProfile?.imgUrl && (
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: woodworkerProfile.imgUrl }}
                style={styles.image}
              />
            </View>
          )}

          <View style={styles.infoContainer}>
            <View style={styles.header}>
              <Text style={styles.brandName}>
                {woodworkerProfile?.brandName || "Xưởng mộc"}
              </Text>

              <StarReview
                totalReviews={woodworkerProfile?.totalReviews}
                totalStar={woodworkerProfile?.totalStar}
              />
            </View>

            <Text style={styles.infoText}>
              <Text style={styles.bold}>Địa chỉ xưởng:</Text>{" "}
              {woodworkerProfile?.address || "Chưa cập nhật"}
            </Text>

            {woodworkerProfile?.businessType && (
              <Text style={styles.infoText}>
                <Text style={styles.bold}>Loại hình kinh doanh:</Text>{" "}
                {woodworkerProfile?.businessType || "Chưa cập nhật"}
              </Text>
            )}

            {woodworkerProfile?.servicePack?.name && (
              <View style={styles.row}>
                <Text style={styles.bold}>Loại xưởng:</Text>
                <Text style={styles.infoText}>
                  {getPackTypeLabel(woodworkerProfile?.servicePack?.name) ||
                    "Chưa cập nhật"}
                </Text>
              </View>
            )}

            <View style={styles.linkContainer}>
              <TouchableOpacity onPress={handleViewWorkshop}>
                <Text style={styles.link}>Xem xưởng</Text>
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
    marginTop: 20,
  },
  content: {
    flexDirection: "row",
    borderRadius: 10,
    padding: 15,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    gap: 15,
  },
  imageContainer: {
    marginRight: 10,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  infoContainer: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  brandName: {
    fontWeight: "bold",
    fontSize: 18,
  },
  infoText: {
    marginBottom: 5,
  },
  bold: {
    fontWeight: "bold",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  linkContainer: {
    alignItems: "flex-end",
    marginTop: 10,
  },
  link: {
    color: appColorTheme.brown_2,
    textDecorationLine: "underline",
  },
});
