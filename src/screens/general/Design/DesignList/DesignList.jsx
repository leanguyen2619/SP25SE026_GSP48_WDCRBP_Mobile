import React from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Pagination from "../../../../components/Utility/Pagination.jsx";
import PackageFrame from "../../../../components/Utility/PackageFrame.jsx";
import StarReview from "../../../../components/Utility/StarReview.jsx";
import { appColorTheme } from "../../../../config/appconfig";
import { Ionicons } from "@expo/vector-icons";

export default function DesignList({ designs = [] }) {
  const navigation = useNavigation();

  if (!designs.length) {
    return (
      <View style={styles.centerContainer}>
        <Text>Đang tải danh sách thiết kế</Text>
      </View>
    );
  }

  const renderDesignItem = ({ item }) => (
    <TouchableOpacity
      style={styles.designItem}
      onPress={() =>
        navigation.navigate("DesignDetail", { id: item.designIdeaId })
      }
    >
      <PackageFrame packageType={item.woodworkerProfile?.servicePack?.name}>
        <View style={styles.designCard}>
          <View style={styles.imageContainer}>
            <Image
              source={{
                uri: item.img_urls ? item.img_urls.split(";")[0] : "",
              }}
              style={styles.designImage}
              resizeMode="cover"
            />

            {/* Display number of images badge */}
            {item.img_urls && item.img_urls.includes(";") && (
              <View style={styles.imageCountBadge}>
                <Ionicons
                  name="images"
                  size={14}
                  color="white"
                  style={styles.imageIcon}
                />
                <Text style={styles.imageCountText}>
                  {item.img_urls.split(";").length}
                </Text>
              </View>
            )}

            {item.category && (
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryText}>
                  {item.category.categoryName}
                </Text>
              </View>
            )}
          </View>

          <View style={styles.designInfo}>
            <View style={styles.infoContainer}>
              <Text style={styles.designName} numberOfLines={1}>
                {item.name}
              </Text>

              <View style={styles.workshopRow}>
                <Ionicons
                  name="business"
                  size={14}
                  color="#4A5568"
                  style={styles.icon}
                />
                <Text style={styles.workshopName} numberOfLines={1}>
                  {item.woodworkerProfile?.brandName || "Không có tên xưởng"}
                </Text>
              </View>

              <View style={styles.addressRow}>
                <Ionicons
                  name="location"
                  size={14}
                  color="#718096"
                  style={styles.icon}
                />
                <Text style={styles.addressText} numberOfLines={2}>
                  {item.woodworkerProfile.address}
                </Text>
              </View>
            </View>

            <View style={styles.ratingContainer}>
              <StarReview
                totalStar={item.totalStar}
                totalReviews={item.totalReviews}
              />
            </View>
          </View>
        </View>
      </PackageFrame>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Pagination
        itemsPerPage={8}
        dataList={designs}
        DisplayComponent={({ data }) => (
          <FlatList
            data={data}
            renderItem={renderDesignItem}
            keyExtractor={(item) => item.designIdeaId.toString()}
            numColumns={2}
            columnWrapperStyle={styles.row}
            contentContainerStyle={styles.listContent}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    height: 400,
    justifyContent: "center",
    alignItems: "center",
  },
  listContent: {
    paddingVertical: 16,
  },
  row: {
    justifyContent: "space-between",
    marginBottom: 16,
  },
  designItem: {
    width: "48%",
  },
  designCard: {
    backgroundColor: "white",
    borderRadius: 8,
    overflow: "hidden",
  },
  imageContainer: {
    position: "relative",
  },
  designImage: {
    width: "100%",
    height: 150,
  },
  imageCountBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(49, 151, 149, 0.8)",
    borderRadius: 4,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  imageIcon: {
    marginRight: 4,
  },
  imageCountText: {
    color: "white",
    fontSize: 12,
  },
  categoryBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "rgba(159, 122, 234, 0.8)",
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  categoryText: {
    color: "white",
    fontSize: 10,
  },
  designInfo: {
    padding: 8,
    height: 120,
    justifyContent: "space-between",
  },
  infoContainer: {
    flex: 1,
  },
  designName: {
    fontWeight: "bold",
    fontSize: 14,
    marginBottom: 4,
  },
  workshopRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
  },
  workshopName: {
    fontSize: 12,
    fontWeight: "500",
  },
  addressRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  addressText: {
    fontSize: 10,
    color: "#718096",
  },
  icon: {
    marginRight: 4,
  },
  ratingContainer: {
    alignSelf: "flex-end",
    marginTop: 4,
  },
});
