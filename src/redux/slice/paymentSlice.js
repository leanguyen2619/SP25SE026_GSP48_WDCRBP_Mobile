import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { Platform } from 'react-native';

const BASE_URL = Platform.OS === 'android'
  ? 'http://10.0.2.2:8080/api/v1/payment'
  : 'http://localhost:8080/api/v1/payment';

export const topUpWallet = createAsyncThunk(
  'payment/topUpWallet',
  async (data, thunkAPI) => {
    try {
      const res = await axios.post(`${BASE_URL}/top-up-wallet`, data, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });

      // Log the full response for debugging
      console.log('Response from API:', res);

      // Ensure the correct response structure from backend
      const { url } = res.data.data || {};  // Accessing the nested data object

      if (!url) {
        return thunkAPI.rejectWithValue('Không nhận được VNPay URL từ máy chủ');
      }

      return { url };  // Only return what's needed
    } catch (err) {
      console.error('🔴 Payment error:', err);
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || 'Top-up failed'
      );
    }
  }
);

// The reducer to handle actions from topUpWallet
import { createSlice } from '@reduxjs/toolkit';

const paymentSlice = createSlice({
  name: 'payment',
  initialState: { url: null, status: 'idle', error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(topUpWallet.fulfilled, (state, action) => {
        state.url = action.payload.url; // Store the URL in the state
        state.status = 'succeeded';
      })
      .addCase(topUpWallet.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Payment failed';
      });
  },
});

export default paymentSlice.reducer;
