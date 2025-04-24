import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import {
  useRoute,
  useNavigation,
  useFocusEffect,
} from "@react-navigation/native";
import RootLayout from "../../../layouts/RootLayout.jsx";
import TopUpWalletSuccessPage from "./TopUpWalletSuccessPage.jsx";
import BuyPackSuccessPage from "./BuyPackSuccessPage.jsx";
import OrderPaymentSuccessPage from "./OrderPaymentSuccessPage.jsx";
import { Linking } from "react-native";

export default function PaymentSuccessPage() {
  const route = useRoute();
  const navigation = useNavigation();
  const params = route.params || {};

  // Service Pack-specific parameters (uppercase)
  const encryptedWoodworkerId = params.WoodworkerId;
  const encryptedServicePackId = params.ServicePackId;

  // Order Payment-specific parameters (lowercase)
  const encryptedOrderDepositId = params.orderDepositId;
  const encryptedTransactionId = params.transactionId;

  // Lắng nghe URL từ deep linking nếu không có tham số truyền trực tiếp từ route
  useEffect(() => {
    const handleDeepLink = (event) => {
      const url = event.url;
      if (url) {
        // Phân tích URL để lấy các tham số
        const urlObj = new URL(url);
        const params = urlObj.searchParams;

        // Cập nhật các tham số cần thiết từ URL nếu có
        if (params.has("orderDepositId") && params.has("transactionId")) {
          // Chuyển hướng đến trang này với các tham số mới
          navigation.setParams({
            orderDepositId: params.get("orderDepositId"),
            transactionId: params.get("transactionId"),
          });
        }
      }
    };

    // Đăng ký listener cho deep linking
    const subscription = Linking.addEventListener("url", handleDeepLink);

    // Kiểm tra initial URL khi app khởi động từ deep link
    Linking.getInitialURL().then((url) => {
      if (url) {
        const urlObj = new URL(url);
        const params = urlObj.searchParams;

        if (params.has("orderDepositId") && params.has("transactionId")) {
          navigation.setParams({
            orderDepositId: params.get("orderDepositId"),
            transactionId: params.get("transactionId"),
          });
        }
      }
    });

    return () => {
      // Hủy đăng ký listener khi unmount
      subscription.remove();
    };
  }, []);

  // Determine transaction type based on parameters
  const isServicePackTransaction =
    !!encryptedWoodworkerId && !!encryptedServicePackId;
  const isOrderPaymentTransaction =
    !!encryptedOrderDepositId && !!encryptedTransactionId;

  // Render appropriate component based on parameters
  const renderContent = () => {
    if (isServicePackTransaction) {
      return <BuyPackSuccessPage />;
    } else if (isOrderPaymentTransaction) {
      return <OrderPaymentSuccessPage />;
    } else {
      return <TopUpWalletSuccessPage />;
    }
  };

  return (
    <RootLayout>
      <View style={styles.container}>{renderContent()}</View>
    </RootLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
