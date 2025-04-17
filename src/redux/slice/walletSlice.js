import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { Platform } from 'react-native';

// ✅ Set base URL depending on platform (Android or iOS)
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

// 🔄 Async thunk to update wallet balance
export const updateWallet = createAsyncThunk(
  'wallet/updateWallet',
  async ({ walletId, amount, token }, thunkAPI) => {
    try {
      const res = await axios.put(
        `${BASE_URL}/update`,
        { walletId, amount },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        }
      );
      return res.data; // Return the updated wallet data
    } catch (error) {
      console.error('❌ Error updating wallet:', error.message);
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to update wallet'
      );
    }
  }
);

// 🔄 Redux slice for wallet state
const walletSlice = createSlice({
  name: 'wallet',
  initialState: {
    wallet: null,
    status: 'idle', // idle | loading | succeeded | failed
    error: null,
  },
  reducers: {
    // Action to clear wallet data
    clearWallet: (state) => {
      state.wallet = null;
      state.error = null;
      state.status = 'idle';
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch wallet actions
      .addCase(fetchWallet.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchWallet.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.wallet = action.payload;
      })
      .addCase(fetchWallet.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // Update wallet actions
      .addCase(updateWallet.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(updateWallet.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.wallet = action.payload; // Updating the wallet with new data
      })
      .addCase(updateWallet.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { clearWallet } = walletSlice.actions;

export default walletSlice.reducer;
