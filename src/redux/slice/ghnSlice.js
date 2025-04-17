import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { Platform } from 'react-native';

const BASE_URL =
  Platform.OS === 'android'
    ? 'http://10.0.2.2:8080/api/v1/GHNApi'
    : 'http://localhost:8080/api/v1/GHNApi';

// ===============================
// Thunks
// ===============================

// Fetch provinces
export const fetchProvinces = createAsyncThunk('ghn/fetchProvinces', async (_, thunkAPI) => {
  try {
    const response = await axios.get(`${BASE_URL}/provinces`);
    return response.data.data.data; // ⬅️ Dig down to the actual array
    console.log('Provinces response:', response.data); // Debug log
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Lỗi khi lấy tỉnh/thành');
  }
});

// Fetch districts by provinceId
export const fetchDistricts = createAsyncThunk('ghn/fetchDistricts', async (provinceId, thunkAPI) => {
  try {
    const response = await axios.get(`${BASE_URL}/districts/${provinceId}`);
    console.log('Districts response:', response.data); // Debug log
    return response.data.data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Lỗi khi lấy quận/huyện');
  }
});

// Fetch wards by districtId
export const fetchWards = createAsyncThunk('ghn/fetchWards', async (districtId, thunkAPI) => {
  try {
    const response = await axios.get(`${BASE_URL}/wards/${districtId}`);
    console.log('Wards response:', response.data); // Debug log
    return response.data.data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Lỗi khi lấy phường/xã');
  }
});


// ===============================
// Slice
// ===============================
const ghnSlice = createSlice({
  name: 'ghn',
  initialState: {
    provinces: [],
    districts: [],
    wards: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearGhnData: (state) => {
      state.provinces = [];
      state.districts = [];
      state.wards = [];
      state.error = null;
    },
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
      })
      .addCase(fetchProvinces.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Districts
      .addCase(fetchDistricts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDistricts.fulfilled, (state, action) => {
        state.loading = false;
        state.districts = action.payload;
      })
      .addCase(fetchDistricts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Wards
      .addCase(fetchWards.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWards.fulfilled, (state, action) => {
        state.loading = false;
        state.wards = action.payload;
      })
      .addCase(fetchWards.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearGhnData } = ghnSlice.actions;
export default ghnSlice.reducer;
