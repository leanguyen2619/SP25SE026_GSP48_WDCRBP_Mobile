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
import { jwtDecode } from 'jwt-decode';
import { useAuth } from '../context/AuthContext';

const LoginScreen = () => {
  const navigation = useNavigation();
  const { signIn } = useAuth();
  const [activeTab, setActiveTab] = useState('password'); // 'password', 'emailOTP', 'phoneOTP'
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  const handleLoginWithOTP = async () => {
    if (!otp) {
      Alert.alert('Lỗi', 'Vui lòng nhập mã OTP');
      return;
    }

    try {
      setLoading(true);
      console.log('Attempting login with OTP:', { email, otp });

      const response = await authService.loginWithEmailOTP(email, otp);

      console.log('Login OTP response:', response);

      if (response?.code === 200) {
        Alert.alert(
          'Thành công',
          'Đăng nhập thành công!',
          [
            {
              text: 'OK',
              onPress: () => navigation.replace('Product')
            }
          ]
        );
      } else {
        throw new Error('Đăng nhập không thành công');
      }
    } catch (error) {
      console.log('Login OTP error:', error);

      let errorMessage = 'Có lỗi xảy ra khi đăng nhập';
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

  const handleSendOTP = async () => {
    if (!email) {
      Alert.alert('Lỗi', 'Vui lòng nhập email');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Lỗi', 'Email không đúng định dạng');
      return;
    }

    try {
      setLoading(true);
      console.log('Sending OTP to:', email);

      const response = await authService.sendEmailOTP(email);
      console.log('Send OTP response:', response);

      if (response?.code === 200) {
        setOtpSent(true);
        Alert.alert('Thành công', 'Mã OTP đã được gửi đến email của bạn');
      } else {
        throw new Error('Không thể gửi mã OTP');
      }
    } catch (error) {
      console.log('Send OTP error:', error);

      let errorMessage = 'Có lỗi xảy ra khi gửi mã OTP';
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

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin');
      return;
    }

    try {
      setLoading(true);
      console.log('Attempting login with:', { email });

      const response = await authService.loginWithPassword(email, password);

      console.log('Login response:', response);

      if (response?.code === 200) {
        const accessToken = response.data?.access_token;
        console.log('Access token received:', accessToken);

        if (!accessToken) {
          Alert.alert('Lỗi', 'Thông tin đăng nhập không hợp lệ');
          return;
        }

        const decodedToken = jwtDecode(accessToken);
        console.log('Decoded token:', decodedToken);

        // Gọi signIn với token và userId
        await signIn(accessToken, decodedToken.userId);

        // Điều hướng dựa trên role
        switch (decodedToken.role) {
          case 'Admin':
            navigation.replace('AdminDashboard');
            break;
          case 'Woodworker':
            navigation.replace('WoodworkerDashboard');
            break;
          case 'Customer':
            navigation.replace('Product');
            break;
          default:
            Alert.alert('Lỗi', 'Không thể xác định loại tài khoản');
            return;
        }
      } else {
        throw new Error('Đăng nhập không thành công');
      }
    } catch (error) {
      console.log('Login error:', error);

      let errorMessage = 'Có lỗi xảy ra khi đăng nhập';
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

  const renderLoginForm = () => {
    switch (activeTab) {
      case 'password':
        return (
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              editable={!loading}
            />
            <TextInput
              style={styles.input}
              placeholder="Mật khẩu"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              editable={!loading}
            />
            <TouchableOpacity
              style={[styles.loginButton, loading && styles.disabledButton]}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={appColorTheme.white_0} />
              ) : (
                <Text style={styles.loginButtonText}>Đăng nhập</Text>
              )}
            </TouchableOpacity>
          </View>
        );
      case 'emailOTP':
        return (
          <View style={styles.inputContainer}>
            <View style={styles.otpInputContainer}>
              <TextInput
                style={[styles.input, styles.emailInput]}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                editable={!loading}
              />
              <TouchableOpacity
                style={[styles.sendOTPButton, loading && styles.disabledButton]}
                onPress={handleSendOTP}
                disabled={loading}
              >
                <Text style={styles.sendOTPText}>
                  {otpSent ? 'Gửi lại' : 'Gửi OTP'}
                </Text>
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.input}
              placeholder="Mã OTP"
              value={otp}
              onChangeText={setOtp}
              keyboardType="number-pad"
              maxLength={6}
              editable={!loading}
            />
            <TouchableOpacity
              style={[styles.loginButton, loading && styles.disabledButton]}
              onPress={handleLoginWithOTP}
              disabled={loading || !otpSent}
            >
              {loading ? (
                <ActivityIndicator color={appColorTheme.white_0} />
              ) : (
                <Text style={styles.loginButtonText}>Đăng nhập</Text>
              )}
            </TouchableOpacity>
          </View>
        );
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

        <Text style={styles.title}>Đăng nhập</Text>

        {/* Login Method Tabs */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === 'password' && {
                ...styles.activeTab,
                borderTopLeftRadius: 12,
                borderBottomLeftRadius: 12,
              },
            ]}
            onPress={() => {
              setActiveTab('password');
              setOtpSent(false);
            }}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'password' && styles.activeTabText,
              ]}
            >
              Mật khẩu
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === 'emailOTP' && {
                ...styles.activeTab,
                borderTopRightRadius: 12,
                borderBottomRightRadius: 12,
              },
            ]}
            onPress={() => {
              setActiveTab('emailOTP');
              setOtpSent(false);
            }}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'emailOTP' && styles.activeTabText,
              ]}
            >
              Email OTP
            </Text>
          </TouchableOpacity>
        </View>


        {renderLoginForm()}

        {/* Registration Section */}
        <View style={styles.registrationContainer}>
          <Text style={styles.registrationText}>
            Bạn chưa có tài khoản?
          </Text>
          <TouchableOpacity
            style={styles.registerButton}
            onPress={() => navigation.navigate('Register')}
          >
            <Text style={styles.registerButtonText}>Đăng ký </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.registerButton}
            onPress={() => navigation.navigate('WoodworkerRegistration')}
          >
            <Text style={styles.registerButtonText}>Đăng ký thành thợ mộc</Text>
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
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
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
    textAlign: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    backgroundColor: appColorTheme.grey_1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  activeTab: {
    backgroundColor: appColorTheme.white_0,
  },
  
  tabText: {
    fontSize: 14,
    color: appColorTheme.brown_1,
  },
  
  activeTabText: {
    color: appColorTheme.brown_0,
    fontWeight: '600',
  },
  inputContainer: {
    marginBottom: 24,
    gap: 16,
  },
  otpInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: appColorTheme.grey_1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  emailInput: {
    flex: 1,
  },
  sendOTPButton: {
    backgroundColor: appColorTheme.brown_0,
    paddingHorizontal: 16,
    paddingVertical: 12,
    justifyContent: 'center',
    borderRadius: 8,
  },
  sendOTPText: {
    color: appColorTheme.white_0,
    fontSize: 14,
    fontWeight: '600',
  },
  loginButton: {
    backgroundColor: appColorTheme.brown_0,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  loginButtonText: {
    color: appColorTheme.white_0,
    fontSize: 16,
    fontWeight: '600',
  },
  registrationContainer: {
    marginTop: 32,
    alignItems: 'center',
    gap: 12,
  },
  registrationText: {
    fontSize: 14,
    color: appColorTheme.brown_1,
  },
  registerButton: {
    backgroundColor: appColorTheme.white_0,
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: appColorTheme.brown_0,
    width: '100%',
    alignItems: 'center',
  },
  registerButtonText: {
    color: appColorTheme.brown_0,
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton: {
    opacity: 0.6,
  },
});

export default LoginScreen;