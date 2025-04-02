import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Image,
  Dimensions,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { appColorTheme } from '../../theme/colors';
import { useNavigation, useRoute } from '@react-navigation/native';
import { adminService } from '../../services/adminService';

const { width } = Dimensions.get('window');

const WoodworkerRegistrationDetail = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { registration } = route.params;

  const [note, setNote] = useState('');
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [actionType, setActionType] = useState(null);

  const handleShowConfirmModal = (type) => {
    if (!isConfirmed) {
      Alert.alert('Thông báo', 'Vui lòng xác nhận đã kiểm tra thông tin đăng ký');
      return;
    }
    if (type === 'REJECTED' && !note.trim()) {
      Alert.alert('Thông báo', 'Vui lòng nhập lý do từ chối');
      return;
    }
    setActionType(type);
    setShowConfirmModal(true);
  };

  const handleUpdateStatus = async (status) => {
    try {
      const response = await adminService.updateWoodworkerStatus(
        registration.woodworkerId,
        status === 'APPROVED',
        note
      );
      
      if (response?.updateAt) {
        Alert.alert(
          'Thành công',
          `${status === 'APPROVED' ? 'Tài khoản đã được duyệt thành công' : 'Đã từ chối đơn đăng ký thành công'}`,
          [
            {
              text: 'OK',
              onPress: () => {
                // Truyền status mới về trang dashboard
                navigation.navigate('WoodworkerRegistrationManagement', {
                  updatedRegistration: {
                    ...registration,
                    status: status,
                    updatedAt: response.updateAt
                  }
                });
              }
            }
          ]
        );
      }
    } catch (error) {
      console.error('Update status error:', error);
      Alert.alert(
        'Lỗi',
        error.response?.data?.message || 'Không thể cập nhật trạng thái đơn đăng ký'
      );
    } finally {
      setShowConfirmModal(false);
    }
  };

  const ConfirmModal = () => (
    <Modal
      visible={showConfirmModal}
      transparent
      animationType="fade"
      onRequestClose={() => setShowConfirmModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>
            {actionType === 'APPROVED' ? 'Xác nhận duyệt?' : 'Xác nhận từ chối?'}
          </Text>
          
          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.modalButton, styles.closeButton]}
              onPress={() => setShowConfirmModal(false)}
            >
              <Text style={styles.buttonText}>Đóng</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.modalButton, styles.rejectButton]}
              onPress={() => handleUpdateStatus('REJECTED')}
            >
              <Text style={styles.buttonText}>Từ chối</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.modalButton, styles.approveButton]}
              onPress={() => handleUpdateStatus('APPROVED')}
            >
              <Text style={styles.buttonText}>Duyệt</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={appColorTheme.brown_0} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chi tiết đăng ký thợ mộc</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
      >
        {/* Ảnh đại diện */}
        {registration.imgUrl && (
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: registration.imgUrl }}
              style={styles.image}
              resizeMode="cover"
            />
          </View>
        )}

        {/* Thông tin cơ bản */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thông tin cơ bản</Text>
          <View style={styles.infoGroup}>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Mã thợ mộc:</Text>
              <Text style={styles.value}>{registration.woodworkerId || 'Không có'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Họ và tên:</Text>
              <Text style={styles.value}>{registration.fullName || 'Không có'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Email:</Text>
              <Text style={styles.value}>{registration.email || 'Không có'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Số điện thoại:</Text>
              <Text style={styles.value}>{registration.phone || 'Không có'}</Text>
            </View>
          </View>
        </View>

        {/* Thông tin xưởng mộc */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thông tin xưởng mộc</Text>
          <View style={styles.infoGroup}>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Tên thương hiệu:</Text>
              <Text style={styles.value}>{registration.brandName || 'Không có'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Loại hình kinh doanh:</Text>
              <Text style={styles.value}>{registration.businessType || 'Không có'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Mã số thuế:</Text>
              <Text style={styles.value}>{registration.taxCode || 'Không có'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Địa chỉ:</Text>
              <Text style={styles.value}>{registration.address || 'Không có'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Giới thiệu:</Text>
              <Text style={styles.value}>{registration.bio || 'Không có'}</Text>
            </View>
          </View>
        </View>

        {/* Ghi chú */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ghi chú</Text>
          <TextInput
            style={styles.noteInput}
            multiline
            numberOfLines={4}
            placeholder="Nhập ghi chú về việc duyệt/từ chối đăng ký"
            value={note}
            onChangeText={setNote}
          />
        </View>

        {/* Xác nhận thông tin */}
        <View style={styles.section}>
          <TouchableOpacity 
            style={styles.confirmationRow}
            onPress={() => setIsConfirmed(!isConfirmed)}
          >
            <View style={[styles.checkbox, isConfirmed && styles.checkboxChecked]}>
              {isConfirmed && (
                <Ionicons name="checkmark" size={16} color={appColorTheme.white_0} />
              )}
            </View>
            <Text style={styles.confirmationText}>
              Xác nhận đã kiểm tra thông tin đăng ký
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Footer Buttons */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.footerButton, styles.rejectButton]}
          onPress={() => handleShowConfirmModal('REJECTED')}
        >
          <Text style={styles.buttonText}>Từ chối</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.footerButton, styles.approveButton]}
          onPress={() => handleShowConfirmModal('APPROVED')}
        >
          <Text style={styles.buttonText}>Duyệt</Text>
        </TouchableOpacity>
      </View>

      <ConfirmModal />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appColorTheme.white_0,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingBottom: 80,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: appColorTheme.grey_1,
    backgroundColor: appColorTheme.white_0,
    elevation: 2,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    color: appColorTheme.black_0,
    textAlign: 'center',
  },
  headerRight: {
    width: 32,
  },
  imageContainer: {
    width: width,
    aspectRatio: 16/9,
    backgroundColor: appColorTheme.grey_1 + '20',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: appColorTheme.grey_1 + '20',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: appColorTheme.brown_0,
    marginBottom: 12,
  },
  infoGroup: {
    gap: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  label: {
    width: 120,
    fontSize: 14,
    color: appColorTheme.grey_0,
  },
  value: {
    flex: 1,
    fontSize: 14,
    color: appColorTheme.black_0,
  },
  noteInput: {
    borderWidth: 1,
    borderColor: appColorTheme.grey_1,
    borderRadius: 8,
    padding: 12,
    minHeight: 100,
    textAlignVertical: 'top',
    fontSize: 14,
  },
  confirmationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: appColorTheme.brown_0,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: appColorTheme.brown_0,
  },
  confirmationText: {
    flex: 1,
    fontSize: 14,
    color: appColorTheme.black_0,
  },
  footer: {
    position: 'fixed',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    backgroundColor: appColorTheme.white_0,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
    gap: 16,
    borderTopWidth: 1,
    borderTopColor: appColorTheme.grey_1,
    elevation: 8,
    zIndex: 999,
  },
  footerButton: {
    flex: 1,
    height: 45,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rejectButton: {
    backgroundColor: '#FF4D4F',
  },
  approveButton: {
    backgroundColor: '#52C41A',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: appColorTheme.white_0,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: appColorTheme.white_0,
    borderRadius: 12,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: appColorTheme.black_0,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  modalButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  closeButton: {
    backgroundColor: appColorTheme.grey_1,
  },
});

export default WoodworkerRegistrationDetail; 