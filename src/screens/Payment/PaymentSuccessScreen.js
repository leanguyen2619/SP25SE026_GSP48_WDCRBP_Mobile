// screens/PaymentSuccessScreen.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const PaymentSuccessScreen = () => (
  <View style={styles.container}>
    <Text style={styles.title}>🎉 Thanh toán thành công!</Text>
  </View>
);

export default PaymentSuccessScreen;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 20, fontWeight: 'bold', color: 'green' },
});
