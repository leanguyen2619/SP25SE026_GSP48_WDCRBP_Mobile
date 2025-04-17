import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { Platform } from 'react-native';

const BASE_URL = Platform.OS === 'android'
  ? 'http://10.0.2.2:8080/api/v1/transaction'
  : 'http://localhost:8080/api/v1/transaction';

// ✅ Thunk to update transaction status
export const updateTransaction = createAsyncThunk(
  'transaction/update',
  async ({ transactionId, status }, thunkAPI) => {
    try {
      const response = await axios.put(`${BASE_URL}/update-status`, {
        transactionId: parseInt(transactionId),
        status,
        canceledAt: new Date().toISOString(),
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Update transaction failed');
    }
  }
);

// ✅ Thunk to fetch user transactions
export const fetchUserTransactions = createAsyncThunk(
  'transaction/fetchUserTransactions',
  async ({ userId }, thunkAPI) => {
    try {
      const response = await axios.get(`${BASE_URL}/user/${userId}`);
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Lấy giao dịch thất bại');
    }
  }
);

// ✅ SINGLE slice definition
const transactionSlice = createSlice({
  name: 'transaction',
  initialState: {
    transactions: [],
    transaction: null,
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // 🟢 updateTransaction
      .addCase(updateTransaction.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateTransaction.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.transaction = action.payload;
      })
      .addCase(updateTransaction.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // 🟢 fetchUserTransactions
      .addCase(fetchUserTransactions.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUserTransactions.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.transactions = action.payload;
      })
      .addCase(fetchUserTransactions.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default transactionSlice.reducer;
