import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const GHN_TOKEN = '8b1c65fd-6180-11ee-96dc-de6f804954c9';
const BASE_URL = 'http://10.0.2.2:8080/api/v1/GHNApi';

// Lấy danh sách tỉnh/thành
export const fetchProvinces = createAsyncThunk(
  'ghn/fetchProvinces',
  async (_, thunkAPI) => {
    try {
      console.log('Fetching provinces...');
      const response = await axios.get(`${BASE_URL}/provinces`);
      console.log('Provinces response:', response.data);
      
      // Kiểm tra và xử lý response theo cấu trúc mới
      if (response.data?.code === 200 && response.data?.data?.data) {
        console.log('Processed provinces:', response.data.data.data);
        return response.data.data.data || [];
      }
      return thunkAPI.rejectWithValue('Không thể lấy danh sách tỉnh thành');
    } catch (error) {
      console.error('Error fetching provinces:', error);
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// Lấy danh sách quận/huyện theo tỉnh/thành
export const fetchDistricts = createAsyncThunk(
  'ghn/fetchDistricts',
  async (provinceId, thunkAPI) => {
    try {
      console.log('Fetching districts for province:', provinceId);
      const response = await axios.get(`${BASE_URL}/districts/${provinceId}`);
      console.log('Districts response:', response.data);
      
      // Kiểm tra và xử lý response theo cấu trúc mới
      if (response.data?.code === 200 && response.data?.data?.data) {
        return {
          provinceId,
          districts: response.data.data.data || []
        };
      }
      return thunkAPI.rejectWithValue('Không thể lấy danh sách quận huyện');
    } catch (error) {
      console.error('Error fetching districts:', error);
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// Lấy danh sách phường/xã theo quận/huyện
export const fetchWards = createAsyncThunk(
  'ghn/fetchWards',
  async (districtId, thunkAPI) => {
    try {
      console.log('Fetching wards for district:', districtId);
      const response = await axios.get(`${BASE_URL}/wards/${districtId}`);
      console.log('Wards response:', response.data);
      
      // Kiểm tra và xử lý response theo cấu trúc mới
      if (response.data?.code === 200 && response.data?.data?.data) {
        return {
          districtId,
          wards: response.data.data.data || []
        };
      }
      return thunkAPI.rejectWithValue('Không thể lấy danh sách phường xã');
    } catch (error) {
      console.error('Error fetching wards:', error);
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const ghnSlice = createSlice({
  name: 'ghn',
  initialState: {
    provinces: [],
    districts: {},  // { provinceId: [districts] }
    wards: {},      // { districtId: [wards] }
    loading: false,
    error: null
  },
  reducers: {
    clearLocationData: (state) => {
      state.districts = {};
      state.wards = {};
    }
  },
  extraReducers: (builder) => {
    builder
      // Provinces
      .addCase(fetchProvinces.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProvinces.fulfilled, (state, action) => {
        state.loading = false;
        state.provinces = action.payload;
        console.log('Provinces loaded:', state.provinces?.length);
      })
      .addCase(fetchProvinces.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        console.error('Failed to load provinces:', action.payload);
      })

      // Districts
      .addCase(fetchDistricts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDistricts.fulfilled, (state, action) => {
        if (action.payload?.provinceId && Array.isArray(action.payload.districts)) {
          state.districts[action.payload.provinceId] = action.payload.districts;
          console.log('Districts loaded for province:', action.payload.provinceId);
        }
        state.loading = false;
      })
      .addCase(fetchDistricts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        console.error('Failed to load districts:', action.payload);
      })

      // Wards
      .addCase(fetchWards.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWards.fulfilled, (state, action) => {
        if (action.payload?.districtId && Array.isArray(action.payload.wards)) {
          state.wards[action.payload.districtId] = action.payload.wards;
          console.log('Wards loaded for district:', action.payload.districtId);
        }
        state.loading = false;
      })
      .addCase(fetchWards.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        console.error('Failed to load wards:', action.payload);
      });
  }
});

export const { clearLocationData } = ghnSlice.actions;
export default ghnSlice.reducer;
