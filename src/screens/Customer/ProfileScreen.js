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

  const transactions = [
    {
      id: 'GD001',
      type: 'Nạp ví',
      amount: '1.000.000 đ',
      description: 'Nạp tiền qua ngân hàng',
      date: '27/03/2024 10:00',
      status: 'Thành công'
    },
    // Thêm các giao dịch khác ở đây
  ];

  const handleSave = () => {
    setIsEditing(false);
    // Tại đây sẽ thêm logic lưu thông tin vào backend
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
            <TouchableOpacity style={styles.depositButton}>
              <Icon name="add" size={20} color={appColorTheme.white_0} />
              <Text style={styles.buttonText}>Nạp tiền</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.withdrawButton}>
              <Icon name="remove" size={20} color={appColorTheme.white_0} />
              <Text style={styles.buttonText}>Rút tiền</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.transactionSection}>
            <Text style={styles.sectionTitle}>Các khoản giao dịch</Text>
            <View style={styles.transactionHeader}>
              <Text style={styles.columnHeader}>Mã giao dịch</Text>
              <Text style={styles.columnHeader}>Loại giao dịch</Text>
              <Text style={styles.columnHeader}>Số tiền</Text>
              <Text style={styles.columnHeader}>Mô tả</Text>
              <Text style={styles.columnHeader}>Ngày tạo</Text>
              <Text style={styles.columnHeader}>Trạng thái</Text>
              <Text style={styles.columnHeader}>Thao tác</Text>
            </View>
            {transactions.map((transaction) => (
              <View key={transaction.id} style={styles.transactionRow}>
                <Text style={styles.transactionCell}>{transaction.id}</Text>
                <Text style={[styles.transactionCell, styles.typeCell]}>
                  {transaction.type}
                </Text>
                <Text style={styles.transactionCell}>{transaction.amount}</Text>
                <Text style={styles.transactionCell}>{transaction.description}</Text>
                <Text style={styles.transactionCell}>{transaction.date}</Text>
                <Text style={[styles.transactionCell, styles.statusCell]}>
                  {transaction.status}
                </Text>
                <TouchableOpacity style={styles.viewButton}>
                  <Icon name="visibility" size={20} color={appColorTheme.brown_0} />
                </TouchableOpacity>
              </View>
            ))}
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: appColorTheme.white_0,
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: appColorTheme.brown_0,
  },
  closeButton: {
    padding: 4,
  },
  balanceSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  balanceLabel: {
    fontSize: 16,
    color: appColorTheme.grey_1,
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: appColorTheme.brown_0,
  },
  bankInfoSection: {
    marginBottom: 24,
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
    backgroundColor: appColorTheme.black_0,
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
    backgroundColor: appColorTheme.brown_2,
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
  transactionHeader: {
    flexDirection: 'row',
    backgroundColor: appColorTheme.brown_0 + '10',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  columnHeader: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
    color: appColorTheme.brown_0,
  },
  transactionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: appColorTheme.grey_1,
  },
  transactionCell: {
    flex: 1,
    fontSize: 12,
    color: appColorTheme.black_0,
  },
  typeCell: {
    color: '#4CAF50',
  },
  statusCell: {
    color: '#4CAF50',
    fontWeight: '500',
  },
  viewButton: {
    padding: 4,
  },
});

export default ProfileScreen;
