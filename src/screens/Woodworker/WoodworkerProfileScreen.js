import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as ImagePicker from 'expo-image-picker';
import { appColorTheme } from '../../theme/colors';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://10.0.2.2:8080'; // For Android Emulator
// const API_URL = 'http://localhost:8080'; // For web


const WoodworkerProfileScreen = () => {
  const navigation = useNavigation();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [woodworkerData, setWoodworkerData] = useState({
    woodworkerId: 0,
    brandName: "",
    bio: "",
    businessType: "",
    taxCode: "",
    imgUrl: null,
    address: "",
    wardCode: "",
    districtId: "",
    cityId: "",
    totalStar: 0,
    totalReviews: 0,
    servicePackStartDate: "",
    servicePackEndDate: "",
    user: {
      userId: 0,
      username: "",
      phone: "",
      email: "",
      role: ""
    },
    servicePack: {
      servicePackId: 0,
      name: "",
      price: 0,
      description: "",
      duration: 0,
      postLimitPerMonth: 0,
      productManagement: false,
      searchResultPriority: 0,
      personalization: false
    }
  });

  useEffect(() => {
    fetchWoodworkerData();
  }, []);

  const clearAndNavigateToLogin = async () => {
    try {
      await AsyncStorage.clear();
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (error) {
      console.error('Error clearing data:', error);
    }
  };

  const fetchWoodworkerData = async () => {
    try {
      setIsLoading(true);
      
      const allKeys = await AsyncStorage.getAllKeys();
      console.log('All AsyncStorage Keys:', allKeys);
      
      const token = await AsyncStorage.getItem('accessToken');
      const userId = await AsyncStorage.getItem('userId');
      const userRole = await AsyncStorage.getItem('userRole');

      // Log chi tiết từng giá trị
      console.log('Token exists:', !!token);
      console.log('UserId exists:', !!userId);
      console.log('UserRole value:', userRole);

      if (!token) {
        console.log('Token is missing');
        Alert.alert(
          'Lỗi xác thực',
          'Token không tồn tại, vui lòng đăng nhập lại',
          [{ text: 'OK', onPress: clearAndNavigateToLogin }]
        );
        return;
      }

      if (!userId) {
        console.log('UserId is missing');
        Alert.alert(
          'Lỗi xác thực',
          'UserId không tồn tại, vui lòng đăng nhập lại',
          [{ text: 'OK', onPress: clearAndNavigateToLogin }]
        );
        return;
      }

      if (userRole !== 'Woodworker') {
        console.log('Invalid user role:', userRole);
        Alert.alert(
          'Lỗi xác thực',
          'Tài khoản của bạn không phải là Woodworker',
          [{ text: 'OK', onPress: clearAndNavigateToLogin }]
        );
        return;
      }

      const response = await axios.get(`${API_URL}/api/v1/ww/user/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.data && response.data.data) {
        const responseData = response.data.data;
        
        // Kiểm tra xem dữ liệu trả về có khớp với thông tin đăng nhập không
        if (responseData.user.userId.toString() !== userId || 
            responseData.user.role !== 'Woodworker') {
          console.log('User data mismatch:', {
            storedUserId: userId,
            responseUserId: responseData.user.userId,
            storedRole: userRole,
            responseRole: responseData.user.role
          });
          Alert.alert(
            'Lỗi xác thực',
            'Thông tin người dùng không hợp lệ. Vui lòng đăng nhập lại.',
            [
              {
                text: 'OK',
                onPress: clearAndNavigateToLogin
              }
            ]
          );
          return;
        }
        
        setWoodworkerData(responseData);
      } else {
        console.log('Invalid API response format:', response.data);
        Alert.alert(
          'Lỗi',
          'Định dạng dữ liệu không hợp lệ',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      
      if (error.response?.status === 401) {
        Alert.alert(
          'Phiên đăng nhập hết hạn',
          'Vui lòng đăng nhập lại để tiếp tục',
          [
            {
              text: 'OK',
              onPress: clearAndNavigateToLogin
            }
          ]
        );
      } else {
        Alert.alert(
          'Lỗi',
          'Không thể tải thông tin xưởng mộc. Vui lòng thử lại sau.',
          [{ text: 'OK' }]
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      setIsLoading(true);
      const token = await AsyncStorage.getItem('accessToken');
      
      let imageUrl = woodworkerData.imgUrl;
      if (woodworkerData.imgUrl && woodworkerData.imgUrl.startsWith('file://')) {
        const formData = new FormData();
        formData.append('file', {
          uri: woodworkerData.imgUrl,
          type: 'image/jpeg',
          name: 'profile.jpg',
        });

        const uploadResponse = await axios.post(`${API_URL}/api/v1/upload`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        });
        imageUrl = uploadResponse.data.url;
      }

      const updateData = {
        ...woodworkerData,
        imgUrl: imageUrl,
      };

      await axios.put(`${API_URL}/api/v1/ww/${woodworkerData.woodworkerId}`, updateData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      Alert.alert('Thành công', 'Cập nhật thông tin thành công!');
      fetchWoodworkerData();
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert(
        'Lỗi',
        'Không thể cập nhật thông tin. Vui lòng thử lại sau.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoading(false);
      setIsEditing(false);
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      alert('Xin lỗi, chúng tôi cần quyền truy cập thư viện ảnh để thực hiện chức năng này!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setWoodworkerData(prev => ({
        ...prev,
        imgUrl: result.assets[0].uri
      }));
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.clear();
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (error) {
      console.error('Logout error:', error);
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
      <TouchableOpacity 
        style={styles.logoutButton}
        onPress={handleLogout}
      >
        <Icon name="logout" size={24} color={appColorTheme.primary} />
      </TouchableOpacity>
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
        {woodworkerData.servicePack ? (
          <>
            <View style={styles.serviceRow}>
              <Text style={styles.serviceLabel}>Tên gói:</Text>
              <Text style={[styles.serviceValue, { color: '#FFD700' }]}>{woodworkerData.servicePack.name}</Text>
            </View>
            <View style={styles.serviceRow}>
              <Text style={styles.serviceLabel}>Giá:</Text>
              <Text style={styles.serviceValue}>{woodworkerData.servicePack.price.toLocaleString('vi-VN')} VNĐ</Text>
            </View>
            <View style={styles.serviceRow}>
              <Text style={styles.serviceLabel}>Thời hạn (tháng):</Text>
              <Text style={styles.serviceValue}>{woodworkerData.servicePack.duration}</Text>
            </View>
            <View style={styles.serviceRow}>
              <Text style={styles.serviceLabel}>Giới hạn bài đăng/tháng:</Text>
              <Text style={styles.serviceValue}>{woodworkerData.servicePack.postLimitPerMonth}</Text>
            </View>
            <View style={styles.serviceRow}>
              <Text style={styles.serviceLabel}>Quản lý sản phẩm:</Text>
              <Text style={styles.serviceValue}>{woodworkerData.servicePack.productManagement ? 'Có' : 'Không'}</Text>
            </View>
            <View style={styles.serviceRow}>
              <Text style={styles.serviceLabel}>Độ ưu tiên tìm kiếm:</Text>
              <Text style={styles.serviceValue}>{woodworkerData.servicePack.searchResultPriority}</Text>
            </View>
            <View style={styles.serviceRow}>
              <Text style={styles.serviceLabel}>Cá nhân hóa:</Text>
              <Text style={styles.serviceValue}>{woodworkerData.servicePack.personalization ? 'Có' : 'Không'}</Text>
            </View>
            <View style={styles.serviceRow}>
              <Text style={styles.serviceLabel}>Ngày bắt đầu:</Text>
              <Text style={styles.serviceValue}>{woodworkerData.servicePackStartDate ? new Date(woodworkerData.servicePackStartDate).toLocaleDateString('vi-VN') : 'Chưa có'}</Text>
            </View>
            <View style={styles.serviceRow}>
              <Text style={styles.serviceLabel}>Ngày kết thúc:</Text>
              <Text style={styles.serviceValue}>{woodworkerData.servicePackEndDate ? new Date(woodworkerData.servicePackEndDate).toLocaleDateString('vi-VN') : 'Chưa có'}</Text>
            </View>
          </>
        ) : (
          <View style={styles.noServicePack}>
            <Text style={styles.noServicePackText}>Bạn chưa đăng ký gói dịch vụ nào</Text>
          </View>
        )}
      </View>
    </View>
  );

  const renderRepresentativeInfo = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Thông tin người đại diện</Text>
      <View style={styles.infoDetails}>
        {woodworkerData.user ? (
          <>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Tên đăng nhập:</Text>
              <Text style={styles.infoValue}>{woodworkerData.user.username}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Email:</Text>
              <Text style={styles.infoValue}>{woodworkerData.user.email}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Số điện thoại:</Text>
              <Text style={styles.infoValue}>{woodworkerData.user.phone}</Text>
            </View>
          </>
        ) : (
          <View style={styles.noUserInfo}>
            <Text style={styles.noUserInfoText}>Không có thông tin người đại diện</Text>
          </View>
        )}
      </View>
    </View>
  );

  const renderWorkshopInfo = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Thông tin xưởng mộc</Text>
      <View style={styles.infoDetails}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Tên thương hiệu:</Text>
          <Text style={styles.infoValue}>{woodworkerData.brandName}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Loại hình kinh doanh:</Text>
          <Text style={styles.infoValue}>{woodworkerData.businessType}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Địa chỉ xưởng:</Text>
          <Text style={styles.infoValue}>{woodworkerData.address}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Mã số thuế:</Text>
          <Text style={styles.infoValue}>{woodworkerData.taxCode}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Giới thiệu:</Text>
          <Text style={styles.infoValue}>{woodworkerData.bio}</Text>
        </View>
      </View>
    </View>
  );

  const renderWorkshopImage = () => (
    <View style={styles.imageSection}>
      <Text style={styles.sectionTitle}>Ảnh đại diện cho xưởng</Text>
      <View style={styles.imageContainer}>
        {woodworkerData.imgUrl ? (
          <View style={styles.imageWrapper}>
            <Image source={{ uri: woodworkerData.imgUrl }} style={styles.workshopImage} />
            <TouchableOpacity 
              style={styles.removeImageButton}
              onPress={() => setWoodworkerData(prev => ({ ...prev, imgUrl: null }))}
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

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={appColorTheme.primary} />
      </View>
    );
  }

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
          onPress={handleUpdateProfile}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color={appColorTheme.text.inverse} />
          ) : (
            <Text style={styles.updateButtonText}>Cập nhật thông tin</Text>
          )}
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
  logoutButton: {
    padding: 8,
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: appColorTheme.background,
  },
  noServicePack: {
    padding: 16,
    backgroundColor: appColorTheme.surface,
    borderRadius: 8,
    marginBottom: 16,
  },
  noServicePackText: {
    fontSize: 14,
    color: appColorTheme.text.secondary,
    textAlign: 'center',
  },
  noUserInfo: {
    padding: 16,
    backgroundColor: appColorTheme.surface,
    borderRadius: 8,
    marginBottom: 16,
  },
  noUserInfoText: {
    fontSize: 14,
    color: appColorTheme.text.secondary,
    textAlign: 'center',
  },
});

export default WoodworkerProfileScreen; 