import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Pressable,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import {
  appColorTheme,
  getGuaranteeOrderStatusColor,
} from "../../../../config/appconfig";
import { formatPrice, formatDateTimeString } from "../../../../utils/utils";

const GuaranteeOrderCard = ({ order, onViewDetails }) => {
  // Chuyển đổi màu status từ Chakra UI sang React Native
  const getStatusColor = (status) => {
    const colorScheme = getGuaranteeOrderStatusColor(status);
    switch (colorScheme) {
      case "green":
        return "#48BB78"; // green.500
      case "red":
        return "#E53E3E"; // red.500
      case "orange":
        return "#ED8936"; // orange.500
      case "blue":
        return "#3182CE"; // blue.500
      case "purple":
        return "#805AD5"; // purple.500
      case "gray":
      default:
        return "#718096"; // gray.500
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.headerLeft}>
          <Text style={styles.orderIdText}>
            Mã yêu cầu: #{order.guaranteeOrderId}
          </Text>
        </View>
        <View
          style={[
            styles.badge,
            { backgroundColor: getStatusColor(order.status) + "20" }, // Thêm opacity
          ]}
        >
          <Text
            style={[styles.badgeText, { color: getStatusColor(order.status) }]}
          >
            {order.status}
          </Text>
        </View>
      </View>

      <View style={styles.cardBody}>
        <View style={styles.column}>
          <View style={styles.row}>
            <Text style={styles.label}>Khách hàng:</Text>
            <Pressable>
              <Text style={styles.link}>{order.user?.username || "N/A"}</Text>
            </Pressable>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Mã sản phẩm:</Text>
            <Text style={styles.value}>
              #{order.requestedProduct?.requestedProductId || "N/A"}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Phân loại:</Text>
            <Text style={styles.value}>
              {order.requestedProduct?.category?.categoryName ||
                "Không có thông tin"}
            </Text>
          </View>
        </View>

        <View style={styles.column}>
          <View style={styles.row}>
            <Text style={styles.label}>Lắp đặt:</Text>
            <Text style={styles.value}>{order.install ? "Có" : "Không"}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Ngày tạo:</Text>
            <Text style={styles.value}>
              {formatDateTimeString(order.createdAt)}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Hình thức:</Text>
            <Text style={styles.value}>
              {order?.isGuarantee ? "Bảo hành" : "Sửa chữa"}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.cardFooter}>
        {order.totalAmount ? (
          <Text style={styles.priceText}>{formatPrice(order.totalAmount)}</Text>
        ) : (
          <Text style={styles.pendingText}>Chưa cập nhật thành tiền</Text>
        )}

        <TouchableOpacity
          style={styles.button}
          onPress={() => onViewDetails(order.guaranteeOrderId)}
        >
          <Feather name="eye" size={16} color="white" style={styles.icon} />
          <Text style={styles.buttonText}>Xem chi tiết</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 8,
    backgroundColor: "white",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#F7FAFC",
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  orderIdText: {
    fontWeight: "bold",
    fontSize: 16,
  },
  badge: {
    borderRadius: 16,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "bold",
  },
  cardBody: {
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  column: {
    width: "48%",
  },
  row: {
    marginBottom: 8,
  },
  label: {
    fontWeight: "600",
    fontSize: 14,
    marginBottom: 2,
  },
  value: {
    fontSize: 14,
  },
  link: {
    color: appColorTheme.brown_2,
    fontSize: 14,
  },
  divider: {
    height: 1,
    backgroundColor: "#E2E8F0",
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
  },
  priceText: {
    fontSize: 16,
    fontWeight: "bold",
    color: appColorTheme.brown_2,
  },
  pendingText: {
    fontSize: 14,
    color: "#718096",
  },
  button: {
    backgroundColor: appColorTheme.brown_2,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  buttonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "500",
  },
  icon: {
    marginRight: 4,
  },
});

export default GuaranteeOrderCard;
