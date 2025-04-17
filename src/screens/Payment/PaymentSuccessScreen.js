import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';
import { updateTransaction } from '../../redux/slice/transactionSlice';
import { updateWallet } from '../../redux/slice/walletSlice';
import { useAuth } from '../../context/AuthContext';

const PaymentSuccessScreen = ({ route, navigation }) => {
  const dispatch = useDispatch();
  const { userToken } = useAuth();

  const params = route.params || {};
  const getParam = (key) => params[key] || params[key.charAt(0).toUpperCase() + key.slice(1)];

  const transactionId = parseInt(getParam('transactionId'), 10);
  const walletId = getParam('walletId');
  const amount = parseInt(getParam('amount'), 10); // ensure it's a number
  const orderDepositId = getParam('orderDepositId');
  const woodworkerId = getParam('woodworkerId');
  const servicePackId = getParam('servicePackId');

  // 🚀 Auto-fire APIs on mount
  useEffect(() => {
    console.log('🧪 transactionId:', transactionId); 
    if (transactionId) {
      console.log('🔄 Dispatching updateTransaction:', transactionId);
      dispatch(updateTransaction({ transactionId, status: true }))
        .unwrap()
        .then(res => console.log('✅ Transaction updated:', res))
        .catch(err => console.error('❌ Transaction update failed:', err));
    }
  
    if (walletId && amount && userToken) {
      console.log('💰 Dispatching updateWallet:', walletId, amount);
      dispatch(updateWallet({ walletId, amount, token: userToken }))
        .unwrap()
        .then(res => console.log('✅ Wallet updated:', res))
        .catch(err => console.error('❌ Wallet update failed:', err));
    }
  }, [transactionId, walletId, amount, userToken]);

  return (
    <View style={styles.container}>
      {/* 🔙 Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Wallet')}>
        <Ionicons name="arrow-back" size={22} color="#444" />
        <Text style={styles.backText}>Trở về Ví</Text>
      </TouchableOpacity>

      💸 Success Content
      <View style={styles.card}>
        <Text style={styles.successTitle}>🎉 Thanh toán thành công!</Text>

        <View style={styles.infoBox}>
          <Text style={styles.label}>Mã giao dịch:</Text>
          <Text style={styles.value}>{transactionId}</Text>
        </View>

        {walletId && (
          <View style={styles.infoBox}>
            <Text style={styles.label}>Ví ID:</Text>
            <Text style={styles.value}>{walletId}</Text>
          </View>
        )}

        {amount && (
          <View style={styles.infoBox}>
            <Text style={styles.label}>Số tiền:</Text>
            <Text style={[styles.value, { color: '#28a745', fontWeight: '700' }]}>
              {amount.toLocaleString('vi-VN')} ₫
            </Text>
          </View>
        )}

        {orderDepositId && (
          <View style={styles.infoBox}>
            <Text style={styles.label}>Mã cọc đơn hàng:</Text>
            <Text style={styles.value}>{orderDepositId}</Text>
          </View>
        )}

        {woodworkerId && (
          <View style={styles.infoBox}>
            <Text style={styles.label}>Thợ ID:</Text>
            <Text style={styles.value}>{woodworkerId}</Text>
          </View>
        )}

        {servicePackId && (
          <View style={styles.infoBox}>
            <Text style={styles.label}>Gói dịch vụ ID:</Text>
            <Text style={styles.value}>{servicePackId}</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f6f9',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backText: {
    marginLeft: 6,
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  successTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#28a745',
    marginBottom: 24,
    textAlign: 'center',
  },
  infoBox: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
  },
});

export default PaymentSuccessScreen;
