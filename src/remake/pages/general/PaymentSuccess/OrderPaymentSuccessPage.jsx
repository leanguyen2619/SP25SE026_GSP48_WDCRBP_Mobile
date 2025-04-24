import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Feather";
import { appColorTheme } from "../../../config/appconfig";
import { formatPrice } from "../../../utils/utils";
import { useVerifyOrderPaymentMutation } from "../../../services/walletApi";
import { useNotify } from "../../../components/Utility/Notify";

// Simple primary button to replace your CustomButton
function PrimaryButton({ title, onPress, icon }) {
  return (
    <TouchableOpacity style={styles.primaryButton} onPress={onPress}>
      {icon && (
        <Icon name={icon} size={18} color="#fff" style={styles.btnIcon} />
      )}
      <Text style={styles.primaryButtonText}>{title}</Text>
    </TouchableOpacity>
  );
}

export default function OrderPaymentSuccessPage() {
  const route = useRoute();
  const navigation = useNavigation();
  const notify = useNotify();
  const [verifyPayment, { isLoading }] = useVerifyOrderPaymentMutation();
  const [paymentInfo, setPaymentInfo] = useState(null);

  const orderDepositId = route.params?.orderDepositId || "";
  const transactionId = route.params?.transactionId || "";

  useEffect(() => {
    const verifyTransaction = async () => {
      try {
        if (orderDepositId && transactionId) {
          const response = await verifyPayment({
            orderDepositId,
            transactionId,
          }).unwrap();
          setPaymentInfo(response.data);
        }
      } catch (err) {
        notify(
          "Xác thực thanh toán thất bại",
          err?.data?.message || "Có lỗi xảy ra khi xác thực thanh toán",
          "error"
        );
        navigation.navigate("Error", {
          message: "Có lỗi xảy ra khi xác thực thanh toán",
        });
      }
    };
    verifyTransaction();
  }, [orderDepositId, transactionId]);

  const handleViewOrder = () => {
    if (paymentInfo?.orderId) {
      navigation.navigate("CustomerServiceOrderDetail", {
        orderId: paymentInfo.orderId,
      });
    }
  };

  if (isLoading || !paymentInfo) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={appColorTheme.primary} />
        <Text style={styles.loadingText}>Đang xác thực thanh toán...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Icon name="check-circle" size={80} color={appColorTheme.success} />
      </View>

      <Text style={styles.title}>Thanh toán thành công!</Text>
      <Text style={styles.message}>
        Bạn đã hoàn thành thanh toán đặt cọc cho đơn dịch vụ
      </Text>

      <View style={styles.detailsContainer}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Mã đơn dịch vụ:</Text>
          <Text style={styles.detailValue}>#{paymentInfo.orderId}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Khoản thanh toán:</Text>
          <Text style={styles.detailValue}>
            Đặt cọc lần #{paymentInfo.depositNumber}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Số tiền:</Text>
          <Text style={[styles.detailValue, styles.amountText]}>
            {formatPrice(paymentInfo.amount)}
          </Text>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <PrimaryButton
          title="Xem đơn hàng"
          onPress={handleViewOrder}
          icon="eye"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
  loadingContainer: {
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    color: "#666",
  },
  iconContainer: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
  message: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 24,
  },
  detailsContainer: {
    width: "100%",
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    padding: 16,
    marginBottom: 32,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "#4B5563",
  },
  detailValue: {
    fontSize: 15,
    fontWeight: "500",
  },
  amountText: {
    color: appColorTheme.brown_2,
    fontWeight: "700",
  },
  buttonContainer: {
    width: "100%",
  },
  // ---- new button styles ----
  primaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: appColorTheme.primary,
    paddingVertical: 12,
    borderRadius: 8,
  },
  primaryButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  btnIcon: {
    marginRight: 8,
  },
});
