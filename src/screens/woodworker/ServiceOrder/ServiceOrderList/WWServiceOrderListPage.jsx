import React from "react";
import { View, StyleSheet } from "react-native";
import ServiceOrderList from "./ServiceOrderList.jsx";
import WoodworkerLayout from "../../../../layouts/WoodworkerLayout";

export default function WWServiceOrderListPage() {
  return (
    <WoodworkerLayout>
      <View style={styles.container}>
        <ServiceOrderList />
      </View>
    </WoodworkerLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
});
