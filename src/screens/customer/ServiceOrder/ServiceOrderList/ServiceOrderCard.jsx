import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  appColorTheme,
  getServiceOrderStatusColor,
} from "../../../../config/appconfig";
import { formatPrice, formatDateTimeString } from "../../../../utils/utils";

// Reverse lookup for display names
const getServiceTypeDisplayName = (apiValue) => {
  const serviceTypeMap = {
    Customization: "Tùy chỉnh",
    Personalization: "Cá nhân hóa",
    Sale: "Mua hàng",
  };

  return serviceTypeMap[apiValue] || apiValue;
};

const ServiceOrderCard = ({ order, onViewDetails }) => {
  // Map status colors to React Native colors
  const getStatusColor = (status) => {
    const colorScheme = getServiceOrderStatusColor(status);
    const colorMap = {
      green: "#38A169",
      blue: "#3182CE",
      orange: "#DD6B20",
      red: "#E53E3E",
      purple: "#805AD5",
      gray: "#718096",
    };
    return colorMap[colorScheme] || colorMap.gray;
  };

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>Mã đơn: #{order.orderId}</Text>
      </View>

      <View style={styles.cardBody}>
        <View style={styles.infoRow}>
          <View
            style={[
              styles.badge,
              { backgroundColor: getStatusColor(order.status) + "20" },
            ]}
          >
            <Text
              style={[
                styles.badgeText,
                { color: getStatusColor(order.status) },
              ]}
            >
              {order.status}
            </Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Loại dịch vụ:</Text>
          <Text style={styles.value}>
            {getServiceTypeDisplayName(
              order.service?.service?.serviceName || "N/A"
            )}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Xưởng mộc:</Text>
          <Text style={styles.link}>
            {order.service?.wwDto?.brandName || "N/A"}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Lắp đặt:</Text>
          <Text style={styles.value}>{order.install ? "Có" : "Không"}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Ngày tạo:</Text>
          <Text style={styles.value}>
            {formatDateTimeString(order.createdAt)}
          </Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.cardFooter}>
        {order.totalAmount ? (
          <Text style={styles.totalAmount}>
            {formatPrice(order.totalAmount)}
          </Text>
        ) : (
          <Text style={styles.totalAmount}>Chưa cập nhật thành tiền</Text>
        )}

        <TouchableOpacity
          onPress={() => onViewDetails(order.orderId)}
          style={styles.button}
        >
          <Ionicons
            name="eye-outline"
            size={18}
            color="white"
            style={styles.buttonIcon}
          />
          <Text style={styles.buttonText}>Xem chi tiết</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    marginBottom: 12,
  },
  cardHeader: {
    backgroundColor: "#F7FAFC",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  badge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "600",
  },
  cardBody: {
    padding: 16,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  label: {
    fontWeight: "600",
    minWidth: 100,
  },
  value: {
    flex: 1,
  },
  link: {
    color: appColorTheme.brown_2,
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: "#E2E8F0",
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: "bold",
    color: appColorTheme.brown_2,
  },
  button: {
    backgroundColor: appColorTheme.brown_2,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  buttonIcon: {
    marginRight: 6,
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 14,
  },
});

export default ServiceOrderCard;
