import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import { formatPrice } from "../../../../utils/utils.js";
import useCart from "../../../../hooks/useCart.js";
import { useNavigation } from "@react-navigation/native";

export default function ProductCartItemDetail({ product, woodworkerId }) {
  const { changeProductQuantity, removeProductFromCart, MAX_QUANTITY } =
    useCart();
  const navigation = useNavigation();

  const handleIncrease = () => {
    if (product.quantity < MAX_QUANTITY) {
      changeProductQuantity(
        woodworkerId,
        product.productId,
        product.quantity + 1
      );
    }
  };

  const handleDecrease = () => {
    if (product.quantity > 1) {
      changeProductQuantity(
        woodworkerId,
        product.productId,
        product.quantity - 1
      );
    }
  };

  const navigateToProduct = () => {
    navigation.navigate("ProductDetail", { productId: product.productId });
  };

  return (
    <View style={styles.container}>
      {/* Left Section: Image and Quantity controls */}
      <View style={styles.leftSection}>
        {/* Product image */}
        <TouchableOpacity onPress={navigateToProduct}>
          <Image
            source={{
              uri: product.mediaUrls
                ? product.mediaUrls.split(";")[0]
                : "https://via.placeholder.com/150",
            }}
            style={styles.image}
          />
        </TouchableOpacity>

        {/* Quantity controls below image */}
        <View style={styles.imageQuantityContainer}>
          <Text style={styles.quantityLabel}>Số lượng:</Text>
          <View style={styles.quantityControls}>
            <TouchableOpacity
              style={[
                styles.quantityButton,
                product.quantity <= 1 && styles.quantityButtonDisabled,
              ]}
              onPress={handleDecrease}
              disabled={product.quantity <= 1}
            >
              <MaterialIcons
                name="remove"
                size={14}
                color={product.quantity <= 1 ? "#A0AEC0" : "#000"}
              />
            </TouchableOpacity>
            <Text style={styles.quantityText}>{product.quantity}</Text>
            <TouchableOpacity
              style={[
                styles.quantityButton,
                product.quantity >= MAX_QUANTITY &&
                  styles.quantityButtonDisabled,
              ]}
              onPress={handleIncrease}
              disabled={product.quantity >= MAX_QUANTITY}
            >
              <MaterialIcons
                name="add"
                size={14}
                color={product.quantity >= MAX_QUANTITY ? "#A0AEC0" : "#000"}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Product details */}
      <View style={styles.detailsContainer}>
        {/* First row: name and delete button */}
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={navigateToProduct}>
            <Text style={styles.productName} numberOfLines={2}>
              {product.productName}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() =>
              removeProductFromCart(woodworkerId, product.productId)
            }
          >
            <Feather name="trash-2" size={20} color="#E53E3E" />
          </TouchableOpacity>
        </View>

        {/* Product specs */}
        <View style={styles.specsContainer}>
          <Text style={styles.specText}>Loại gỗ: {product.woodType}</Text>
          <Text style={styles.specText}>
            Kích thước: {product.length}cm x {product.width}cm x{" "}
            {product.height}cm
          </Text>
        </View>

        {/* Price row */}
        <View style={styles.priceRow}>
          <Text style={styles.priceLabel}>Đơn giá:</Text>
          <Text style={styles.priceValue}>{formatPrice(product.price)}</Text>
        </View>

        {/* Total price row */}
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Tổng:</Text>
          <Text style={styles.priceText}>
            {formatPrice(product.price * product.quantity)}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 8,
    gap: 16,
  },
  leftSection: {
    width: 120,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 8,
  },
  imageQuantityContainer: {
    marginTop: 8,
    alignItems: "center",
  },
  detailsContainer: {
    flex: 1,
    justifyContent: "space-between",
    minHeight: 120,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  productName: {
    fontSize: 16,
    fontWeight: "bold",
    flex: 1,
    marginRight: 8,
  },
  deleteButton: {
    padding: 4,
  },
  specsContainer: {
    marginVertical: 8,
  },
  specText: {
    fontSize: 13,
    color: "#718096",
    marginBottom: 2,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
  },
  priceLabel: {
    fontSize: 13,
    color: "#718096",
  },
  priceValue: {
    fontSize: 14,
    fontWeight: "500",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  totalLabel: {
    fontSize: 13,
    color: "#718096",
  },
  quantityLabel: {
    fontSize: 13,
    color: "#718096",
    marginBottom: 4,
  },
  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 4,
    height: 28,
  },
  quantityButton: {
    width: 28,
    height: 28,
    justifyContent: "center",
    alignItems: "center",
  },
  quantityButtonDisabled: {
    opacity: 0.5,
  },
  quantityText: {
    paddingHorizontal: 12,
  },
  priceText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#8E6A4E", // app_brown.2
  },
});
