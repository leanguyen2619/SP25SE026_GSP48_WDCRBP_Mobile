import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { Platform } from 'react-native';

// Smart API base
const BASE_URL =
  Platform.OS === 'android'
    ? 'http://10.0.2.2:8080/api/v1'
    : 'http://localhost:8080/api/v1';

export const registerWoodworker = createAsyncThunk(
  'woodworkerRegister/register',
  async (data, thunkAPI) => {
    try {
      const res = await axios.post(`${BASE_URL}/ww/ww-register`, data, {
        headers: { 'Content-Type': 'application/json' },
      });
      return res.data;
    } catch (error) {
      console.log('❌ Register error:', error.response?.data || error.message);
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Đăng ký thất bại'
      );
    }
  }
);

const woodworkerRegisterSlice = createSlice({
  name: 'woodworkerRegister',
  initialState: {
    loading: false,
    success: false,
    error: null,
    data: null,
  },
  reducers: {
    resetRegisterState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
      state.data = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerWoodworker.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(registerWoodworker.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.data = action.payload;
      })
      .addCase(registerWoodworker.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      });
  }
});

export const { resetRegisterState } = woodworkerRegisterSlice.actions;
export default woodworkerRegisterSlice.reducer;
