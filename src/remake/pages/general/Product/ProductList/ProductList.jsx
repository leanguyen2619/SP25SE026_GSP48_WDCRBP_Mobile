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
import Ionicons from "@expo/vector-icons/Ionicons";

const formatPrice = (price) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
};

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

  const renderProductItem = ({ item }) => (
    <TouchableOpacity
      style={styles.productItem}
      onPress={() =>
        navigation.navigate("ProductDetail", { id: item.productId })
      }
    >
      <PackageFrame packageType={item.packType}>
        <View style={styles.productCard}>
          <View style={styles.imageContainer}>
            <Image
              source={{
                uri: item.mediaUrls ? item.mediaUrls.split(";")[0] : "",
              }}
              style={styles.productImage}
              resizeMode="cover"
            />

            {/* Display number of images badge */}
            {item.mediaUrls && item.mediaUrls.includes(";") && (
              <View style={styles.imageCountBadge}>
                <Ionicons
                  name="images"
                  size={14}
                  color="white"
                  style={styles.imageIcon}
                />
                <Text style={styles.imageCountText}>
                  {item.mediaUrls.split(";").length}
                </Text>
              </View>
            )}

            {item.categoryName && (
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryText}>{item.categoryName}</Text>
              </View>
            )}
          </View>

          <View style={styles.productInfo}>
            <View style={styles.infoContainer}>
              <Text style={styles.productName} numberOfLines={2}>
                {item.productName}
              </Text>

              <Text style={styles.productPrice}>{formatPrice(item.price)}</Text>

              <View style={styles.workshopRow}>
                <Ionicons
                  name="business"
                  size={14}
                  color="#4A5568"
                  style={styles.icon}
                />
                <Text style={styles.workshopName} numberOfLines={1}>
                  {item.woodworkerName || "Không có tên xưởng"}
                </Text>
              </View>

              <View style={styles.addressRow}>
                <Ionicons
                  name="location"
                  size={14}
                  color="#718096"
                  style={styles.icon}
                />
                <Text style={styles.addressText} numberOfLines={1}>
                  {item.address || "Không có địa chỉ"}
                </Text>
              </View>
            </View>

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

  return (
    <View style={styles.container}>
      <Pagination
        itemsPerPage={8}
        dataList={products}
        DisplayComponent={({ data }) => (
          <FlatList
            data={data}
            renderItem={renderProductItem}
            keyExtractor={(item) => item.productId.toString()}
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
  productItem: {
    width: "48%",
  },
  productCard: {
    backgroundColor: "white",
    borderRadius: 8,
    overflow: "hidden",
  },
  imageContainer: {
    position: "relative",
  },
  productImage: {
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
  productInfo: {
    padding: 8,
    height: 120,
    justifyContent: "space-between",
  },
  infoContainer: {
    flex: 1,
  },
  productName: {
    fontWeight: "bold",
    fontSize: 14,
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: appColorTheme.brown_2,
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
