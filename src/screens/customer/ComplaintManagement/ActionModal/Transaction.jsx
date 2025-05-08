import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useState } from "react";
import { appColorTheme } from "../../../../config/appconfig.js";
import { useGetAllOrderDepositByOrderIdQuery } from "../../../../services/orderDepositApi.js";
import { formatPrice, formatDateTimeString } from "../../../../utils/utils.js";
import { AntDesign } from "@expo/vector-icons";

export default function Transaction({ order }) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Fetch deposit data
  const {
    data: depositsResponse,
    isLoading: isDepositsLoading,
    error: depositsError,
  } = useGetAllOrderDepositByOrderIdQuery(order?.orderId);

  const deposits = depositsResponse?.data || [];

  const toggleAccordion = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <View style={styles.container}>
      <View style={styles.accordionHeader}>
        <TouchableOpacity
          style={styles.accordionButton}
          onPress={toggleAccordion}
        >
          <Text style={styles.heading}>Thông tin giao dịch của đơn hàng</Text>
          <AntDesign
            name={isExpanded ? "up" : "down"}
            size={20}
            color={appColorTheme.brown_2}
          />
        </TouchableOpacity>
      </View>

      {isExpanded && (
        <View style={styles.accordionPanel}>
          {isDepositsLoading ? (
            <View style={styles.centerContent}>
              <ActivityIndicator size="small" color={appColorTheme.brown_2} />
            </View>
          ) : depositsError ? (
            <View style={styles.centerContent}>
              <Text style={styles.errorText}>
                Đã có lỗi xảy ra khi tải thông tin thanh toán
              </Text>
            </View>
          ) : deposits.length === 0 ? (
            <View style={styles.centerContent}>
              <Text style={styles.grayText}>Chưa có thông tin thanh toán</Text>
            </View>
          ) : (
            <View style={styles.contentStack}>
              <View style={styles.amountInfoStack}>
                <View style={styles.infoRow}>
                  <Text style={styles.boldText}>Thành tiền:</Text>
                  <Text style={[styles.boldText, styles.amountText]}>
                    {order?.totalAmount
                      ? formatPrice(order?.totalAmount)
                      : "Chưa cập nhật"}
                  </Text>
                </View>

                <View style={styles.infoRow}>
                  <Text style={styles.boldText}>Số tiền đã thanh toán:</Text>
                  <Text style={[styles.boldText, styles.amountText]}>
                    {formatPrice(order?.amountPaid)}
                  </Text>
                </View>

                <View style={styles.infoRow}>
                  <Text style={styles.boldText}>Số tiền còn lại:</Text>
                  <Text style={[styles.boldText, styles.amountText]}>
                    {formatPrice(order?.amountRemaining)}
                  </Text>
                </View>
              </View>

              <View style={styles.divider} />

              {deposits.map((deposit) => (
                <View
                  key={deposit.orderDepositId}
                  style={[
                    styles.depositCard,
                    {
                      backgroundColor: deposit.status ? "#F0FFF4" : "#F7FAFC",
                    },
                  ]}
                >
                  <View style={styles.depositHeader}>
                    <Text style={styles.boldText}>
                      Đặt cọc lần {deposit.depositNumber}
                    </Text>
                    <View
                      style={[
                        styles.badge,
                        {
                          backgroundColor: deposit.status
                            ? "#48BB78"
                            : "#A0AEC0",
                        },
                      ]}
                    >
                      <Text style={styles.badgeText}>
                        {deposit.status ? "Đã thanh toán" : "Chưa thanh toán"}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.infoRow}>
                    <Text style={styles.boldText}>Ngày tạo:</Text>
                    <Text>
                      {deposit.createdAt
                        ? formatDateTimeString(deposit.createdAt)
                        : "Chưa cập nhật"}
                    </Text>
                  </View>

                  <View style={styles.infoRow}>
                    <Text style={styles.boldText}>Ngày thanh toán:</Text>
                    <Text>
                      {deposit.updatedAt
                        ? formatDateTimeString(deposit.updatedAt)
                        : "Chưa cập nhật"}
                    </Text>
                  </View>

                  <View style={styles.infoRow}>
                    <Text style={styles.boldText}>Số tiền thanh toán:</Text>
                    <Text style={[styles.boldText, styles.amountText]}>
                      {deposit.amount
                        ? formatPrice(deposit.amount)
                        : "Chưa cập nhật"}
                    </Text>
                  </View>

                  <View style={styles.infoRow}>
                    <Text style={styles.boldText}>Phần trăm cọc:</Text>
                    <Text>
                      {deposit.percent
                        ? `${deposit.percent}%`
                        : "Chưa cập nhật"}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  accordionHeader: {
    marginBottom: (isExpanded) => (isExpanded ? 10 : 0),
  },
  accordionButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 5,
  },
  heading: {
    fontSize: 18,
    fontWeight: "bold",
    flex: 1,
  },
  accordionPanel: {
    marginTop: 10,
  },
  centerContent: {
    alignItems: "center",
    paddingVertical: 20,
  },
  errorText: {
    color: "red",
  },
  grayText: {
    color: "#718096",
  },
  contentStack: {
    marginTop: 10,
  },
  amountInfoStack: {
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  boldText: {
    fontWeight: "bold",
  },
  amountText: {
    color: appColorTheme.brown_2,
  },
  divider: {
    height: 20,
  },
  depositCard: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  depositHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  badge: {
    borderRadius: 15,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  badgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
});
