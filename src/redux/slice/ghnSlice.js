import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = 'https://online-gateway.ghn.vn/shiip/public-api/master-data';

// 1️⃣ Fetch Provinces
export const fetchProvinces = createAsyncThunk('ghn/fetchProvinces', async (_, thunkAPI) => {
  try {
    const res = await axios.get(`${BASE_URL}/province`);
    return res.data.data;
  } catch (err) {
    return thunkAPI.rejectWithValue('Failed to fetch provinces');
  }
});

// 2️⃣ Fetch Districts
export const fetchDistricts = createAsyncThunk('ghn/fetchDistricts', async (_, thunkAPI) => {
  try {
    const res = await axios.get(`${BASE_URL}/district`);
    return res.data.data;
  } catch (err) {
    return thunkAPI.rejectWithValue('Failed to fetch districts');
  }
});

// 3️⃣ Fetch Wards by district_id
export const fetchWardsByDistrict = createAsyncThunk('ghn/fetchWards', async (districtId, thunkAPI) => {
  try {
    const res = await axios.get(`${BASE_URL}/ward`, {
      params: { district_id: districtId },
    });
    return {
      districtId,
      wards: res.data.data,
    };
  } catch (err) {
    return thunkAPI.rejectWithValue('Failed to fetch wards');
  }
});

const ghnSlice = createSlice({
  name: 'ghn',
  initialState: {
    provinces: [],
    districts: [],
    wardsByDistrict: {}, // e.g. { 2021: [ward1, ward2...] }
    loading: false,
    error: null,
  },
  reducers: {
    clearGHNState: (state) => {
      state.provinces = [];
      state.districts = [];
      state.wardsByDistrict = {};
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Provinces
      .addCase(fetchProvinces.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProvinces.fulfilled, (state, action) => {
        state.loading = false;
        state.provinces = action.payload;
      })
      .addCase(fetchProvinces.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Districts
      .addCase(fetchDistricts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDistricts.fulfilled, (state, action) => {
        state.loading = false;
        state.districts = action.payload;
      })
      .addCase(fetchDistricts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Wards by District
      .addCase(fetchWardsByDistrict.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWardsByDistrict.fulfilled, (state, action) => {
        const { districtId, wards } = action.payload;
        state.loading = false;
        state.wardsByDistrict[districtId] = wards;
      })
      .addCase(fetchWardsByDistrict.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearGHNState } = ghnSlice.actions;
export default ghnSlice.reducer;
