import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { formatPrice } from "../../../../utils/utils.js";
import useCart from "../../../../hooks/useCart.js";
import { appColorTheme } from "../../../../config/appconfig.js";
import ConfigDisplay from "../../../../components/Utility/ConfigDisplay.jsx";

export default function DesignCartItem({ item, type, woodworkerId }) {
  const { removeDesignFromCart } = useCart();
  const navigation = useNavigation();

  // Lấy URL ảnh đầu tiên nếu có nhiều
  const getImageUrl = (imgUrls) => {
    if (!imgUrls) return "";
    if (typeof imgUrls === "string") {
      // Xử lý chuỗi URL phân cách bởi dấu phẩy
      const urlArray = imgUrls.split(";");
      return urlArray[0].trim();
    }
    return imgUrls;
  };

  const handleRemove = () => {
    if (type === "design") {
      removeDesignFromCart(woodworkerId, item.designIdeaVariantId);
    }
  };

  const navigateToDetail = () => {
    navigation.navigate("DesignDetail", { designId: item.designId });
  };

  return (
    <View style={styles.container}>
      {/* Design image */}
      <TouchableOpacity onPress={navigateToDetail}>
        <Image
          source={{ uri: getImageUrl(item.img_urls) }}
          style={styles.image}
          resizeMode="cover"
        />
      </TouchableOpacity>

      {/* Design details */}
      <View style={styles.detailsContainer}>
        {/* Top row: Design name and delete button */}
        <View style={styles.topRow}>
          <TouchableOpacity
            onPress={navigateToDetail}
            style={styles.titleContainer}
          >
            <Text style={styles.title} numberOfLines={1}>
              {item.name}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleRemove}
            style={styles.removeButton}
            hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
          >
            <Feather name="trash-2" size={18} color="#E53E3E" />
          </TouchableOpacity>
        </View>

        {/* Middle row: Design variant configuration */}
        <View style={styles.configContainer}>
          <ConfigDisplay
            config={item.designIdeaVariantConfig}
            compact={true}
            style={styles.configText}
          />
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
  configContainer: {
    marginVertical: 8,
  },
  configText: {
    fontSize: 14,
    color: "#4A5568",
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "auto",
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
