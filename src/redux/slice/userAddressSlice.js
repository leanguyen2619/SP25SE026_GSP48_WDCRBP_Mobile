import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { Platform } from 'react-native';

const BASE_URL = Platform.OS === 'android'
  ? 'http://10.0.2.2:8080/api/v1/useraddresses'
  : 'http://localhost:8080/api/v1/useraddresses';

// 🧨 Thunk to fetch addresses by userId
export const fetchUserAddresses = createAsyncThunk(
  'userAddress/fetch',
  async (userId, thunkAPI) => {
    try {
      const res = await axios.get(`${BASE_URL}/user/${userId}`);
      return res.data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Fetch failed');
    }
  }
);

// 🆕 Thunk to create a new address
export const createUserAddress = createAsyncThunk(
  'userAddress/create',
  async (addressData, thunkAPI) => {
    try {
      const res = await axios.post(`${BASE_URL}/create`, addressData);
      // 👇 return full address for adding manually to list
      return res.data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Create failed');
    }
  }
);

// 🗑️ Thunk to delete an address
export const deleteUserAddress = createAsyncThunk(
  'userAddress/delete',
  async (id, thunkAPI) => {
    try {
      await axios.delete(`${BASE_URL}/delete/${id}`);
      return id;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Delete failed');
    }
  }
);

const userAddressSlice = createSlice({
  name: 'userAddress',
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder

      // Fetch
      .addCase(fetchUserAddresses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserAddresses.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchUserAddresses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create
      .addCase(createUserAddress.fulfilled, (state, action) => {
        state.list.unshift(action.payload); // Add to top
      })
      .addCase(createUserAddress.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Delete
      .addCase(deleteUserAddress.fulfilled, (state, action) => {
        state.list = state.list.filter(addr => addr.id !== action.payload);
      })
      .addCase(deleteUserAddress.rejected, (state, action) => {
        state.error = action.payload;
      });
  }
});

export default userAddressSlice.reducer;
