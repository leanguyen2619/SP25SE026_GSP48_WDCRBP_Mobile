import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Image,
  ScrollView,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { appColorTheme } from '../theme/colors';

const RegisterScreen = () => {
  const navigation = useNavigation();
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const handleRegister = () => {
    // Validate form
    if (!formData.fullName || !formData.phone || !formData.password || !formData.confirmPassword) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Lỗi', 'Mật khẩu xác nhận không khớp');
      return;
    }

    // TODO: Add API call for registration
    console.log('Register data:', formData);
    navigation.navigate('Login');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <Image
            source={require('../../assets/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.logoText}>Woodworking platform</Text>
        </View>

        {/* Register Form */}
        <View style={styles.formContainer}>
          <Text style={styles.title}>Đăng ký</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Họ và tên<Text style={styles.required}>*</Text></Text>
            <TextInput
              style={styles.input}
              placeholder="Nhập họ và tên của bạn"
              placeholderTextColor={appColorTheme.grey_2}
              value={formData.fullName}
              onChangeText={(text) => setFormData({...formData, fullName: text})}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Số điện thoại<Text style={styles.required}>*</Text></Text>
            <TextInput
              style={styles.input}
              placeholder="Nhập số điện thoại của bạn"
              placeholderTextColor={appColorTheme.grey_2}
              keyboardType="phone-pad"
              value={formData.phone}
              onChangeText={(text) => setFormData({...formData, phone: text})}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Mật khẩu<Text style={styles.required}>*</Text></Text>
            <TextInput
              style={styles.input}
              placeholder="Nhập mật khẩu của bạn"
              placeholderTextColor={appColorTheme.grey_2}
              secureTextEntry
              value={formData.password}
              onChangeText={(text) => setFormData({...formData, password: text})}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Xác nhận mật khẩu<Text style={styles.required}>*</Text></Text>
            <TextInput
              style={styles.input}
              placeholder="Nhập lại mật khẩu của bạn"
              placeholderTextColor={appColorTheme.grey_2}
              secureTextEntry
              value={formData.confirmPassword}
              onChangeText={(text) => setFormData({...formData, confirmPassword: text})}
            />
          </View>

          <TouchableOpacity 
            style={styles.registerButton}
            onPress={handleRegister}
          >
            <Text style={styles.registerButtonText}>Đăng ký</Text>
          </TouchableOpacity>

          <View style={styles.bottomLinks}>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginLink}>Đã có tài khoản? Đăng nhập</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Bottom Text */}
        <View style={styles.bottomTextContainer}>
          <Text style={styles.bottomText}>
            Bạn muốn trở thành nhà cung cấp của chúng tôi?{' '}
            <Text style={styles.link}>Liên hệ tại đây</Text>
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appColorTheme.grey_0,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 40,
  },
  logo: {
    width: 60,
    height: 60,
  },
  logoText: {
    marginTop: 8,
    fontSize: 16,
    color: appColorTheme.black_0,
  },
  formContainer: {
    backgroundColor: appColorTheme.black_0,
    borderRadius: 8,
    padding: 24,
    width: '100%',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: appColorTheme.white_0,
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: appColorTheme.white_0,
    marginBottom: 8,
  },
  required: {
    color: appColorTheme.brown_2,
  },
  input: {
    backgroundColor: appColorTheme.white_0,
    borderRadius: 4,
    padding: 12,
    fontSize: 16,
    color: appColorTheme.black_0,
  },
  registerButton: {
    backgroundColor: appColorTheme.brown_0,
    borderRadius: 4,
    padding: 14,
    alignItems: 'center',
    marginTop: 24,
  },
  registerButtonText: {
    color: appColorTheme.black_0,
    fontSize: 16,
    fontWeight: '500',
  },
  bottomLinks: {
    alignItems: 'center',
    marginTop: 16,
  },
  loginLink: {
    color: appColorTheme.white_0,
    fontSize: 14,
  },
  bottomTextContainer: {
    marginTop: 24,
    alignItems: 'center',
  },
  bottomText: {
    fontSize: 14,
    color: appColorTheme.black_0,
    textAlign: 'center',
  },
  link: {
    color: appColorTheme.brown_1,
    textDecorationLine: 'underline',
  },
});

export default RegisterScreen; 