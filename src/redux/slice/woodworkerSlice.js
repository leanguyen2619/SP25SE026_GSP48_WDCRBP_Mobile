// src/redux/slice/woodworkerSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { Platform } from 'react-native'; // ✅ platform-aware

// ✅ Smart API base depending on emulator/device
const API_URL =
  Platform.OS === 'android'
    ? 'http://10.0.2.2:8080/api/v1/ww'
    : 'http://localhost:8080/api/v1/ww';

// ✅ Thunk to fetch woodworker list
export const fetchWoodworkers = createAsyncThunk(
  'woodworker/fetchAll',
  async (_, thunkAPI) => {
    try {
      console.log('🌲 Fetching woodworkers from:', API_URL);
      const response = await axios.get(API_URL);
      return response.data.data;
    } catch (error) {
      console.error('❌ Error fetching woodworkers:', error.message);
      console.log('🔍 Error details:', error.response?.data || error);
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Fetch woodworkers failed'
      );
    }
  }
);

const woodworkerSlice = createSlice({
  name: 'woodworker',
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {
    // You can add things like update locally or clear state if needed
    clearWoodworkers: (state) => {
      state.list = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWoodworkers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWoodworkers.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchWoodworkers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearWoodworkers } = woodworkerSlice.actions;
export default woodworkerSlice.reducer;
