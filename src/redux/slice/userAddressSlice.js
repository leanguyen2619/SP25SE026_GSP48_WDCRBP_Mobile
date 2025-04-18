import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { Platform } from 'react-native';

const BASE_URL = Platform.OS === 'android'
  ? 'http://10.0.2.2:8080/api/v1/useraddresses'
  : 'http://localhost:8080/api/v1/useraddresses';

/* -------------------------------------------------------------------------- */
/*                              📥 FETCH ADDRESSES                            */
/* -------------------------------------------------------------------------- */
export const fetchUserAddresses = createAsyncThunk(
  'userAddress/fetch',
  async (userId, thunkAPI) => {
    try {
      console.log('📥 Fetching user addresses for userId:', userId);
      if (!userId) throw new Error('Vui lòng đăng nhập để xem địa chỉ');

      const response = await axios.get(`${BASE_URL}/user/${userId}`);
      console.log('✅ API response:', response.data);

      const addresses = Array.isArray(response.data.data)
        ? response.data.data
        : [response.data.data];

      const normalizedAddresses = addresses.map(addr => ({
        ...addr,
        userAddressId: addr.userAddressId || addr.id,
        wardName: addr.wardName || '',
        districtName: addr.districtName || '',
        cityName: addr.cityName || '',
      }));

      console.log('📦 Fetched addresses:', normalizedAddresses);
      return normalizedAddresses;
    } catch (error) {
      console.error('❌ Error fetching addresses:', error);

      return thunkAPI.rejectWithValue({
        message: error.message || 'Không thể lấy danh sách địa chỉ',
        error: error.response?.data || error.message,
      });
    }
  }
);

/* -------------------------------------------------------------------------- */
/*                            ➕ CREATE NEW ADDRESS                            */
/* -------------------------------------------------------------------------- */
export const createUserAddress = createAsyncThunk(
  'userAddress/create',
  async (addressData, thunkAPI) => {
    try {
      console.log('➕ Creating address with data:', addressData);
      const res = await axios.post(`${BASE_URL}/create`, addressData);
      console.log('✅ Create address response:', res.data);

      if (!res.data || !res.data.data) {
        throw new Error('Invalid response format');
      }

      const address = res.data.data;
      return {
        ...address,
        wardName: address.wardName || '',
        districtName: address.districtName || '',
        cityName: address.cityName || '',
      };
    } catch (err) {
      console.error('❌ Error creating address:', err);
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message || 'Tạo địa chỉ thất bại'
      );
    }
  }
);

/* -------------------------------------------------------------------------- */
/*                            🗑️ DELETE USER ADDRESS                          */
/* -------------------------------------------------------------------------- */
export const deleteUserAddress = createAsyncThunk(
  'userAddress/delete',
  async (id, thunkAPI) => {
    try {
      console.log('🗑️ Deleting address ID:', id);
      if (!id) throw new Error('ID địa chỉ không hợp lệ');

      const deleteUrl = `${BASE_URL}/delete/${id}`;
      console.log('🔗 DELETE URL:', deleteUrl);

      const response = await axios.delete(deleteUrl);
      console.log('✅ Delete response:', response.data);

      if (response.status === 200 || response.status === 204) {
        return id;
      }

      throw new Error('Xóa địa chỉ thất bại');
    } catch (error) {
      console.error('❌ Error deleting address:', error);

      return thunkAPI.rejectWithValue({
        message: error.message || 'Có lỗi xảy ra khi xóa địa chỉ',
        error: error.response?.data || error.message,
      });
    }
  }
);

/* -------------------------------------------------------------------------- */
/*                              🔧 REDUX SLICE                                */
/* -------------------------------------------------------------------------- */
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
      // 🔄 FETCH
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

      // ➕ CREATE
      .addCase(createUserAddress.fulfilled, (state, action) => {
        if (action.payload) {
          const newAddress = action.payload;
          state.list.unshift(newAddress);
        }
      })
      .addCase(createUserAddress.rejected, (state, action) => {
        state.error = action.payload;
      })

      // 🗑️ DELETE
      .addCase(deleteUserAddress.fulfilled, (state, action) => {
        state.list = state.list.filter(addr => addr.userAddressId !== action.payload);
      })
      .addCase(deleteUserAddress.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default userAddressSlice.reducer;
