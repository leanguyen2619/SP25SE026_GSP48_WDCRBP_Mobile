import React from "react";
import { View, Text, StyleSheet, SafeAreaView } from "react-native";
import { appColorTheme } from "../../../../config/appconfig";
import GuaranteeOrderList from "./GuaranteeOrderList.jsx";
import WoodworkerLayout from "../../../../layouts/WoodworkerLayout";

export default function WWGuaranteeOrderListPage() {
  return (
    <WoodworkerLayout>
      <SafeAreaView style={styles.container}>
        <GuaranteeOrderList />
      </SafeAreaView>
    </WoodworkerLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  titleContainer: {
    marginBottom: 24,
  },
  title: {
    color: appColorTheme.brown_2,
    fontSize: 20,
    fontWeight: "bold",
    fontFamily: "Montserrat",
  },
});
