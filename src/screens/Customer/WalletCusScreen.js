import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWallet } from '../../redux/slice/walletSlice';
import { topUpWallet } from '../../redux/slice/paymentSlice';
import { useAuth } from '../../context/AuthContext';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import Footer from '../../components/common/footer/footer';
import { useLinkTo } from '@react-navigation/native';

const WalletCusScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const linkTo = useLinkTo();
  const { userId, userToken } = useAuth();
  const { wallet, status, error } = useSelector((state) => state.wallet);

  const [isModalVisible, setModalVisible] = useState(false);
  const [transactionType, setTransactionType] = useState('TOP_UP');
  const [amount, setAmount] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (userId && userToken) {
      dispatch(fetchWallet({ userId, token: userToken }));
    }

    // handle deep link from VNPay
    const subscription = Linking.addEventListener('url', handleDeepLink);
    return () => subscription.remove();
  }, [dispatch, userId, userToken]);

  const handleDeepLink = ({ url }) => {
    const path = Linking.parse(url).path;
    if (path === 'payment-success') {
      navigation.navigate('PaymentSuccessScreen');
    }
  };

  const handleTopUp = async () => {
    if (!wallet?.walletId) {
      Alert.alert('Lỗi', 'Không tìm thấy thông tin ví');
      return;
    }
  
    if (!transactionType || !amount || !email) {
      Alert.alert('Thiếu thông tin', 'Vui lòng nhập đầy đủ các trường');
      return;
    }
  
    const returnUrl = Linking.createURL('payment-success');
  
    const payload = {
      userId,
      walletId: wallet.walletId,
      transactionType,
      amount: parseInt(amount),
      email,
      returnUrl,
    };
  
    const res = await dispatch(topUpWallet(payload));
    setModalVisible(false);
  
    if (res.meta.requestStatus === 'fulfilled') {
      const { url } = res.payload;
      if (url) {
        // ✅ Use secure session-based browser flow
        const result = await WebBrowser.openAuthSessionAsync(url, returnUrl);
  
        if (result.type === 'dismiss') {
          Alert.alert('Đã hủy thanh toán');
        }
  
        // Optional: manually handle return if redirect is not caught
        // Linking.parse(result.url)?.path === 'payment-success' also works
      } else {
        Alert.alert('Lỗi', 'Không tìm thấy URL thanh toán');
      }
    } else {
      Alert.alert('Lỗi', res.payload || 'Giao dịch thất bại');
    }
  };

  if (status === 'loading') {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="orange" />
        <Text>Đang tải ví...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={{ color: 'red' }}>Lỗi: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.pageContainer}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.sectionTitle}>Quản lý Ví</Text>

        <View style={styles.card}>
          <Text style={styles.label}>Số dư ví</Text>
          <Text style={styles.balance}>{wallet?.balance ?? 0} ₫</Text>

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.depositButton} onPress={() => setModalVisible(true)}>
              <Text style={styles.buttonText}>+ Nạp tiền</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={[styles.sectionTitle, { marginTop: 30 }]}>Các khoản giao dịch</Text>

        <View style={styles.transactionPlaceholder}>
          <Text style={styles.placeholderText}>Chưa có giao dịch nào để hiển thị.</Text>
        </View>
      </ScrollView>

      {/* Modal */}
      <Modal visible={isModalVisible} animationType="slide" transparent>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Nạp tiền vào ví</Text>

            <TextInput
              placeholder="Email"
              style={styles.input}
              value={email}
              onChangeText={setEmail}
            />
            <TextInput
              placeholder="Số tiền (₫)"
              style={styles.input}
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
            />
            <TextInput
              placeholder="Loại giao dịch"
              style={styles.input}
              value={transactionType}
              onChangeText={setTransactionType}
            />

            <View style={styles.modalActions}>
              <TouchableOpacity style={[styles.button, { backgroundColor: '#ccc' }]} onPress={() => setModalVisible(false)}>
                <Text>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, { backgroundColor: '#28a745' }]} onPress={handleTopUp}>
                <Text style={{ color: '#fff' }}>Xác nhận</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Footer navigation={navigation} />
    </View>
  );
};

export default WalletCusScreen;

const styles = StyleSheet.create({
  pageContainer: { paddingTop: 20, flex: 1, backgroundColor: '#fff' },
  container: { padding: 20, paddingBottom: 80 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  sectionTitle: { fontSize: 20, fontWeight: '700', color: '#C65F1B', marginBottom: 12 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  label: { fontSize: 16, fontWeight: '600', marginBottom: 8 },
  balance: { fontSize: 24, fontWeight: 'bold', color: 'green', marginBottom: 16 },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-between' },
  depositButton: {
    flex: 1,
    backgroundColor: '#28a745',
    padding: 12,
    borderRadius: 8,
    marginRight: 10,
  },
  buttonText: { color: '#fff', fontWeight: '600', textAlign: 'center' },
  transactionPlaceholder: {
    marginTop: 10,
    padding: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fafafa',
    alignItems: 'center',
  },
  placeholderText: { color: '#999', fontStyle: 'italic' },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '85%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  button: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
});
