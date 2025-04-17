import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { Platform } from 'react-native';

const BASE_URL = Platform.OS === 'android'
  ? 'http://10.0.2.2:8080/api/v1/GHNApi'
  : 'http://localhost:8080/api/v1/GHNApi';

export const fetchWards = createAsyncThunk('ward/fetchWards', async (districtId, thunkAPI) => {
  try {
    const response = await axios.get(`${BASE_URL}/wards/${districtId}`);
    return response.data.data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Lỗi khi lấy phường/xã');
  }
});

const wardSlice = createSlice({
  name: 'ward',
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearWards: (state) => {
      state.data = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWards.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWards.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchWards.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearWards } = wardSlice.actions;
export default wardSlice.reducer;
