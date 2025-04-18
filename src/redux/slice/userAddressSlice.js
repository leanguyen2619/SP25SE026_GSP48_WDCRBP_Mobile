import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = Platform.OS === 'android'
  ? 'http://10.0.2.2:8080/api/v1/useraddresses'
  : 'http://localhost:8080/api/v1/useraddresses';

// 🧨 Thunk to fetch addresses by userId
export const fetchUserAddresses = createAsyncThunk(
  'userAddress/fetch',
  async (userId, thunkAPI) => {
    try {
      console.log('=== KIỂM TRA THÔNG TIN ĐĂNG NHẬP ===');
      console.log('UserID:', userId);

      // Kiểm tra userId
      if (!userId) {
        console.error('❌ UserID không tồn tại');
        throw new Error('Vui lòng đăng nhập để xem địa chỉ');
      }

      // Kiểm tra tất cả các key trong AsyncStorage
      console.log('Đang kiểm tra AsyncStorage...');
      try {
        const keys = await AsyncStorage.getAllKeys();
        console.log('Tất cả các key trong AsyncStorage:', keys);
        
        // Kiểm tra từng key liên quan đến auth
        const authKeys = ['@auth_token', 'token', 'userToken', '@user_token'];
        for (const key of authKeys) {
          const value = await AsyncStorage.getItem(key);
          console.log(`Kiểm tra key "${key}":`, value ? 'Có giá trị' : 'Không có giá trị');
        }
      } catch (storageError) {
        console.error('❌ Lỗi khi kiểm tra AsyncStorage:', storageError);
      }

      // Thử lấy token từ các key khác nhau
      let token;
      const tokenKeys = ['@auth_token', 'token', 'userToken', '@user_token'];
      
      for (const key of tokenKeys) {
        try {
          const value = await AsyncStorage.getItem(key);
          if (value) {
            console.log(`✅ Tìm thấy token trong key "${key}"`);
            token = value;
            break;
          }
        } catch (tokenError) {
          console.error(`❌ Lỗi khi lấy token từ key "${key}":`, tokenError);
        }
      }

      if (!token) {
        console.error('❌ Không tìm thấy token trong bất kỳ key nào');
        throw new Error('Vui lòng đăng nhập lại để tiếp tục');
      }

      console.log('=== CHUẨN BỊ GỬI REQUEST ===');
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      };
      console.log('Headers:', {
        ...config.headers,
        'Authorization': 'Bearer ' + (token ? '***[TOKEN_HIDDEN]***' : 'KHÔNG CÓ TOKEN')
      });

      console.log('URL:', `${BASE_URL}/user/${userId}`);
      const response = await axios.get(`${BASE_URL}/user/${userId}`, config);
      
      console.log('=== RESPONSE ===');
      console.log('Status:', response.status);
      console.log('Headers:', response.headers);
      console.log('Data:', response.data);

      if (!response.data || !response.data.data) {
        throw new Error('Không có dữ liệu địa chỉ');
      }

      const addresses = Array.isArray(response.data.data) 
        ? response.data.data 
        : [response.data.data];

      const normalizedAddresses = addresses.map(addr => ({
        ...addr,
        userAddressId: addr.userAddressId || addr.id,
        wardName: addr.wardName || '',
        districtName: addr.districtName || '',
        cityName: addr.cityName || ''
      }));

      console.log('✅ Lấy thành công', normalizedAddresses.length, 'địa chỉ');
      return normalizedAddresses;

    } catch (error) {
      console.error('=== CHI TIẾT LỖI ===');
      console.error('Tên lỗi:', error.name);
      console.error('Message:', error.message);
      
      if (error.response) {
        console.error('Status:', error.response.status);
        console.error('Data:', error.response.data);
        
        // Xử lý các trường hợp lỗi cụ thể
        switch (error.response.status) {
          case 401:
            return thunkAPI.rejectWithValue({
              message: 'Phiên đăng nhập hết hạn, vui lòng đăng nhập lại',
              error: error.response.data
            });
          case 403:
            return thunkAPI.rejectWithValue({
              message: 'Bạn không có quyền truy cập thông tin này',
              error: error.response.data
            });
          case 404:
            return thunkAPI.rejectWithValue({
              message: 'Không tìm thấy thông tin địa chỉ',
              error: error.response.data
            });
          default:
            return thunkAPI.rejectWithValue({
              message: 'Có lỗi xảy ra khi lấy danh sách địa chỉ',
              error: error.response.data
            });
        }
      }

      // Nếu là lỗi token
      if (error.message.includes('token') || error.message.includes('đăng nhập')) {
        return thunkAPI.rejectWithValue({
          message: 'Vui lòng đăng nhập lại để tiếp tục',
          error: error.message,
          requireLogin: true
        });
      }

      return thunkAPI.rejectWithValue({
        message: error.message || 'Không thể lấy danh sách địa chỉ',
        error: error.response?.data || error.message
      });
    }
  }
);

// 🆕 Thunk to create a new address
export const createUserAddress = createAsyncThunk(
  'userAddress/create',
  async (addressData, thunkAPI) => {
    try {
      console.log('Creating address with data:', addressData);
      const res = await axios.post(`${BASE_URL}/create`, addressData);
      console.log('Create address response:', res.data);
      
      if (!res.data || !res.data.data) {
        throw new Error('Invalid response format');
      }

      // Ensure all required fields are present
      const address = res.data.data;
      if (!address.wardName || !address.districtName || !address.cityName) {
        console.error('Missing location names in response:', address);
      }

      return address;
    } catch (err) {
      console.error('Error creating address:', err);
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message || 'Create failed'
      );
    }
  }
);

// 🗑️ Thunk to delete an address
export const deleteUserAddress = createAsyncThunk(
  'userAddress/delete',
  async (id, thunkAPI) => {
    try {
      console.log('=== BẮT ĐẦU XÓA ĐỊA CHỈ ===');
      console.log('ID cần xóa:', id);

      // Kiểm tra id
      if (!id) {
        console.error('❌ ID không hợp lệ:', id);
        throw new Error('ID địa chỉ không hợp lệ');
      }

      // Lấy token từ AsyncStorage với try-catch
      let token;
      try {
        token = await AsyncStorage.getItem('@auth_token'); // Thêm prefix @ cho key
        console.log('Token status:', token ? '✅ Đã có token' : '❌ Không có token');
      } catch (tokenError) {
        console.error('❌ Lỗi khi lấy token:', tokenError);
        throw new Error('Không thể lấy token xác thực');
      }

      if (!token) {
        console.error('❌ Token không tồn tại trong AsyncStorage');
        throw new Error('Vui lòng đăng nhập lại');
      }

      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      };
      console.log('Request headers:', config.headers);

      const deleteUrl = `${BASE_URL}/delete/${id}`;
      console.log('URL xóa địa chỉ:', deleteUrl);

      console.log('Đang gửi request xóa...');
      const response = await axios.delete(deleteUrl, config);
      
      console.log('=== THÔNG TIN RESPONSE ===');
      console.log('Status:', response.status);
      console.log('Data:', response.data);

      if (response.status === 200 || response.status === 204) {
        console.log('✅ Xóa địa chỉ thành công!');
        return id;
      }

      throw new Error('Xóa địa chỉ thất bại');

    } catch (error) {
      console.error('=== CHI TIẾT LỖI ===');
      
      if (error.response) {
        // Lỗi từ server
        console.error('Status:', error.response.status);
        console.error('Data:', error.response.data);
        
        // Xử lý lỗi token hết hạn
        if (error.response.status === 401) {
          console.error('❌ Token hết hạn hoặc không hợp lệ');
          return thunkAPI.rejectWithValue({
            message: 'Phiên đăng nhập hết hạn, vui lòng đăng nhập lại',
            error: error.response.data
          });
        }
      } 

      // Trả về message lỗi phù hợp
      return thunkAPI.rejectWithValue({
        message: error.message || 'Có lỗi xảy ra khi xóa địa chỉ',
        error: error.response?.data || error.message
      });
    }
  }
);

const userAddressSlice = createSlice({
  name: 'userAddress',
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder

      // Fetch
      .addCase(fetchUserAddresses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserAddresses.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchUserAddresses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create
      .addCase(createUserAddress.fulfilled, (state, action) => {
        // Kiểm tra xem địa chỉ mới có đầy đủ thông tin không
        if (action.payload) {
          const newAddress = {
            ...action.payload,
            // Đảm bảo các trường này tồn tại
            wardName: action.payload.wardName || '',
            districtName: action.payload.districtName || '',
            cityName: action.payload.cityName || '',
          };
          state.list.unshift(newAddress);
        }
      })
      .addCase(createUserAddress.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Delete
      .addCase(deleteUserAddress.fulfilled, (state, action) => {
        console.log('Filtering addresses. Current list:', state.list);
        console.log('Address ID to remove:', action.payload);
        state.list = state.list.filter(addr => addr.userAddressId !== action.payload);
        console.log('Updated list:', state.list);
      })
      .addCase(deleteUserAddress.rejected, (state, action) => {
        state.error = action.payload;
      });
  }
});

export default userAddressSlice.reducer;
