import React from "react";
import { View, Text, StyleSheet } from "react-native";
import ServiceOrderList from "./ServiceOrderList.jsx";
import { appColorTheme } from "../../../../config/appconfig";

export default function CusServiceOrderListPage() {
  return (
    <View style={styles.container}>
      <ServiceOrderList />
    </View>
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
