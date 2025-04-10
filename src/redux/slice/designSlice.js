import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = Platform.OS === 'android'
  ? 'http://10.0.2.2:8080'
  : 'http://localhost:8080';

const API_ENDPOINT = `${API_URL}/api/v1/designIdea`;
const IMAGE_BASE_URL = `${API_URL}/api/v1/designs/images`;

export const fetchDesignDetail = createAsyncThunk(
  'design/fetchDetail',
  async (designId, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      const response = await axios.get(`${API_ENDPOINT}/getDesignById/${designId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('Full API Response:', JSON.stringify(response.data, null, 2));
      
      if (response.data?.data) {
        const designData = response.data.data;
        console.log('Design Data:', JSON.stringify(designData, null, 2));
        
        // Xử lý URL hình ảnh
        let imageUrls = [];
        if (designData.img_urls) {
          imageUrls = Array.isArray(designData.img_urls) ? designData.img_urls : [designData.img_urls];
        } else if (designData.imgurl) {
          imageUrls = [designData.imgurl];
        } else if (designData.image_url) {
          imageUrls = [designData.image_url];
        }

        // Thêm base URL nếu cần thiết
        imageUrls = imageUrls.map(url => {
          if (url && !url.startsWith('http')) {
            return `${API_URL}${url}`;
          }
          return url;
        });

        console.log('Processed Image URLs:', imageUrls);

        return {
          ...designData,
          img_urls: imageUrls,
          totalStar: Number(designData.totalStar || 0),
          totalReviews: Number(designData.totalReviews || 0),
          price: Number(designData.price || 5000000),
        };
      }
      return rejectWithValue('Không tìm thấy thông tin thiết kế');
    } catch (error) {
      console.error('Error fetching design detail:', error);
      return rejectWithValue(error.response?.data?.message || 'Không thể tải thông tin chi tiết');
    }
  }
);

const designSlice = createSlice({
  name: 'design',
  initialState: {
    currentDesign: null,
    loading: false,
    error: null
  },
  reducers: {
    clearDesign: (state) => {
      state.currentDesign = null;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDesignDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDesignDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.currentDesign = action.payload;
      })
      .addCase(fetchDesignDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearDesign } = designSlice.actions;
export default designSlice.reducer; 