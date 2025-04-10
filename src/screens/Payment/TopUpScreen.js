// screens/TopUpScreen.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { useDispatch } from 'react-redux';
import { topUpWallet } from '../redux/slice/paymentSlice';
import { useAuth } from '../context/AuthContext';

const TopUpScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { userId } = useAuth();

  const handleTopUp = async () => {
    const payload = {
      userId: userId,
      walletId: 'WALLET-ID-HERE', // get from Redux wallet data
      transactionType: 'TOP_UP',
      amount: 500000, // or from input
      email: 'user@example.com',
      returnUrl: 'myapp://payment-success', // use a deep link or just navigate manually
    };

    const res = await dispatch(topUpWallet(payload));

    if (res.meta.requestStatus === 'fulfilled') {
      const redirectUrl = res.payload.url; // <- URL from backend response
      await WebBrowser.openBrowserAsync(redirectUrl);
    } else {
      alert('Giao dịch thất bại: ' + res.payload);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Xác nhận nạp tiền</Text>
      <TouchableOpacity style={styles.button} onPress={handleTopUp}>
        <Text style={styles.buttonText}>Nạp 500.000₫ qua VNPay</Text>
      </TouchableOpacity>
    </View>
  );
};

export default TopUpScreen;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24 },
  title: { fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 24 },
  button: {
    backgroundColor: '#28a745',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
