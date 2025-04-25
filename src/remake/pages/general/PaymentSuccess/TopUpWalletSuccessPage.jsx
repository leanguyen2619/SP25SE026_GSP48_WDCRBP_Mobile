import { useEffect, useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useUpdateWalletMutation } from "../../../services/walletApi";
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
import useAuth from "../../../hooks/useAuth";

export default function TopUpWalletSuccessPage() {
  const navigation = useNavigation();
  const route = useRoute();
  const { auth } = useAuth();
  const notify = useNotify();
  const [updateWallet] = useUpdateWalletMutation();
  const [updateTransactionStatus] = useUpdateTransactionStatusMutation();
  const [status, setStatus] = useState("Đang xử lý giao dịch...");
  const [isProcessing, setIsProcessing] = useState(true);

  // Wallet-specific parameters
  const encryptedTransactionId = route.params?.TransactionId;
  const encryptedWalletId = route.params?.WalletId;
  const amount = route.params?.vnp_Amount;

  // Decrypt wallet data
  const { data: walletIdData, isLoading: isWalletIdLoading } =
    useDecryptDataQuery(encryptedWalletId, {
      skip: !encryptedWalletId,
    });

  // Decrypt transaction ID
  const { data: transactionIdData, isLoading: isTransactionIdLoading } =
    useDecryptDataQuery(encryptedTransactionId, {
      skip: !encryptedTransactionId,
    });

  useEffect(() => {
    handleWalletPaymentSuccess();
  }, [
    walletIdData,
    transactionIdData,
    isWalletIdLoading,
    isTransactionIdLoading,
  ]);

  const handleWalletPaymentSuccess = async () => {
    if (!encryptedWalletId || !encryptedTransactionId || !amount) {
      setStatus("Thông tin giao dịch không hợp lệ");
      setIsProcessing(false);
      navigation.replace(
        auth?.role === "Woodworker" ? "WWWallet" : "CustomerWallet"
      );
      return;
    }

    if (isWalletIdLoading || isTransactionIdLoading) {
      setStatus("Đang giải mã thông tin giao dịch...");
      return;
    }

    try {
      setStatus("Đang cập nhật số dư ví...");
      // Cập nhật số dư ví
      await updateWallet({
        walletId: parseInt(walletIdData?.data),
        amount: Math.floor(parseInt(amount) / 100),
      }).unwrap();

      setStatus("Đang cập nhật trạng thái giao dịch...");
      // Cập nhật trạng thái giao dịch
      await updateTransactionStatus({
        transactionId: parseInt(transactionIdData?.data),
        status: true,
      }).unwrap();

      setStatus("Giao dịch hoàn tất!");
      setIsProcessing(false);

      navigation.replace("Success", {
        title: "Thanh toán thành công",
        desc: "Giao dịch đã được thực hiện thành công",
        path: auth?.role === "Woodworker" ? "WWWallet" : "CustomerWallet",
        buttonText: "Xem ví",
      });
    } catch (error) {
      setStatus("Có lỗi xảy ra, vui lòng thử lại sau");
      setIsProcessing(false);
      notify(
        "Cập nhật thất bại",
        error?.data?.message || "Có lỗi xảy ra, vui lòng thử lại sau",
        "error"
      );
      navigation.replace(
        auth?.role === "Woodworker" ? "WWWallet" : "CustomerWallet"
      );
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
            : "Chuyển hướng bạn về trang ví..."}
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
