import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { Platform } from 'react-native';

// 🔧 Smart platform-based localhost fix
const BASE_URL = Platform.OS === 'android'
  ? 'http://10.0.2.2:8080/api/v1/products'
  : 'http://localhost:8080/api/v1/products';

// ✅ AsyncThunk to fetch ALL products
export const fetchAllProducts = createAsyncThunk(
  'product/fetchAll',
  async (_, thunkAPI) => {
    try {
      const res = await axios.get(BASE_URL);
      return res.data.data; // only the array
    } catch (error) {
      console.error('❌ Error fetching products:', error.message);
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch products');
    }
  }
);

// ✅ Product slice
const productSlice = createSlice({
  name: 'product',
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearProducts: (state) => {
      state.list = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchAllProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearProducts } = productSlice.actions;
export default productSlice.reducer;
