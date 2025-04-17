import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { Platform } from 'react-native';

const BASE_URL = Platform.OS === 'android'
  ? 'http://10.0.2.2:8080/api/v1/payment'
  : 'http://localhost:8080/api/v1/payment';

export const topUpWallet = createAsyncThunk(
  'payment/topUpWallet',
  async (data, thunkAPI) => {
    try {
      const res = await axios.post(`${BASE_URL}/mobile/top-up-wallet`, data, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });

      const url = res.data?.data?.url;
      if (!url) {
        return thunkAPI.rejectWithValue('Không nhận được VNPay URL từ máy chủ');
      }

      return { url };
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || 'Top-up failed'
      );
    }
  }
);

const paymentSlice = createSlice({
  name: 'payment',
  initialState: { url: null, status: 'idle', error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(topUpWallet.fulfilled, (state, action) => {
        state.url = action.payload.url;
        state.status = 'succeeded';
      })
      .addCase(topUpWallet.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Payment failed';
      });
  },
});

export default paymentSlice.reducer;
