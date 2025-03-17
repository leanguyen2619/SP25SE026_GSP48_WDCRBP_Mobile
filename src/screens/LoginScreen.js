import React from 'react';
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

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <Image
            // source={require('../assets/images/logo.png')}r
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.logoText}>Woodworking platform</Text>
        </View>

        {/* Login Form */}
        <View style={styles.formContainer}>
          <Text style={styles.title}>Đăng nhập</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email<Text style={styles.required}>*</Text></Text>
            <TextInput
              style={styles.input}
              placeholder="Nhập email của bạn"
              placeholderTextColor={appColorTheme.grey_2}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Mật khẩu<Text style={styles.required}>*</Text></Text>
            <TextInput
              style={styles.input}
              placeholder="Nhập mật khẩu của bạn"
              placeholderTextColor={appColorTheme.grey_2}
              secureTextEntry
            />
          </View>

          <TouchableOpacity 
            style={styles.loginButton}
            onPress={() => navigation.navigate('Search')}
          >
            <Text style={styles.loginButtonText}>Đăng nhập</Text>
          </TouchableOpacity>

          <View style={styles.bottomLinks}>
            <TouchableOpacity>
              <Text style={styles.forgotPassword}>Quên mật khẩu</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text style={styles.register}>Đăng ký</Text>
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
  loginButton: {
    backgroundColor: appColorTheme.brown_0,
    borderRadius: 4,
    padding: 14,
    alignItems: 'center',
    marginTop: 24,
  },
  loginButtonText: {
    color: appColorTheme.black_0,
    fontSize: 16,
    fontWeight: '500',
  },
  bottomLinks: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  forgotPassword: {
    color: appColorTheme.white_0,
    fontSize: 14,
  },
  register: {
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

export default LoginScreen;