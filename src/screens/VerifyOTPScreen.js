import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { appColorTheme } from '../theme/colors';
import { authService } from '../services/authService';

const VerifyOTPScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const email = route.params?.email;
  
  // Nếu không có email, quay lại màn hình trước
  useEffect(() => {
    if (!email) {
      Alert.alert(
        'Lỗi',
        'Không tìm thấy thông tin email để xác thực',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack()
          }
        ]
      );
    }
  }, [email]);

  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState('');
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    let timer;
    if (countdown > 0 && !canResend) {
      timer = setInterval(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  const handleVerifyOTP = async () => {
    if (!otp) {
      Alert.alert('Lỗi', 'Vui lòng nhập mã OTP');
      return;
    }

    try {
      setLoading(true);
      console.log('Verifying OTP for email:', email);

      const response = await authService.verifyOTP({
        email: email,
        otp: otp
      });

      console.log('Verify OTP response:', response);

      // Kiểm tra response
      if (response?.status === 200 || response?.status === 201) {
        Alert.alert(
          'Thành công',
          'Xác thực email thành công!',
          [
            {
              text: 'Đăng nhập',
              onPress: () => navigation.replace('Login')
            }
          ]
        );
      } else {
        throw new Error('Xác thực không thành công');
      }
    } catch (error) {
      console.log('Verify OTP error:', error);
      
      let errorMessage = 'Mã OTP không chính xác hoặc đã hết hạn';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message === 'Network Error') {
        errorMessage = 'Lỗi kết nối mạng. Vui lòng thử lại sau.';
      }

      Alert.alert('Lỗi', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    try {
      setLoading(true);
      await authService.sendEmailOTP(email);
      setCountdown(60);
      setCanResend(false);
      Alert.alert('Thành công', 'Mã OTP mới đã được gửi đến email của bạn');
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể gửi lại mã OTP. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Xác thực OTP</Text>
        <Text style={styles.description}>
          Vui lòng nhập mã OTP đã được gửi đến email {email}
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Nhập mã OTP"
          value={otp}
          onChangeText={setOtp}
          keyboardType="number-pad"
          maxLength={6}
          editable={!loading}
        />

        <TouchableOpacity
          style={[styles.verifyButton, loading && styles.disabledButton]}
          onPress={handleVerifyOTP}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={appColorTheme.white_0} />
          ) : (
            <Text style={styles.verifyButtonText}>Xác nhận</Text>
          )}
        </TouchableOpacity>

        <View style={styles.resendContainer}>
          {!canResend ? (
            <Text style={styles.countdownText}>
              Gửi lại mã sau {countdown}s
            </Text>
          ) : (
            <TouchableOpacity
              onPress={handleResendOTP}
              disabled={loading}
              style={styles.resendButton}
            >
              <Text style={styles.resendButtonText}>Gửi lại mã</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appColorTheme.white_0,
  },
  content: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: appColorTheme.black_0,
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: appColorTheme.grey_0,
    textAlign: 'center',
    marginBottom: 30,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: appColorTheme.grey_1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    textAlign: 'center',
    letterSpacing: 2,
  },
  verifyButton: {
    width: '100%',
    backgroundColor: appColorTheme.brown_0,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  verifyButtonText: {
    color: appColorTheme.white_0,
    fontSize: 16,
    fontWeight: '600',
  },
  resendContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  countdownText: {
    color: appColorTheme.grey_0,
    fontSize: 14,
  },
  resendButton: {
    padding: 10,
  },
  resendButtonText: {
    color: appColorTheme.brown_0,
    fontSize: 14,
    fontWeight: '600',
  },
  disabledButton: {
    opacity: 0.7,
  },
});

export default VerifyOTPScreen; 