// redux/slice/paymentSlice.js
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

      // Just in case: backend wraps the response, return what matters
      const { url } = res.data;
      if (!url) {
        return thunkAPI.rejectWithValue('Không nhận được VNPay URL từ máy chủ');
      }

      return { url }; // Only return what's needed
    } catch (err) {
      console.error('🔴 Payment error:', err);
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || 'Top-up failed'
      );
    }
  }
);
