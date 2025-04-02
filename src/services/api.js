import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Tạo instance axios với cấu hình mặc định
const api = axios.create({
  baseURL: 'http://10.0.2.2:8080', // URL cho Android Emulator
  // baseURL: 'http://localhost:8080', // URL cho iOS Simulator
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Thêm interceptor để tự động thêm token vào header
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      console.log('Token from AsyncStorage:', token);
      if (token) {
        // Đảm bảo headers object tồn tại
        config.headers = config.headers || {};
        // Thêm token vào header
        config.headers['Authorization'] = `Bearer ${token}`;
        console.log('Request headers after adding token:', config.headers);
      } else {
        console.log('No token found in AsyncStorage');
      }
      
      console.log('API Request:', {
        url: config.url,
        method: config.method,
        headers: config.headers,
        data: config.data
      });
      
      return config;
    } catch (error) {
      console.error('Error adding token to request:', error);
      return config;
    }
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Xử lý response
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', {
      url: response.config.url,
      status: response.status,
      data: response.data
    });
    return response;
  },
  async (error) => {
    console.error('API Response Error:', {
      url: error.config?.url,
      status: error.response?.status,
      message: error.message,
      data: error.response?.data
    });

    if (error.response?.status === 401) {
      // Token hết hạn hoặc không hợp lệ
      await AsyncStorage.removeItem('accessToken');
      // Chuyển về trang login
      // TODO: Thêm logic navigation về trang login
    }
    return Promise.reject(error);
  }
);

export { api }; 