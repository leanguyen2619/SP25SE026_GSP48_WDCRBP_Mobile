import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import useCart from "../../../../hooks/useCart.js";
import { formatPrice } from "../../../../utils/utils.js";
import ConfigDisplay from "../../../../components/Utility/ConfigDisplay.jsx";
import { appColorTheme } from "../../../../config/appconfig.js";

export default function DesignCartItemDetail({ design, type, woodworkerId }) {
  const { changeDesignQuantity, removeDesignFromCart, MAX_QUANTITY } =
    useCart();
  const navigation = useNavigation();

  // Lấy URL ảnh đầu tiên nếu có nhiều
  const getImageUrl = (imgUrls) => {
    if (!imgUrls) return "";
    if (typeof imgUrls === "string") {
      // Xử lý chuỗi URLs phân cách bởi dấu phẩy
      const urlArray = imgUrls.split(";");
      return urlArray[0].trim();
    }
    return imgUrls;
  };

  const handleIncrease = () => {
    if (type === "design" && design.quantity < MAX_QUANTITY) {
      changeDesignQuantity(
        woodworkerId,
        design.designIdeaVariantId,
        design.quantity + 1
      );
    }
  };

  const handleDecrease = () => {
    if (design.quantity > 1 && type === "design") {
      changeDesignQuantity(
        woodworkerId,
        design.designIdeaVariantId,
        design.quantity - 1
      );
    }
  };

  const handleRemove = () => {
    if (type === "design") {
      removeDesignFromCart(woodworkerId, design.designIdeaVariantId);
    }
  };

  const navigateToDesignDetail = () => {
    navigation.navigate("DesignDetail", { designId: design.designId });
  };

  return (
    <View style={styles.container}>
      {/* Left Section: Image and Quantity */}
      <View style={styles.leftSection}>
        {/* Design Image */}
        <TouchableOpacity onPress={navigateToDesignDetail}>
          <Image
            source={{ uri: getImageUrl(design.img_urls) }}
            style={styles.image}
            resizeMode="cover"
          />
        </TouchableOpacity>

        {/* Quantity Controls */}
        <View style={styles.imageQuantityContainer}>
          <Text style={styles.quantityLabel}>Số lượng:</Text>

          <View style={styles.quantityControls}>
            <TouchableOpacity
              style={[
                styles.quantityButton,
                design.quantity <= 1 && styles.quantityButtonDisabled,
              ]}
              onPress={handleDecrease}
              disabled={design.quantity <= 1}
            >
              <MaterialIcons
                name="remove"
                size={16}
                color={design.quantity <= 1 ? "#CBD5E0" : "#000"}
              />
            </TouchableOpacity>

            <Text style={styles.quantityText}>{design.quantity}</Text>

            <TouchableOpacity
              style={[
                styles.quantityButton,
                design.quantity >= MAX_QUANTITY &&
                  styles.quantityButtonDisabled,
              ]}
              onPress={handleIncrease}
              disabled={design.quantity >= MAX_QUANTITY}
            >
              <MaterialIcons
                name="add"
                size={16}
                color={design.quantity >= MAX_QUANTITY ? "#CBD5E0" : "#000"}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Design Details */}
      <View style={styles.detailsSection}>
        {/* Top Row: Title and Remove Button */}
        <View style={styles.headerRow}>
          <TouchableOpacity
            onPress={navigateToDesignDetail}
            style={styles.titleContainer}
          >
            <Text style={styles.title} numberOfLines={2}>
              {design.name}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleRemove}
            hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
          >
            <Feather name="trash-2" size={20} color="#E53E3E" />
          </TouchableOpacity>
        </View>

        {/* Installation Status Badge */}
        <View style={styles.badgeContainer}>
          {design.isInstall ? (
            <View style={[styles.badge, styles.installBadge]}>
              <Text style={styles.installBadgeText}>Cần lắp đặt</Text>
            </View>
          ) : (
            <View style={[styles.badge, styles.noInstallBadge]}>
              <Text style={styles.noInstallBadgeText}>Không cần lắp đặt</Text>
            </View>
          )}
        </View>

        {/* Config Information */}
        <ConfigDisplay
          config={design.designIdeaVariantConfig}
          compact={false}
          style={styles.configText}
        />

        {/* Price */}
        <Text style={styles.price}>{formatPrice(design.price)}</Text>

        {/* Total Price */}
        <View style={styles.totalPriceContainer}>
          <Text style={styles.totalPriceLabel}>Tổng:</Text>
          <Text style={styles.totalPrice}>
            {formatPrice(design.price * design.quantity)}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 16,
    padding: 4,
    marginVertical: 8,
  },
  leftSection: {
    width: 120,
  },
  imageSection: {
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
  detailsSection: {
    flex: 1,
    justifyContent: "space-between",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  titleContainer: {
    flex: 1,
    marginRight: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
  badgeContainer: {
    marginTop: 6,
  },
  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  installBadge: {
    backgroundColor: "#EBF8FF",
  },
  noInstallBadge: {
    backgroundColor: "#FEEBC8",
  },
  installBadgeText: {
    fontSize: 12,
    color: "#2B6CB0",
  },
  noInstallBadgeText: {
    fontSize: 12,
    color: "#C05621",
  },
  configText: {
    fontSize: 14,
    color: "#4A5568",
    marginTop: 6,
  },
  price: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 8,
  },
  quantitySection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  quantityLabelContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  quantityLabel: {
    fontSize: 14,
    color: "#4A5568",
    marginBottom: 4,
  },
  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 4,
    overflow: "hidden",
  },
  quantityButton: {
    padding: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  quantityButtonDisabled: {
    opacity: 0.5,
  },
  quantityText: {
    marginHorizontal: 8,
  },
  totalPriceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  totalPriceLabel: {
    fontSize: 14,
    color: "#4A5568",
  },
  totalPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: appColorTheme.brown_2,
  },
});
