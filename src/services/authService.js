import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { jwtDecode } from 'jwt-decode';

// Chọn URL API dựa vào platform
const getBaseUrl = () => {
  if (Platform.OS === 'android') {
    // Sử dụng 10.0.2.2 cho Android Emulator
    return 'http://10.0.2.2:8080/api/v1';
  }
  // Sử dụng localhost cho iOS và web
  return 'http://localhost:8080/api/v1';
};

const API_URL = getBaseUrl();

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': '*/*'
  },
  timeout: 10000, // Timeout sau 10s
});

// Log chi tiết request để debug
api.interceptors.request.use(
  (config) => {
    console.log('API Request:', {
      url: config.url,
      method: config.method,
      data: config.data,
      headers: config.headers
    });
    return config;
  },
  (error) => {
    console.log('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Log chi tiết response để debug
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', {
      status: response.status,
      data: response.data
    });
    return response;
  },
  (error) => {
    console.log('API Response Error:', {
      message: error.message,
      response: error.response?.data
    });
    return Promise.reject(error);
  }
);

export const authService = {
  // Đăng ký
  register: async (userData) => {
    try {
      const data = {
        username: userData.username,
        password: userData.password,
        email: userData.email,
        phone: userData.phone || ""
      };

      console.log('Register request data:', data);
      
      const response = await api.post('/auth/register', data);
      return response.data;
    } catch (error) {
      console.error('Register error:', {
        code: error.code,
        message: error.message,
        response: error.response?.data
      });

      // Xử lý các loại lỗi
      if (error.code === 'ERR_NETWORK') {
        throw new Error('Lỗi kết nối mạng. Vui lòng kiểm tra kết nối internet của bạn.');
      }
      if (error.code === 'ECONNABORTED') {
        throw new Error('Không thể kết nối đến server. Vui lòng thử lại sau.');
      }
      if (error.response?.status === 401) {
        throw new Error('Lỗi xác thực. Vui lòng kiểm tra lại thông tin đăng ký.');
      }
      if (error.response?.status === 400) {
        throw new Error(error.response.data.message || 'Thông tin đăng ký không hợp lệ.');
      }
      
      throw new Error(error.response?.data?.message || 'Lỗi đăng ký tài khoản. Vui lòng thử lại sau.');
    }
  },

  // ĐĂNG NHẬP BẰNG MẬT KHẨU
  loginWithPassword: async (emailOrPhone, password) => {
    try {
      console.log('Login with password:', { emailOrPhone });
      
      const response = await api.post('/auth/login', {
        emailOrPhone,
        password
      });

      console.log('Raw login response:', response);
      console.log('Login response data:', response.data);

      // Kiểm tra response và lưu token
      if (response.data?.data?.access_token) {
        const access_token = response.data.data.access_token;
        console.log('Access token found in response');
        await AsyncStorage.setItem('accessToken', access_token);
        console.log('Access token saved to AsyncStorage');
        await AsyncStorage.setItem('refreshToken', response.data.data.refresh_token);
        console.log('Refresh token saved to AsyncStorage');
        
        // Decode token để lấy thông tin
        try {
          const decoded = jwtDecode(access_token);
          console.log('Decoded token:', decoded);
          
          if (decoded.userId) {
            await AsyncStorage.setItem('userId', decoded.userId.toString());
            console.log('UserId saved to AsyncStorage');
          }
          if (decoded.role) {
            await AsyncStorage.setItem('userRole', decoded.role);
            console.log('UserRole saved to AsyncStorage');
          }
        } catch (decodeError) {
          console.error('Error decoding token:', decodeError);
        }
      } else {
        console.log('No access token found in response');
      }

      return response.data;
    } catch (error) {
      console.log('Login error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      // Xử lý các loại lỗi cụ thể
      if (error.response?.status === 400) {
        throw new Error('Tên đăng nhập hoặc mật khẩu không chính xác');
      } else if (error.response?.status === 401) {
        throw new Error('Tài khoản chưa được xác thực');
      } else if (error.code === 'ERR_NETWORK') {
        throw new Error('Lỗi kết nối mạng. Vui lòng kiểm tra lại kết nối internet');
      }
      
      throw new Error('Có lỗi xảy ra khi đăng nhập. Vui lòng thử lại sau.');
    }
  },

  // GỬI MÃ OTP QUA EMAIL
  sendEmailOTP: async (email) => {
    try {
      console.log('Sending OTP to email:', email);
      const response = await api.post(`/auth/send-otp?email=${email}`, null, {
        headers: {
          'Accept': '*/*'
        }
      });

      console.log('Send OTP response:', response.data);
      return response.data;
    } catch (error) {
      console.log('Send email OTP error:', error.response?.data || error.message);
      
      if (error.code === 'ERR_NETWORK') {
        throw new Error('Lỗi kết nối mạng. Vui lòng kiểm tra lại kết nối internet.');
      }

      if (error.response?.status === 401) {
        throw new Error('Không có quyền truy cập. Vui lòng thử lại sau.');
      }

      if (error.response?.status === 400) {
        throw new Error('Email không hợp lệ hoặc không tồn tại trong hệ thống.');
      }

      throw new Error('Không thể gửi mã OTP qua email. Vui lòng thử lại sau.');
    }
  },

  // ĐĂNG NHẬP BẰNG EMAIL OTP
  loginWithEmailOTP: async (email, otp) => {
    try {
      console.log('Login with email OTP:', { email, otp });
      
      const response = await api.post('/auth/login-otp', {
        email,
        otp
      });

      console.log('Login OTP response:', response.data);

      if (response.data?.data?.access_token) {
        await AsyncStorage.setItem('accessToken', response.data.data.access_token);
        await AsyncStorage.setItem('refreshToken', response.data.data.refresh_token);
      }

      return response.data;
    } catch (error) {
      console.log('Login with OTP error:', error.response?.data);
      if (error.response?.status === 400) {
        throw new Error('Mã OTP không chính xác hoặc đã hết hạn');
      } else if (error.code === 'ERR_NETWORK') {
        throw new Error('Lỗi kết nối mạng. Vui lòng kiểm tra lại kết nối internet');
      }
      throw new Error('Có lỗi xảy ra khi đăng nhập bằng OTP');
    }
  },

  // ĐĂNG NHẬP BẰNG SỐ ĐIỆN THOẠI OTP
  loginWithPhoneOTP: async (phone, otp) => {
    try {
      console.log('Login with phone OTP:', { phone });
      
      // Bước 1: Xác thực OTP
      const verifyResponse = await api.post('/auth/verify-phone-otp', {
        phone,
        otp
      });

      // Bước 2: Nếu OTP đúng, tự động đăng nhập
      if (verifyResponse.status === 200) {
        const loginResponse = await api.post('/auth/login-with-phone', {
          phone,
          otp
        });

        if (loginResponse.data?.accessToken) {
          await AsyncStorage.setItem('accessToken', loginResponse.data.accessToken);
          await AsyncStorage.setItem('refreshToken', loginResponse.data.refreshToken);
          if (loginResponse.data.user) {
            await AsyncStorage.setItem('userData', JSON.stringify(loginResponse.data.user));
          }
        }
        console.log('Login response:', loginResponse.data);
        return loginResponse.data;
      }

      throw new Error('Xác thực OTP không thành công');
    } catch (error) {
      console.log('Login with phone OTP error:', error.response?.data);
      if (error.response?.status === 400) {
        throw new Error('Mã OTP không chính xác');
      }
      throw new Error('Có lỗi xảy ra khi đăng nhập bằng số điện thoại');
    }
  },

  // Đăng ký thông tin chi tiết
  signup: async (signupData) => {
    try {
      const response = await api.post('/auth/signup', signupData);
      return response.data;
    } catch (error) {
      throw {
        message: error.response?.data?.message || 'Lỗi đăng ký',
        response: error.response
      };
    }
  },

  // Đăng nhập lại (refresh token)
  refreshToken: async (refreshToken) => {
    try {
      const response = await api.post('/auth/refresh-token', { refreshToken });
      return response.data;
    } catch (error) {
      throw {
        message: error.response?.data?.message || 'Lỗi làm mới token',
        response: error.response
      };
    }
  },

  // Đăng nhập (signin - alternative endpoint)
  signin: async (credentials) => {
    try {
      const response = await api.post('/auth/signin', credentials);
      return response.data;
    } catch (error) {
      throw {
        message: error.response?.data?.message || 'Lỗi đăng nhập',
        response: error.response
      };
    }
  },

  // GỬI MÃ OTP QUA SỐ ĐIỆN THOẠI
  sendPhoneOTP: async (phone) => {
    try {
      const response = await api.post('/auth/send-phone-otp', {
        phone
      });
      return response;
    } catch (error) {
      console.log('Send phone OTP error:', error.response?.data);
      throw new Error('Không thể gửi mã OTP qua số điện thoại');
    }
  },

  // Xác thực OTP
  verifyOTP: async (data) => {
    try {
      console.log('Calling verify OTP API with:', data);
      const response = await api.post('/auth/verification-otp', {
        email: data.email,
        otp: data.otp
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': '*/*'
        }
      });
      console.log('Verify OTP API response:', response);
      return response;
    } catch (error) {
      console.log('Verify OTP API error:', error.response || error);
      throw error;
    }
  },

  // Đăng xuất
  logout: async () => {
    try {
      await AsyncStorage.removeItem('accessToken');
      await AsyncStorage.removeItem('refreshToken');
      await AsyncStorage.removeItem('userData');
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  },

  // ĐĂNG KÝ LÀM THỢ MỘC
  registerWoodworker: async (data) => {
    try {
      const response = await api.post('/ww/ww-register', data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.log('Register error:', error.response?.data || error.message);

      return {
        success: false,
        message: error.response?.data?.message || 'Có lỗi xảy ra khi đăng ký',
      };
    }
  }
};