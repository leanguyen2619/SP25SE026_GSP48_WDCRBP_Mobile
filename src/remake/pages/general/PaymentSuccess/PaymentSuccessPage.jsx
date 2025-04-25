import React from "react";
import { View, StyleSheet } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import RootLayout from "../../../layouts/RootLayout.jsx";
import TopUpWalletSuccessPage from "./TopUpWalletSuccessPage.jsx";
import BuyPackSuccessPage from "./BuyPackSuccessPage.jsx";
import OrderPaymentSuccessPage from "./OrderPaymentSuccessPage.jsx";

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
