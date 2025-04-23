import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import StarReview from "../../../../../../components/Utility/StarReview.jsx";
import PackageFrame from "../../../../../../components/Utility/PackageFrame.jsx";
import { formatPrice } from "../../../../../../utils/utils.js";
import { appColorTheme } from "../../../../../../config/appconfig.js";

export default function ProductList({ products = [], isLoading, error }) {
  const navigation = useNavigation();

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={appColorTheme.brown_2} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text>Đã xảy ra lỗi khi tải dữ liệu.</Text>
      </View>
    );
  }

  if (!products.length) {
    return (
      <View style={styles.centerContainer}>
        <Text>Không tìm thấy sản phẩm nào</Text>
      </View>
    );
  }

  const renderItem = ({ item }) => {
    const imageUrl = item.mediaUrls ? item.mediaUrls.split(";")[0] : "";
    const imageCount = item.mediaUrls ? item.mediaUrls.split(";").length : 0;

    return (
      <TouchableOpacity
        style={styles.itemContainer}
        onPress={() =>
          navigation.navigate("ProductDetail", { id: item.productId })
        }
      >
        <PackageFrame packageType={item.packType}>
          <View style={styles.productCard}>
            <View style={styles.imageContainer}>
              <Image source={{ uri: imageUrl }} style={styles.image} />

              {imageCount > 1 && (
                <View style={styles.imageBadge}>
                  <Ionicons name="images" size={14} color="white" />
                  <Text style={styles.imageBadgeText}>{imageCount}</Text>
                </View>
              )}

              {item.categoryName && (
                <View style={styles.categoryBadge}>
                  <Text style={styles.categoryText}>{item.categoryName}</Text>
                </View>
              )}
            </View>

            <View style={styles.detailsContainer}>
              <Text style={styles.productName} numberOfLines={2}>
                {item.productName}
              </Text>

              <Text style={styles.priceText}>{formatPrice(item.price)}</Text>

              <View style={styles.ratingContainer}>
                <StarReview
                  totalStar={item.totalStar || 0}
                  totalReviews={item.totalReviews || 0}
                />
              </View>
            </View>
          </View>
        </PackageFrame>
      </TouchableOpacity>
    );
  };

  return (
    <FlatList
      data={products}
      renderItem={renderItem}
      keyExtractor={(item) => item.productId.toString()}
      numColumns={1}
      contentContainerStyle={styles.list}
    />
  );
}

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    minHeight: 300,
  },
  list: {
    padding: 16,
  },
  itemContainer: {
    width: "100%",
    marginBottom: 16,
  },
  productCard: {
    borderRadius: 8,
    backgroundColor: "white",
    overflow: "hidden",
  },
  imageContainer: {
    position: "relative",
  },
  image: {
    width: "100%",
    height: 180,
    resizeMode: "cover",
  },
  imageBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(49, 151, 149, 0.8)",
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    flexDirection: "row",
    alignItems: "center",
  },
  imageBadgeText: {
    color: "white",
    fontSize: 12,
    marginLeft: 2,
  },
  categoryBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "rgba(128, 90, 213, 0.8)",
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  categoryText: {
    color: "white",
    fontSize: 12,
  },
  detailsContainer: {
    padding: 8,
    height: 100,
  },
  productName: {
    fontWeight: "bold",
    fontSize: 14,
    marginBottom: 6,
  },
  priceText: {
    color: appColorTheme.brown_2,
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 6,
  },
  ratingContainer: {
    marginTop: "auto",
    alignSelf: "flex-end",
  },
});
