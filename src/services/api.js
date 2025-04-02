import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Tạo instance axios với cấu hình mặc định
const api = axios.create({
  baseURL: 'http://your-api-url', // Thay thế bằng URL API của bạn
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Thêm interceptor để tự động thêm token vào header
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Xử lý response
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Xử lý refresh token hoặc logout nếu cần
      await AsyncStorage.removeItem('accessToken');
      // Có thể thêm logic chuyển về trang login
    }
    return Promise.reject(error);
  }
);

export { api }; 