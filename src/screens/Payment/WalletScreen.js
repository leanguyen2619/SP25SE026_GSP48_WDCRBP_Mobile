import React, { useEffect, useState, useRef } from 'react';
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
import { fetchUserTransactions } from '../../redux/slice/transactionSlice';
import { fetchUserById } from '../../redux/slice/userSlice';

const WalletScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const linkTo = useLinkTo();
  const { userId, userToken } = useAuth();
  const { wallet, status, error } = useSelector((state) => state.wallet);
  const { transactions } = useSelector((state) => state.transaction);
  const { profile } = useSelector((state) => state.user);

  const [isModalVisible, setModalVisible] = useState(false);
  const [transactionType, setTransactionType] = useState('TOP_UP');
  const [amount, setAmount] = useState('');
  const [rawAmount, setRawAmount] = useState(0);

  const amountRef = useRef(null);

  useEffect(() => {
    if (userId && userToken) {
      dispatch(fetchWallet({ userId, token: userToken }));
      dispatch(fetchUserTransactions({ userId }));
      dispatch(fetchUserById(userId));
    }

    const handleDeepLink = ({ url }) => {
      const parsed = Linking.parse(url);
      const { path, queryParams } = parsed;

      if (path === 'payment-success') {
        navigation.navigate('PaymentSuccess', {
          transactionId: queryParams.TransactionId,
          walletId: queryParams.WalletId,
          amount: queryParams.Amount || amountRef.current,
        });
      }
    };

    const subscription = Linking.addEventListener('url', handleDeepLink);
    Linking.getInitialURL().then((url) => {
      if (url) handleDeepLink({ url });
    });

    return () => subscription.remove();
  }, [dispatch, userId, userToken, navigation]);

  const handleAmountChange = (text) => {
    const numeric = text.replace(/\D/g, '');
    const value = parseInt(numeric || '0', 10);

    if (value > 100000000) {
      Alert.alert('Giới hạn', 'Số tiền tối đa là 100.000.000 VND');
      return;
    }

    setRawAmount(value);
    setAmount(value.toLocaleString('vi-VN'));
  };

  const handleTopUp = async () => {
    if (!wallet?.walletId) {
      Alert.alert('Lỗi', 'Không tìm thấy thông tin ví');
      return;
    }

    if (!transactionType || !rawAmount || !profile?.email) {
      Alert.alert('Thiếu thông tin', 'Vui lòng nhập đầy đủ các trường');
      return;
    }

    if (rawAmount > 100000000) {
      Alert.alert('Giới hạn', 'Số tiền tối đa là 100.000.000 VND');
      return;
    }

    setModalVisible(false);
    amountRef.current = rawAmount;

    const returnUrl = Linking.createURL('payment-success');

    const payload = {
      userId,
      walletId: wallet.walletId,
      transactionType,
      amount: rawAmount,
      email: profile.email,
      returnUrl,
    };

    const res = await dispatch(topUpWallet(payload));

    if (res.meta.requestStatus === 'fulfilled') {
      const { url } = res.payload;
      if (url) {
        const result = await WebBrowser.openAuthSessionAsync(url, returnUrl);
        if (result.type === 'dismiss') {
          Alert.alert('Đã hủy thanh toán');
        }
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
      <View style={styles.container}>
        <Text style={styles.sectionTitle}>Quản lý Ví</Text>

        <View style={styles.card}>
          <Text style={styles.label}>Số dư ví</Text>
          <Text style={styles.balance}>
            {(wallet?.balance ?? 0).toLocaleString('vi-VN')} VND
          </Text>

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.depositButton} onPress={() => setModalVisible(true)}>
              <Text style={styles.buttonText}>+ Nạp tiền</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={[styles.sectionTitle, { marginTop: 30 }]}>Các khoản giao dịch</Text>

        <View style={styles.transactionContainer}>
          {transactions.length === 0 ? (
            <View style={styles.transactionPlaceholder}>
              <Text style={styles.placeholderText}>Chưa có giao dịch nào để hiển thị.</Text>
            </View>
          ) : (
            <ScrollView
              style={styles.transactionScroll}
              contentContainerStyle={styles.transactionScrollContent}
              nestedScrollEnabled
              showsVerticalScrollIndicator={false}
            >
              {transactions.map((tx) => (
                <View key={tx.transactionId} style={styles.transactionItem}>
                  <Text style={styles.txDescription}>🔁 {tx.description}</Text>
                  <Text style={styles.txAmount}>
                    {tx.amount.toLocaleString('vi-VN')} ₫ ({tx.status ? '✅' : '❌'})
                  </Text>
                </View>
              ))}
            </ScrollView>
          )}
        </View>
      </View>

      {/* Modal */}
      <Modal visible={isModalVisible} animationType="slide" transparent>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Nạp tiền vào ví</Text>

            <Text style={styles.emailLabel}>Email:</Text>
            <Text style={styles.emailText}>
              {profile?.email ? profile.email : 'Đang tải...'}
            </Text>

            <TextInput
              placeholder="Số tiền (₫)"
              style={styles.input}
              value={amount}
              onChangeText={handleAmountChange}
              keyboardType="numeric"
            />
            <TextInput
              placeholder="Loại giao dịch"
              style={styles.input}
              value={transactionType}
              onChangeText={setTransactionType}
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: '#ccc' }]}
                onPress={() => setModalVisible(false)}
              >
                <Text>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.button,
                  {
                    backgroundColor:
                      rawAmount >= 100000000 || rawAmount <= 0 ? '#ccc' : '#28a745',
                  },
                ]}
                onPress={handleTopUp}
                disabled={rawAmount >= 100000000 || rawAmount <= 0}
              >
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

const styles = StyleSheet.create({
  pageContainer: { paddingTop: 20, flex: 1, backgroundColor: '#fff' },
  container: { padding: 20, paddingBottom: 80, flex: 1 },
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

  transactionContainer: {
    flex: 1,
    marginTop: 10,
    marginBottom: 20,
  },
  transactionScroll: {
    flexGrow: 1,
  },
  transactionScrollContent: {
    paddingBottom: 20,
  },
  transactionItem: {
    backgroundColor: '#fff',
    padding: 12,
    marginVertical: 6,
    borderRadius: 8,
    borderColor: '#eee',
    borderWidth: 1,
  },
  transactionPlaceholder: {
    padding: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fafafa',
    alignItems: 'center',
  },
  placeholderText: { color: '#999', fontStyle: 'italic' },
  txDescription: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  txAmount: {
    fontSize: 14,
    color: '#28a745',
    marginTop: 4,
  },
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
  emailLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
    color: '#444',
  },
  emailText: {
    fontSize: 16,
    color: '#000',
    marginBottom: 12,
    padding: 10,
    backgroundColor: '#f2f2f2',
    borderRadius: 6,
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

export default WalletScreen;
