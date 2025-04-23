import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useUpdateTransactionStatusMutation } from "../../../services/transactionApi";
import { useDecryptDataQuery } from "../../../services/decryptApi";
import { useNotify } from "../../../components/Utility/Notify";
import { appColorTheme } from "../../../config/appconfig";

export default function OrderPaymentSuccessPage() {
  const navigation = useNavigation();
  const route = useRoute();
  const params = route.params || {};
  const notify = useNotify();
  const [updateTransactionStatus] = useUpdateTransactionStatusMutation();
  const [status, setStatus] = useState("Đang xử lý giao dịch...");
  const [isProcessing, setIsProcessing] = useState(true);

  // Order Payment-specific parameters (lowercase)
  const encryptedTransactionId = params.transactionId;
  const encryptedOrderDepositId = params.orderDepositId;

  // Decrypt transaction ID
  const { data: transactionIdData, isLoading: isTransactionIdLoading } =
    useDecryptDataQuery(encryptedTransactionId, {
      skip: !encryptedTransactionId,
    });

  // Decrypt order deposit ID
  const { data: orderDepositIdData, isLoading: isOrderDepositIdLoading } =
    useDecryptDataQuery(encryptedOrderDepositId, {
      skip: !encryptedOrderDepositId,
    });

  useEffect(() => {
    handleOrderPaymentSuccess();
  }, [
    transactionIdData,
    orderDepositIdData,
    isTransactionIdLoading,
    isOrderDepositIdLoading,
  ]);

  const handleOrderPaymentSuccess = async () => {
    if (!encryptedTransactionId || !encryptedOrderDepositId) {
      setStatus("Thông tin giao dịch không hợp lệ");
      setIsProcessing(false);
      navigation.replace("CustomerServiceOrders");
      return;
    }

    if (isTransactionIdLoading || isOrderDepositIdLoading) {
      setStatus("Đang giải mã thông tin giao dịch...");
      return;
    }

    try {
      setStatus("Đang cập nhật trạng thái giao dịch...");
      // Update transaction status
      await updateTransactionStatus({
        transactionId: parseInt(transactionIdData?.data),
        status: true,
      }).unwrap();

      setStatus("Giao dịch hoàn tất!");
      setIsProcessing(false);

      navigation.replace("Success", {
        title: "Thanh toán thành công",
        desc: "Thanh toán đặt cọc đã được xử lý thành công",
        path: "CustomerServiceOrders",
        buttonText: "Xem danh sách đơn hàng",
      });
    } catch (error) {
      setStatus("Có lỗi xảy ra, vui lòng thử lại sau");
      setIsProcessing(false);
      notify(
        "Cập nhật thất bại",
        error?.data?.message || "Có lỗi xảy ra, vui lòng thử lại sau",
        "error"
      );
      navigation.replace("CustomerServiceOrders");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.iconContainer}>
          {isProcessing ? (
            <ActivityIndicator size="large" color="white" />
          ) : (
            <Ionicons name="sync" size={50} color="white" />
          )}
        </View>

        <Text style={styles.heading}>{status}</Text>

        <Text style={styles.description}>
          {isProcessing
            ? "Vui lòng đợi trong giây lát, chúng tôi đang xử lý giao dịch của bạn"
            : status == "Giao dịch hoàn tất!"
            ? "Chuyển hướng bạn đến trang thành công..."
            : "Chuyển hướng bạn về trang đơn hàng..."}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 24,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignItems: "center",
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: appColorTheme.brown_2,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    color: appColorTheme.brown_2,
    textAlign: "center",
    marginBottom: 16,
    fontFamily: "Montserrat",
  },
  description: {
    fontSize: 14,
    color: "#718096",
    textAlign: "center",
    maxWidth: 300,
  },
});
