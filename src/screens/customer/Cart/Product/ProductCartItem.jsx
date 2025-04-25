import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { formatPrice } from "../../../../utils/utils.js";
import useCart from "../../../../hooks/useCart.js";
import { appColorTheme } from "../../../../config/appconfig.js";

export default function ProductCartItem({ item, woodworkerId }) {
  const { removeProductFromCart } = useCart();
  const navigation = useNavigation();

  const navigateToDetail = () => {
    navigation.navigate("ProductDetail", { productId: item.productId });
  };

  // Lấy URL ảnh đầu tiên từ chuỗi URL phân cách bởi dấu chấm phẩy
  const getImageUrl = () => {
    if (!item.mediaUrls) return "https://via.placeholder.com/100";
    if (item.mediaUrls.includes(";")) {
      return item.mediaUrls.split(";")[0];
    }
    return item.mediaUrls;
  };

  return (
    <View style={styles.container}>
      {/* Product image */}
      <TouchableOpacity onPress={navigateToDetail}>
        <Image
          source={{ uri: getImageUrl() }}
          style={styles.image}
          resizeMode="cover"
        />
      </TouchableOpacity>

      {/* Product details */}
      <View style={styles.detailsContainer}>
        {/* Top row: Product name and delete button */}
        <View style={styles.topRow}>
          <TouchableOpacity
            onPress={navigateToDetail}
            style={styles.titleContainer}
          >
            <Text style={styles.title} numberOfLines={1}>
              {item.productName}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => removeProductFromCart(woodworkerId, item.productId)}
            style={styles.removeButton}
            hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
          >
            <Feather name="trash-2" size={18} color="#E53E3E" />
          </TouchableOpacity>
        </View>

        {/* Middle row: additional details */}
        <View style={styles.detailsSection}>
          <Text style={styles.detailText} numberOfLines={2}>
            {item.woodType}
          </Text>
          <Text style={styles.detailText} numberOfLines={1}>
            {item.length}cm x {item.width}cm x {item.height}cm
          </Text>
        </View>

        {/* Bottom row: Price and quantity */}
        <View style={styles.bottomRow}>
          <Text style={styles.quantity}>SL: {item.quantity}</Text>
          <Text style={styles.price}>{formatPrice(item.price)}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  image: {
    height: 100,
    width: 100,
    borderRadius: 6,
  },
  detailsContainer: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "space-between",
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  titleContainer: {
    flex: 1,
    marginRight: 8,
  },
  title: {
    fontWeight: "bold",
    fontSize: 16,
  },
  removeButton: {
    padding: 5,
  },
  detailsSection: {
    marginVertical: 6,
  },
  detailText: {
    fontSize: 14,
    color: "#4A5568",
    marginVertical: 2,
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  quantity: {
    fontSize: 14,
    color: "#4A5568",
  },
  price: {
    fontWeight: "bold",
    fontSize: 16,
    color: appColorTheme.brown_2,
  },
});
