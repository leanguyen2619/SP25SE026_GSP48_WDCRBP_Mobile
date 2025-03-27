import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as ImagePicker from 'expo-image-picker';
import { appColorTheme } from '../../theme/colors';

const WoodworkerProfileScreen = () => {
  const navigation = useNavigation();
  const [isEditing, setIsEditing] = useState(false);
  const [workshopImage, setWorkshopImage] = useState(null);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      alert('Xin lỗi, chúng tôi cần quyền truy cập thư viện ảnh để thực hiện chức năng này!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: [ImagePicker.MediaType.Images],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setWorkshopImage(result.assets[0].uri);
    }
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Icon name="arrow-back" size={24} color={appColorTheme.primary} />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Quản lý Hồ sơ</Text>
      <View style={styles.placeholder} />
    </View>
  );

  const renderServiceInfo = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Thông tin gói dịch vụ</Text>
        <TouchableOpacity 
          style={styles.upgradeButton}
          onPress={() => navigation.navigate('Pricing')}
        >
          <Text style={styles.upgradeButtonText}>Mua gói mới</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.serviceDetails}>
        <View style={styles.serviceRow}>
          <Text style={styles.serviceLabel}>Loại gói:</Text>
          <Text style={[styles.serviceValue, { color: '#FFD700' }]}>VÀNG</Text>
        </View>
        <View style={styles.serviceRow}>
          <Text style={styles.serviceLabel}>Ngày bắt đầu:</Text>
          <Text style={styles.serviceValue}>2024-03-01 12:00</Text>
        </View>
        <View style={styles.serviceRow}>
          <Text style={styles.serviceLabel}>Ngày kết thúc:</Text>
          <Text style={styles.serviceValue}>2024-06-01 12:00</Text>
        </View>
      </View>
    </View>
  );

  const renderRepresentativeInfo = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Thông tin người đại diện</Text>
      <View style={styles.infoDetails}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Họ và tên:</Text>
          <Text style={styles.infoValue}>Nguyễn Văn A</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Email:</Text>
          <Text style={styles.infoValue}>example@email.com</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Số điện thoại:</Text>
          <Text style={styles.infoValue}>0123456789</Text>
        </View>
      </View>
    </View>
  );

  const renderWorkshopInfo = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Thông tin xưởng mộc</Text>
      <View style={styles.infoDetails}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Tên thương hiệu:</Text>
          <Text style={styles.infoValue}>Xưởng Mộc A</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Loại hình kinh doanh:</Text>
          <Text style={styles.infoValue}>Cá nhân</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Địa chỉ xưởng:</Text>
          <Text style={styles.infoValue}>123 Đường ABC, Quận 1, TP.HCM</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Mã số thuế:</Text>
          <Text style={styles.infoValue}>123456789</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Giới thiệu:</Text>
          <Text style={styles.infoValue}>Xưởng mộc chuyên sản xuất nội thất cao cấp</Text>
        </View>
      </View>
    </View>
  );

  const renderWorkshopImage = () => (
    <View style={styles.imageSection}>
      <Text style={styles.sectionTitle}>Ảnh đại diện cho xưởng</Text>
      <View style={styles.imageContainer}>
        {workshopImage ? (
          <View style={styles.imageWrapper}>
            <Image source={{ uri: workshopImage }} style={styles.workshopImage} />
            <TouchableOpacity 
              style={styles.removeImageButton}
              onPress={() => setWorkshopImage(null)}
            >
              <Icon name="close" size={20} color={appColorTheme.text.inverse} />
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity 
            style={styles.uploadButton}
            onPress={pickImage}
          >
            <Icon name="add-photo-alternate" size={40} color={appColorTheme.text.secondary} />
            <Text style={styles.uploadText}>Thêm ảnh đại diện cho xưởng</Text>
            <Text style={styles.uploadSubtext}>Định dạng: JPG, PNG</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}
      <ScrollView style={styles.content}>
        {renderWorkshopImage()}
        {renderServiceInfo()}
        {renderRepresentativeInfo()}
        {renderWorkshopInfo()}
        <TouchableOpacity 
          style={styles.updateButton}
          onPress={() => setIsEditing(true)}
        >
          <Text style={styles.updateButtonText}>Cập nhật thông tin</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appColorTheme.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: appColorTheme.surface,
    borderBottomWidth: 1,
    borderBottomColor: appColorTheme.border.light,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: appColorTheme.primary,
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    backgroundColor: appColorTheme.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: appColorTheme.shadow.color,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: appColorTheme.shadow.opacity,
    shadowRadius: 3,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: appColorTheme.primary,
    marginBottom: 16,
  },
  upgradeButton: {
    backgroundColor: appColorTheme.secondary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  upgradeButtonText: {
    color: appColorTheme.text.inverse,
    fontSize: 14,
    fontWeight: '600',
  },
  serviceDetails: {
    backgroundColor: appColorTheme.surface,
  },
  serviceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  serviceLabel: {
    fontSize: 14,
    color: appColorTheme.text.secondary,
  },
  serviceValue: {
    fontSize: 14,
    color: appColorTheme.text.primary,
    fontWeight: '500',
  },
  infoDetails: {
    backgroundColor: appColorTheme.surface,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: appColorTheme.text.secondary,
    flex: 1,
  },
  infoValue: {
    fontSize: 14,
    color: appColorTheme.text.primary,
    flex: 2,
    textAlign: 'right',
  },
  updateButton: {
    backgroundColor: appColorTheme.primary,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 16,
  },
  updateButtonText: {
    color: appColorTheme.text.inverse,
    fontSize: 16,
    fontWeight: '600',
  },
  imageSection: {
    backgroundColor: appColorTheme.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: appColorTheme.shadow.color,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: appColorTheme.shadow.opacity,
    shadowRadius: 3,
    elevation: 3,
  },
  imageContainer: {
    marginTop: 8,
  },
  imageWrapper: {
    position: 'relative',
    width: '100%',
    height: 200,
    borderRadius: 8,
    overflow: 'hidden',
  },
  workshopImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  removeImageButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 12,
    padding: 4,
  },
  uploadButton: {
    width: '100%',
    height: 200,
    borderWidth: 2,
    borderColor: appColorTheme.border.light,
    borderStyle: 'dashed',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: appColorTheme.grey_0,
  },
  uploadText: {
    fontSize: 16,
    color: appColorTheme.text.secondary,
    marginTop: 8,
  },
  uploadSubtext: {
    fontSize: 14,
    color: appColorTheme.text.tertiary,
    marginTop: 4,
  },
});

export default WoodworkerProfileScreen; 