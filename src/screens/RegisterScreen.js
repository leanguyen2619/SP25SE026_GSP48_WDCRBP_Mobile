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
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { appColorTheme } from '../theme/colors';
import { authService } from '../services/authService';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RegisterScreen = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const validateForm = () => {
    if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Lỗi', 'Mật khẩu xác nhận không khớp');
      return false;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      Alert.alert('Lỗi', 'Email không hợp lệ');
      return false;
    }

    // Validate phone number (Vietnam format) if provided
    if (formData.phone) {
      const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
      if (!phoneRegex.test(formData.phone)) {
        Alert.alert('Lỗi', 'Số điện thoại không hợp lệ');
        return false;
      }
    }

    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);

      // Đăng ký tài khoản với format đúng theo API
      const registerData = {
        username: formData.username,
        email: formData.email,
        phone: formData.phone || "",
        password: formData.password,
      };

      console.log('Sending register data:', registerData);

      const response = await authService.register(registerData);
      console.log('Register response:', response);

      if (response) {
        // Đăng ký thành công
        Alert.alert(
          'Thành công',
          'Đăng ký tài khoản thành công! Vui lòng xác thực email.',
          [
            {
              text: 'OK',
              onPress: () => {
                // Chuyển sang màn hình xác thực OTP với email
                navigation.navigate('VerifyOTP', {
                  email: formData.email
                });
              }
            }
          ]
        );
      } else {
        throw new Error('Không nhận được phản hồi từ server');
      }
      
    } catch (error) {
      console.log('Register error details:', {
        error: error,
        response: error.response,
        data: error.response?.data,
        status: error.response?.status,
        message: error.message
      });
      
      let errorMessage = 'Có lỗi xảy ra trong quá trình đăng ký';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message === 'Network Error') {
        errorMessage = 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng và thử lại.';
      } else if (error.response?.status === 400) {
        errorMessage = 'Thông tin đăng ký không hợp lệ. Vui lòng kiểm tra lại.';
      } else if (error.response?.status === 409) {
        errorMessage = 'Email hoặc tên đăng nhập đã tồn tại.';
      }

      Alert.alert(
        'Lỗi đăng ký',
        errorMessage,
        [
          {
            text: 'OK',
            style: 'cancel'
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
        {/* Logo */}
        <View style={styles.logoContainer}>
          <Image
            source={require('../../assets/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.logoText}>Woodworking platform</Text>
        </View>

        <Text style={styles.title}>Đăng ký</Text>

        {/* Register Form */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Tên đăng nhập"
            value={formData.username}
            onChangeText={(text) => setFormData({...formData, username: text})}
            editable={!loading}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={formData.email}
            onChangeText={(text) => setFormData({...formData, email: text})}
            keyboardType="email-address"
            editable={!loading}
          />
          <TextInput
            style={styles.input}
            placeholder="Số điện thoại "
            value={formData.phone}
            onChangeText={(text) => setFormData({...formData, phone: text})}
            keyboardType="phone-pad"
            editable={!loading}
          />
          <TextInput
            style={styles.input}
            placeholder="Mật khẩu"
            value={formData.password}
            onChangeText={(text) => setFormData({...formData, password: text})}
            secureTextEntry
            editable={!loading}
          />
          <TextInput
            style={styles.input}
            placeholder="Xác nhận mật khẩu"
            value={formData.confirmPassword}
            onChangeText={(text) => setFormData({...formData, confirmPassword: text})}
            secureTextEntry
            editable={!loading}
          />
          <TouchableOpacity 
            style={[styles.registerButton, loading && styles.disabledButton]}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={appColorTheme.white_0} />
            ) : (
              <Text style={styles.registerButtonText}>Đăng ký</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Login Section */}
        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>
            Đã có tài khoản?
          </Text>
          <TouchableOpacity 
            style={styles.loginLinkButton}
            onPress={() => navigation.navigate('Login')}
            disabled={loading}
          >
            <Text style={styles.loginLinkText}>Đăng nhập</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appColorTheme.white_0,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginVertical: 40,
  },
  logo: {
    width: 120,
    height: 120,
  },
  logoText: {
    fontSize: 20,
    fontWeight: '600',
    color: appColorTheme.brown_0,
    marginTop: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: appColorTheme.black_0,
    marginBottom: 20,
  },
  inputContainer: {
    gap: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: appColorTheme.grey_1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  registerButton: {
    backgroundColor: appColorTheme.brown_0,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  registerButtonText: {
    color: appColorTheme.white_0,
    fontSize: 16,
    fontWeight: '600',
  },
  loginContainer: {
    marginTop: 24,
    alignItems: 'center',
    gap: 12,
  },
  loginText: {
    fontSize: 14,
    color: appColorTheme.brown_1,
  },
  loginLinkButton: {
    backgroundColor: appColorTheme.white_0,
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: appColorTheme.brown_0,
  },
  loginLinkText: {
    color: appColorTheme.brown_0,
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton: {
    opacity: 0.7,
  },
});

export default RegisterScreen; 