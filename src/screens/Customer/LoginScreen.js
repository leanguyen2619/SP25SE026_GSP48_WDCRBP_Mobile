import React, { useState } from 'react';
import { Alert, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import jwtDecode from 'jwt-decode';

const LoginScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await axios.post(`${BASE_URL}/auth/login`, {
        email: email,
        password: password,
      });

      console.log('Login response:', response.data);

      if (response.data.code === 200) {
        const { access_token, refresh_token } = response.data.data;
        const decodedToken = jwtDecode(access_token);
        
        // Đảm bảo có userId trước khi gọi signIn
        if (!decodedToken || !decodedToken.userId) {
          Alert.alert('Lỗi', 'Token không hợp lệ');
          return;
        }

        await signIn(access_token, decodedToken.userId);
        navigation.navigate('Home');
      } else {
        Alert.alert('Lỗi', response.data.message || 'Đăng nhập thất bại');
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Lỗi', 'Đăng nhập thất bại. Vui lòng thử lại');
    }
  };

  return (
    <View>
      {/* Render your form components here */}
    </View>
  );
};

export default LoginScreen; 