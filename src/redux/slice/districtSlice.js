import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { Platform } from 'react-native';

const BASE_URL = Platform.OS === 'android'
  ? 'http://10.0.2.2:8080/api/v1/GHNApi'
  : 'http://localhost:8080/api/v1/GHNApi';

export const fetchDistricts = createAsyncThunk('district/fetchDistricts', async (provinceId, thunkAPI) => {
  try {
    const response = await axios.get(`${BASE_URL}/districts/${provinceId}`);
    return response.data.data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Lỗi khi lấy quận/huyện');
  }
});

const districtSlice = createSlice({
  name: 'district',
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearDistricts: (state) => {
      state.data = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDistricts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDistricts.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchDistricts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearDistricts } = districtSlice.actions;
export default districtSlice.reducer;
