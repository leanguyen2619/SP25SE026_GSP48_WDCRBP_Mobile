import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { Platform } from 'react-native';

const BASE_URL = Platform.OS === 'android'
  ? 'http://10.0.2.2:8080/api/v1/GHNApi'
  : 'http://localhost:8080/api/v1/GHNApi';

export const fetchProvinces = createAsyncThunk('province/fetchProvinces', async (_, thunkAPI) => {
  try {
    const response = await axios.get(`${BASE_URL}/provinces`);
    return response.data.data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Lỗi khi lấy tỉnh/thành');
  }
});

const provinceSlice = createSlice({
  name: 'province',
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearProvinces: (state) => {
      state.data = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProvinces.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProvinces.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchProvinces.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearProvinces } = provinceSlice.actions;
export default provinceSlice.reducer;
