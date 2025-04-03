import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { Platform } from 'react-native'; // ✅ Import Platform

// ✅ Auto-switch base URL depending on platform
const API_URL =
  Platform.OS === 'android'
    ? 'http://10.0.2.2:8080/api/v1/user'
    : 'http://localhost:8080/api/v1/user';

// ✅ Async thunk to fetch user by ID
export const fetchUserById = createAsyncThunk(
  'user/fetchUserById',
  async (userId, thunkAPI) => {
    try {
      const url = `${API_URL}/getUserInformationById/${userId}`;
      console.log('🔁 Fetching user from:', url); // helpful debug log
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error('❌ Fetch failed:', error.message);
      console.log('🔍 Error details:', error.response?.data || error);
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Fetch failed');
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState: {
    profile: {},
    loading: false,
    error: null,
  },
  reducers: {
    updateProfileLocally: (state, action) => {
      state.profile = { ...state.profile, ...action.payload };
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { updateProfileLocally } = userSlice.actions;
export default userSlice.reducer;
