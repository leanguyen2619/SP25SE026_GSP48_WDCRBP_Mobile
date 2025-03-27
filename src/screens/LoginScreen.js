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
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { appColorTheme } from '../theme/colors';

const LoginScreen = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('password'); // 'password', 'emailOTP', 'phoneOTP'
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');

  const handleSendOTP = () => {
    // Xử lý gửi mã OTP
    console.log('Sending OTP...');
  };

  const handleLogin = () => {
    // Xử lý đăng nhập
    console.log('Logging in...');
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
            />
            <TextInput
              style={styles.input}
              placeholder="Mật khẩu"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
              <Text style={styles.loginButtonText}>Đăng nhập</Text>
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
              />
              <TouchableOpacity style={styles.sendOTPButton} onPress={handleSendOTP}>
                <Text style={styles.sendOTPText}>Gửi OTP</Text>
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.input}
              placeholder="Mã OTP"
              value={otp}
              onChangeText={setOtp}
              keyboardType="number-pad"
            />
            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
              <Text style={styles.loginButtonText}>Đăng nhập</Text>
            </TouchableOpacity>
          </View>
        );
      case 'phoneOTP':
        return (
          <View style={styles.inputContainer}>
            <View style={styles.otpInputContainer}>
              <TextInput
                style={[styles.input, styles.emailInput]}
                placeholder="Số điện thoại"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
              />
              <TouchableOpacity style={styles.sendOTPButton} onPress={handleSendOTP}>
                <Text style={styles.sendOTPText}>Gửi OTP</Text>
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.input}
              placeholder="Mã OTP"
              value={otp}
              onChangeText={setOtp}
              keyboardType="number-pad"
            />
            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
              <Text style={styles.loginButtonText}>Đăng nhập</Text>
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
            style={[styles.tabButton, activeTab === 'password' && styles.activeTab]}
            onPress={() => setActiveTab('password')}
          >
            <Text style={[styles.tabText, activeTab === 'password' && styles.activeTabText]}>Mật khẩu</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tabButton, activeTab === 'emailOTP' && styles.activeTab]}
            onPress={() => setActiveTab('emailOTP')}
          >
            <Text style={[styles.tabText, activeTab === 'emailOTP' && styles.activeTabText]}>Email OTP</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tabButton, activeTab === 'phoneOTP' && styles.activeTab]}
            onPress={() => setActiveTab('phoneOTP')}
          >
            <Text style={[styles.tabText, activeTab === 'phoneOTP' && styles.activeTabText]}>Số điện thoại OTP</Text>
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
            <Text style={styles.registerButtonText}>Đăng ký</Text>
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
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    borderRadius: 8,
    backgroundColor: appColorTheme.grey_1,
    padding: 4,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
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
    gap: 16,
  },
  otpInputContainer: {
    flexDirection: 'row',
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
    marginTop: 8,
  },
  loginButtonText: {
    color: appColorTheme.white_0,
    fontSize: 16,
    fontWeight: '600',
  },
  registrationContainer: {
    marginTop: 24,
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
  },
  registerButtonText: {
    color: appColorTheme.brown_0,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default LoginScreen;