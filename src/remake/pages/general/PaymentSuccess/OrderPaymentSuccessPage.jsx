import { useEffect, useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useUpdateTransactionStatusMutation } from "../../../services/transactionApi";
import { useDecryptDataQuery } from "../../../services/decryptApi";
import { useNotify } from "../../../components/Utility/Notify";
import {
  View,
  ActivityIndicator,
  Text,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { appColorTheme } from "../../../config/appconfig";

export default function OrderPaymentSuccessPage() {
  const navigation = useNavigation();
  const route = useRoute();
  const notify = useNotify();
  const [updateTransactionStatus] = useUpdateTransactionStatusMutation();
  const [status, setStatus] = useState("Đang xử lý giao dịch...");
  const [isProcessing, setIsProcessing] = useState(true);

  // Order Payment-specific parameters (lowercase)
  const encryptedTransactionId = route.params?.transactionId;
  const encryptedOrderDepositId = route.params?.orderDepositId;

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
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <ActivityIndicator
            size="large"
            color="white"
            animating={isProcessing}
          />
        </View>

        <Text style={styles.heading}>{status}</Text>

        <Text style={styles.text}>
          {isProcessing
            ? "Vui lòng đợi trong giây lát, chúng tôi đang xử lý giao dịch của bạn"
            : status === "Giao dịch hoàn tất!"
            ? "Chuyển hướng bạn đến trang thành công..."
            : "Chuyển hướng bạn về trang đơn hàng..."}
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 0,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: appColorTheme.brown_2,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  heading: {
    color: appColorTheme.brown_2,
    fontFamily: "Montserrat",
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  text: {
    color: "#666",
    textAlign: "center",
    fontSize: 16,
    maxWidth: "90%",
  },
});
