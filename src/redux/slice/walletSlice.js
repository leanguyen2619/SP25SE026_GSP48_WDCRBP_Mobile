import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { Platform } from 'react-native';

// ✅ Set base URL depending on platform
const BASE_URL = Platform.OS === 'android'
  ? 'http://10.0.2.2:8080/api/v1/wallet'
  : 'http://localhost:8080/api/v1/wallet';

// 🧠 Async thunk to fetch wallet for user
export const fetchWallet = createAsyncThunk(
  'wallet/fetchWallet',
  async ({ userId, token }, thunkAPI) => {
    try {
      const res = await axios.get(`${BASE_URL}/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      });
      return res.data.data; // just the wallet object
    } catch (error) {
      console.error('❌ Error fetching wallet:', error.message);
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to fetch wallet'
      );
    }
  }
);

// 🔄 Redux slice
const walletSlice = createSlice({
  name: 'wallet',
  initialState: {
    wallet: null,
    status: 'idle', // idle | loading | succeeded | failed
    error: null,
  },
  reducers: {
    clearWallet: (state) => {
      state.wallet = null;
      state.error = null;
      state.status = 'idle';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWallet.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchWallet.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.wallet = action.payload;
      })
      .addCase(fetchWallet.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { clearWallet } = walletSlice.actions;
export default walletSlice.reducer;
