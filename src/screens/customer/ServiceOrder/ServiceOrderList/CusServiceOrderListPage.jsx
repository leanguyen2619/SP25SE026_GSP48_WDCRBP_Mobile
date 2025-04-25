import React from "react";
import { View, Text, StyleSheet } from "react-native";
import ServiceOrderList from "./ServiceOrderList.jsx";
import { appColorTheme } from "../../../../config/appconfig";
import CustomerLayout from "../../../../layouts/CustomerLayout.jsx";

export default function CusServiceOrderListPage() {
  return (
    <CustomerLayout>
      <View style={styles.container}>
        <ServiceOrderList />
      </View>
    </CustomerLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  heading: {
    color: appColorTheme.brown_2,
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
});
