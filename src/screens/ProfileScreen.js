import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { appColorTheme } from '../theme/colors';
import * as ImagePicker from 'expo-image-picker';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const [isEditing, setIsEditing] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [profileData, setProfileData] = useState({
    fullName: 'Nguyễn Văn A',
    phone: '0123 456 789',
    address: '123 Đường ABC, Quận XYZ, TP.HCM',
    email: 'example@email.com',
  });

  const handleImagePick = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled) {
        setAvatar(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể chọn ảnh. Vui lòng thử lại.');
    }
  };

  const handleSave = () => {
    // Tại đây sẽ thêm logic lưu thông tin vào backend
    setIsEditing(false);
    Alert.alert('Thành công', 'Đã cập nhật thông tin thành công!');
  };

  const renderEditButton = () => (
    <TouchableOpacity
      style={styles.editButton}
      onPress={() => setIsEditing(!isEditing)}
    >
      <Icon
        name={isEditing ? "close" : "edit"}
        size={24}
        color={appColorTheme.black_0}
      />
    </TouchableOpacity>
  );

  const renderField = (label, value, field) => (
    <View style={styles.fieldContainer}>
      <Text style={styles.fieldLabel}>{label}</Text>
      {isEditing ? (
        <TextInput
          style={styles.input}
          value={profileData[field]}
          onChangeText={(text) => setProfileData({ ...profileData, [field]: text })}
          placeholder={`Nhập ${label.toLowerCase()}`}
        />
      ) : (
        <Text style={styles.fieldValue}>{value}</Text>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={24} color={appColorTheme.black_0} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Hồ sơ cá nhân</Text>
        {renderEditButton()}
      </View>

      <ScrollView style={styles.content}>
        {/* Avatar Section */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarContainer}>
            <Image
              source={avatar 
                ? { uri: avatar }
                : { uri: 'https://via.placeholder.com/120x120' }
              }
              style={styles.avatar}
            />
            {isEditing && (
              <TouchableOpacity
                style={styles.cameraButton}
                onPress={handleImagePick}
              >
                <Icon name="camera-alt" size={20} color={appColorTheme.white_0} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Information Section */}
        <View style={styles.infoSection}>
          {renderField('Họ và tên', profileData.fullName, 'fullName')}
          {renderField('Số điện thoại', profileData.phone, 'phone')}
          {renderField('Địa chỉ', profileData.address, 'address')}
          {renderField('Email', profileData.email, 'email')}
        </View>

        {/* Action Buttons */}
        {isEditing && (
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSave}
          >
            <Text style={styles.saveButtonText}>Lưu thay đổi</Text>
          </TouchableOpacity>
        )}

        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionButton}>
            <Icon name="lock" size={24} color={appColorTheme.brown_1} />
            <Text style={styles.actionButtonText}>Đổi mật khẩu</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.actionButton, styles.logoutButton]}
            onPress={() => {
              Alert.alert(
                'Đăng xuất',
                'Bạn có chắc chắn muốn đăng xuất?',
                [
                  {
                    text: 'Hủy',
                    style: 'cancel',
                  },
                  {
                    text: 'Đăng xuất',
                    onPress: () => navigation.replace('Login'),
                    style: 'destructive',
                  },
                ],
                { cancelable: true }
              );
            }}
          >
            <Icon name="logout" size={24} color="#e74c3c" />
            <Text style={[styles.actionButtonText, styles.logoutText]}>
              Đăng xuất
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9ff',
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
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: appColorTheme.black_0,
  },
  editButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  avatarSection: {
    alignItems: 'center',
    padding: 20,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: appColorTheme.grey_1,
  },
  cameraButton: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: appColorTheme.brown_1,
    padding: 8,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: appColorTheme.white_0,
  },
  infoSection: {
    padding: 16,
    backgroundColor: appColorTheme.white_0,
    marginHorizontal: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  fieldContainer: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 14,
    color: appColorTheme.brown_1,
    marginBottom: 4,
  },
  fieldValue: {
    fontSize: 16,
    color: appColorTheme.black_0,
  },
  input: {
    fontSize: 16,
    color: appColorTheme.black_0,
    borderBottomWidth: 1,
    borderBottomColor: appColorTheme.grey_1,
    paddingVertical: 4,
  },
  saveButton: {
    backgroundColor: appColorTheme.brown_0,
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  saveButtonText: {
    color: appColorTheme.black_0,
    fontSize: 16,
    fontWeight: '600',
  },
  actionButtons: {
    padding: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: appColorTheme.white_0,
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  actionButtonText: {
    marginLeft: 12,
    fontSize: 16,
    color: appColorTheme.black_0,
  },
  logoutButton: {
    backgroundColor: '#fff8f8',
  },
  logoutText: {
    color: '#e74c3c',
  },
});

export default ProfileScreen; 