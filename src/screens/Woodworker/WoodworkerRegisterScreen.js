import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../../theme/colors';
import { authService } from '../../services/authService';

const WoodworkerRegisterScreen = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  
  // Form data
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    wardCode: '',
    districtId: '',
    cityId: '',
    businessType: '',
    taxCode: '',
    brandName: '',
    bio: '',
    imgUrl: ''
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    const requiredFields = [
      'fullName',
      'email',
      'phone',
      'address',
      'wardCode',
      'districtId',
      'cityId',
      'businessType'
    ];

    const emptyFields = requiredFields.filter(field => !formData[field]);
    
    if (emptyFields.length > 0) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin bắt buộc');
      return false;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      Alert.alert('Lỗi', 'Email không đúng định dạng');
      return false;
    }

    // Validate phone number (Vietnam format)
    const phoneRegex = /^(0|\+84)[3|5|7|8|9][0-9]{8}$/;
    if (!phoneRegex.test(formData.phone)) {
      Alert.alert('Lỗi', 'Số điện thoại không đúng định dạng');
      return false;
    }

    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      console.log('Registering woodworker with data:', formData);

      const response = await authService.registerWoodworker(formData);
      console.log('Register response:', response);

      if (response?.code === 200) {
        Alert.alert(
          'Thành công',
          'Đăng ký làm thợ mộc thành công! Vui lòng chờ xác nhận từ admin.',
          [
            {
              text: 'OK',
              onPress: () => navigation.goBack()
            }
          ]
        );
      } else {
        throw new Error('Đăng ký không thành công');
      }
    } catch (error) {
      console.log('Register error:', error);
      
      let errorMessage = 'Có lỗi xảy ra khi đăng ký';
      if (error.message) {
        errorMessage = error.message;
      }

      Alert.alert(
        'Lỗi',
        errorMessage,
        [
          {
            text: 'Thử lại',
            onPress: () => setLoading(false)
          }
        ]
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Đăng ký làm thợ mộc</Text>
        
        <View style={styles.formContainer}>
          {/* Thông tin cá nhân */}
          <Text style={styles.sectionTitle}>Thông tin cá nhân</Text>
          <TextInput
            style={styles.input}
            placeholder="Họ và tên *"
            value={formData.fullName}
            onChangeText={(value) => handleInputChange('fullName', value)}
            editable={!loading}
          />
          <TextInput
            style={styles.input}
            placeholder="Email *"
            value={formData.email}
            onChangeText={(value) => handleInputChange('email', value)}
            keyboardType="email-address"
            editable={!loading}
          />
          <TextInput
            style={styles.input}
            placeholder="Số điện thoại *"
            value={formData.phone}
            onChangeText={(value) => handleInputChange('phone', value)}
            keyboardType="phone-pad"
            editable={!loading}
          />

          {/* Địa chỉ */}
          <Text style={styles.sectionTitle}>Địa chỉ</Text>
          <TextInput
            style={styles.input}
            placeholder="Địa chỉ chi tiết *"
            value={formData.address}
            onChangeText={(value) => handleInputChange('address', value)}
            editable={!loading}
          />
          <TextInput
            style={styles.input}
            placeholder="Mã phường/xã *"
            value={formData.wardCode}
            onChangeText={(value) => handleInputChange('wardCode', value)}
            editable={!loading}
          />
          <TextInput
            style={styles.input}
            placeholder="Mã quận/huyện *"
            value={formData.districtId}
            onChangeText={(value) => handleInputChange('districtId', value)}
            editable={!loading}
          />
          <TextInput
            style={styles.input}
            placeholder="Mã tỉnh/thành phố *"
            value={formData.cityId}
            onChangeText={(value) => handleInputChange('cityId', value)}
            editable={!loading}
          />

          {/* Thông tin kinh doanh */}
          <Text style={styles.sectionTitle}>Thông tin kinh doanh</Text>
          <TextInput
            style={styles.input}
            placeholder="Loại hình kinh doanh *"
            value={formData.businessType}
            onChangeText={(value) => handleInputChange('businessType', value)}
            editable={!loading}
          />
          <TextInput
            style={styles.input}
            placeholder="Mã số thuế"
            value={formData.taxCode}
            onChangeText={(value) => handleInputChange('taxCode', value)}
            editable={!loading}
          />
          <TextInput
            style={styles.input}
            placeholder="Tên thương hiệu"
            value={formData.brandName}
            onChangeText={(value) => handleInputChange('brandName', value)}
            editable={!loading}
          />

          {/* Thông tin thêm */}
          <Text style={styles.sectionTitle}>Thông tin thêm</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Giới thiệu bản thân"
            value={formData.bio}
            onChangeText={(value) => handleInputChange('bio', value)}
            multiline
            numberOfLines={4}
            editable={!loading}
          />

          <TouchableOpacity 
            style={[styles.registerButton, loading && styles.disabledButton]}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={colors.white_0} />
            ) : (
              <Text style={styles.registerButtonText}>Đăng ký</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white_0,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.black_0,
    marginBottom: 20,
  },
  formContainer: {
    gap: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.brown_0,
    marginTop: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.grey_1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  registerButton: {
    backgroundColor: colors.brown_0,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
  },
  registerButtonText: {
    color: colors.white_0,
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton: {
    opacity: 0.7,
  },
});

export default WoodworkerRegisterScreen; 