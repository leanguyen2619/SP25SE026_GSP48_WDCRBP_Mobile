import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { appColorTheme } from '../../theme/colors';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    avatar: 'https://www.shareicon.net/data/512x512/2016/05/24/770137_man_512x512.png',
    fullName: 'Nguyễn Văn A',
    phone: '0123456789',
    email: 'nguyenvana@gmail.com',
    address: '123 Đường ABC, Quận 1, TP.HCM',
  });
  const [isWalletVisible, setIsWalletVisible] = useState(false);
  const [isDepositVisible, setIsDepositVisible] = useState(false);
  const [isWithdrawVisible, setIsWithdrawVisible] = useState(false);
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');

  const transactions = [
    {
      id: 'GD001',
      type: 'Nạp ví',
      amount: '1.000.000 đ',
      description: 'Nạp tiền qua ngân hàng',
      date: '27/03/2024 10:00',
      status: 'Thành công'
    },
    {
      id: 'GD002',
      type: 'Nạp ví',
      amount: '2.000.000 đ',
      description: 'Nạp tiền qua ngân hàng',
      date: '26/03/2024 15:30',
      status: 'Thành công'
    },
    {
      id: 'GD003',
      type: 'Rút tiền',
      amount: '500.000 đ',
      description: 'Rút tiền về tài khoản',
      date: '25/03/2024 09:15',
      status: 'Thành công'
    },
    {
      id: 'GD004',
      type: 'Thanh toán',
      amount: '1.500.000 đ',
      description: 'Thanh toán đơn hàng #HD001',
      date: '24/03/2024 14:20',
      status: 'Thành công'
    },
    {
      id: 'GD005',
      type: 'Nạp ví',
      amount: '3.000.000 đ',
      description: 'Nạp tiền qua ngân hàng',
      date: '23/03/2024 11:45',
      status: 'Thành công'
    }
  ];

  const handleSave = () => {
    setIsEditing(false);
    // Tại đây sẽ thêm logic lưu thông tin vào backend
  };

  const formatCurrency = (text) => {
    // Xóa tất cả ký tự không phải số
    const number = text.replace(/[^0-9]/g, '');
    // Thêm dấu chấm phân cách hàng nghìn
    return number.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const handleDepositPress = () => {
    setIsDepositVisible(true);
    setIsWalletVisible(false);
  };

  const handleWithdrawPress = () => {
    setIsWithdrawVisible(true);
    setIsWalletVisible(false);
  };

  const renderEditButton = () => (
    <TouchableOpacity
      style={styles.editButton}
      onPress={() => setIsEditing(!isEditing)}
    >
      <Icon 
        name={isEditing ? "check" : "edit"} 
        size={24} 
        color={appColorTheme.white_0} 
      />
    </TouchableOpacity>
  );

  const renderField = (label, value, field) => (
    <View style={styles.fieldContainer}>
      <Text style={styles.fieldLabel}>{label}</Text>
      {isEditing ? (
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={(text) => setProfile({ ...profile, [field]: text })}
          placeholder={`Nhập ${label.toLowerCase()}`}
        />
      ) : (
        <Text style={styles.fieldValue}>{value}</Text>
      )}
    </View>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Icon name="arrow-back" size={24} color={appColorTheme.brown_0} />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Hồ sơ</Text>
      <TouchableOpacity 
        style={styles.walletButton}
        onPress={() => setIsWalletVisible(true)}
      >
        <Icon name="account-balance-wallet" size={24} color={appColorTheme.brown_0} />
      </TouchableOpacity>
    </View>
  );

  const renderWalletModal = () => (
    <Modal
      visible={isWalletVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setIsWalletVisible(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Quản lý ví</Text>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setIsWalletVisible(false)}
            >
              <Icon name="close" size={24} color={appColorTheme.grey_1} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalScrollView}>
            <View style={styles.balanceSection}>
              <Text style={styles.balanceLabel}>Số dư ví</Text>
              <Text style={styles.balanceAmount}>10.000.000 đ</Text>
            </View>

            <View style={styles.bankInfoSection}>
              <Text style={styles.sectionTitle}>Thông tin ngân hàng</Text>
              <View style={styles.bankInfoRow}>
                <Text style={styles.bankLabel}>Ngân hàng:</Text>
                <Text style={styles.bankValue}>Vietcombank</Text>
              </View>
              <View style={styles.bankInfoRow}>
                <Text style={styles.bankLabel}>Chủ tài khoản:</Text>
                <Text style={styles.bankValue}>NGUYEN VAN A</Text>
              </View>
              <View style={styles.bankInfoRow}>
                <Text style={styles.bankLabel}>Số tài khoản:</Text>
                <Text style={styles.bankValue}>123456789</Text>
              </View>
              <View style={styles.bankInfoRow}>
                <Text style={styles.bankLabel}>Chi nhánh:</Text>
                <Text style={styles.bankValue}>Ho Chi Minh City</Text>
              </View>
            </View>

            <View style={styles.buttonGroup}>
              <TouchableOpacity style={styles.depositButton} onPress={handleDepositPress}>
                <Icon name="add" size={20} color={appColorTheme.white_0} />
                <Text style={styles.buttonText}>Nạp tiền</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.withdrawButton} onPress={handleWithdrawPress}>
                <Icon name="remove" size={20} color={appColorTheme.white_0} />
                <Text style={styles.buttonText}>Rút tiền</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.transactionSection}>
              <Text style={[styles.sectionTitle, { color: '#F97316' }]}>Các khoản giao dịch</Text>
              <View style={styles.transactionList}>
                {transactions.map((transaction) => (
                  <View key={transaction.id} style={styles.transactionRow}>
                    <View style={styles.transactionInfo}>
                      <Text style={styles.transactionId}>{transaction.id}</Text>
                      <Text style={[styles.transactionType, { color: '#22C55E' }]}>
                        {transaction.type}
                      </Text>
                      <Text style={styles.transactionAmount}>{transaction.amount}</Text>
                      <Text style={styles.transactionDescription}>{transaction.description}</Text>
                      <Text style={styles.transactionDate}>{transaction.date}</Text>
                      <Text style={[styles.transactionStatus, { color: '#22C55E' }]}>
                        {transaction.status}
                      </Text>
                    </View>
                    <TouchableOpacity style={styles.viewButton}>
                      <Icon name="visibility" size={20} color="#F97316" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  const renderDepositModal = () => (
    <Modal
      visible={isDepositVisible}
      animationType="fade"
      transparent={true}
      onRequestClose={() => setIsDepositVisible(false)}
    >
      <View style={styles.depositModalContainer}>
        <View style={styles.depositModalContent}>
          <View style={styles.depositModalHeader}>
            <Text style={styles.depositModalTitle}>Nạp tiền</Text>
            <TouchableOpacity 
              onPress={() => setIsDepositVisible(false)}
              style={styles.depositCloseButton}
            >
              <Icon name="close" size={24} color="#000" />
            </TouchableOpacity>
          </View>

          <Text style={styles.depositLabel}>Số tiền nạp</Text>
          <TextInput
            style={styles.depositInput}
            value={depositAmount}
            onChangeText={(text) => {
              const formattedAmount = formatCurrency(text);
              setDepositAmount(formattedAmount);
            }}
            keyboardType="numeric"
            placeholder="0"
          />
          <Text style={styles.depositAmountText}>{depositAmount ? `${depositAmount} đ` : ''}</Text>

          <View style={styles.depositButtonGroup}>
            <TouchableOpacity 
              style={styles.depositCancelButton}
              onPress={() => setIsDepositVisible(false)}
            >
              <Text style={styles.depositCancelButtonText}>Hủy</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.depositConfirmButton}
              onPress={() => {
                // Xử lý logic nạp tiền ở đây
                setIsDepositVisible(false);
              }}
            >
              <Text style={styles.depositConfirmButtonText}>Nạp tiền</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  const renderWithdrawModal = () => (
    <Modal
      visible={isWithdrawVisible}
      animationType="fade"
      transparent={true}
      onRequestClose={() => setIsWithdrawVisible(false)}
    >
      <View style={styles.depositModalContainer}>
        <View style={styles.depositModalContent}>
          <View style={styles.depositModalHeader}>
            <Text style={styles.depositModalTitle}>Rút tiền</Text>
            <TouchableOpacity 
              onPress={() => setIsWithdrawVisible(false)}
              style={styles.depositCloseButton}
            >
              <Icon name="close" size={24} color="#000" />
            </TouchableOpacity>
          </View>

          <Text style={styles.currentBalanceText}>Số dư hiện tại: 10.000.000 đ</Text>

          <Text style={styles.depositLabel}>Số tiền rút</Text>
          <TextInput
            style={styles.depositInput}
            value={withdrawAmount}
            onChangeText={(text) => {
              const formattedAmount = formatCurrency(text);
              setWithdrawAmount(formattedAmount);
            }}
            keyboardType="numeric"
            placeholder="0"
          />
          <Text style={styles.depositAmountText}>{withdrawAmount ? `${withdrawAmount} đ` : ''}</Text>

          <View style={styles.depositButtonGroup}>
            <TouchableOpacity 
              style={styles.depositCancelButton}
              onPress={() => setIsWithdrawVisible(false)}
            >
              <Text style={styles.depositCancelButtonText}>Hủy</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.depositConfirmButton, { backgroundColor: '#9333EA' }]}
              onPress={() => {
                // Xử lý logic rút tiền ở đây
                setIsWithdrawVisible(false);
              }}
            >
              <Text style={styles.depositConfirmButtonText}>Rút tiền</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}

      <ScrollView style={styles.content}>
        <View style={styles.avatarContainer}>
          <Image
            source={{ uri: profile.avatar }}
            style={styles.avatar}
          />
          {isEditing && (
            <TouchableOpacity style={styles.changeAvatarButton}>
              <Icon name="camera-alt" size={20} color={appColorTheme.white_0} />
            </TouchableOpacity>
          )}
        </View>

        {renderField('Họ và tên', profile.fullName, 'fullName')}
        {renderField('Số điện thoại', profile.phone, 'phone')}
        {renderField('Email', profile.email, 'email')}
        {renderField('Địa chỉ', profile.address, 'address')}

        {isEditing && (
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Lưu thay đổi</Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      {renderEditButton()}
      {renderWalletModal()}
      {renderDepositModal()}
      {renderWithdrawModal()}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    backgroundColor: appColorTheme.white_0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: appColorTheme.white_0,
    borderBottomWidth: 1,
    borderBottomColor: appColorTheme.grey_1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: appColorTheme.brown_0,
  },
  backButton: {
    padding: 8,
  },
  walletButton: {
    padding: 8,
    },
    content: {
        flex: 1,
    padding: 16,
  },
  avatarContainer: {
    alignItems: 'center',
    marginVertical: 20,
    position: 'relative',
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: appColorTheme.brown_0,
  },
  changeAvatarButton: {
    position: 'absolute',
    right: '35%',
    bottom: 0,
    backgroundColor: appColorTheme.brown_0,
    padding: 8,
    borderRadius: 20,
    elevation: 2,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 14,
    color: appColorTheme.grey_1,
    marginBottom: 8,
  },
  fieldValue: {
    fontSize: 16,
    color: appColorTheme.black_0,
    paddingVertical: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: appColorTheme.grey_1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    color: appColorTheme.black_0,
  },
  editButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: appColorTheme.brown_0,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
  saveButton: {
    backgroundColor: appColorTheme.brown_0,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: appColorTheme.white_0,
    fontSize: 16,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: appColorTheme.white_0,
    borderRadius: 12,
    padding: 20,
    width: '100%',
    height: '100%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#F97316',
  },
  closeButton: {
    padding: 4,
  },
  modalScrollView: {
    flex: 1,
  },
  balanceSection: {
    alignItems: 'center',
    marginVertical: 24,
  },
  balanceLabel: {
    fontSize: 16,
    color: '#F97316',
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#F97316',
  },
  bankInfoSection: {
    marginBottom: 24,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: appColorTheme.brown_0,
    marginBottom: 16,
  },
  bankInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  bankLabel: {
    fontSize: 14,
    color: appColorTheme.black_0,
    flex: 1,
  },
  bankValue: {
    fontSize: 14,
    color: appColorTheme.black_0,
    fontWeight: '500',
    flex: 2,
    textAlign: 'right',
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  depositButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#000',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  withdrawButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#C65D34',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  buttonText: {
    color: appColorTheme.white_0,
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
  },
  transactionSection: {
    flex: 1,
  },
  transactionList: {
    marginTop: 10,
  },
  transactionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: '#fff',
  },
  transactionInfo: {
    flex: 1,
  },
  transactionId: {
    fontSize: 14,
    color: appColorTheme.black_0,
    marginBottom: 4,
  },
  transactionType: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  transactionAmount: {
    fontSize: 14,
    color: appColorTheme.black_0,
    marginBottom: 4,
  },
  transactionDescription: {
    fontSize: 14,
    color: appColorTheme.black_0,
    marginBottom: 4,
  },
  transactionDate: {
    fontSize: 12,
    color: appColorTheme.grey_1,
    marginBottom: 4,
  },
  transactionStatus: {
    fontSize: 14,
    fontWeight: '500',
  },
  viewButton: {
    alignItems: 'center',
    },
  depositModalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  depositModalContent: {
    backgroundColor: '#fff',
    width: '90%',
    borderRadius: 12,
    padding: 20,
  },
  depositModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  depositModalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  depositCloseButton: {
    padding: 4,
  },
  depositLabel: {
    fontSize: 16,
    color: '#000',
    marginBottom: 10,
  },
  depositInput: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 8,
  },
  depositAmountText: {
    fontSize: 16,
    color: '#F97316',
    textAlign: 'right',
    marginBottom: 20,
  },
  depositButtonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  depositCancelButton: {
    flex: 1,
    padding: 12,
    marginRight: 8,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  depositConfirmButton: {
    flex: 1,
    padding: 12,
    marginLeft: 8,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#22C55E',
  },
  depositCancelButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '500',
  },
  depositConfirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  currentBalanceText: {
    fontSize: 14,
    color: '#000',
    marginBottom: 20,
    },
});

export default ProfileScreen;
