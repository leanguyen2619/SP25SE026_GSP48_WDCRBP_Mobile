import axios from 'axios';

const API_URL = 'https://provinces.open-api.vn/api';

export const addressService = {
  // Lấy danh sách tỉnh/thành phố
  getCities: async () => {
    try {
      const response = await axios.get(`${API_URL}/p`);
      return response.data.map(city => ({
        id: city.code.toString(),
        name: city.name
      }));
    } catch (error) {
      console.error('Get cities error:', error);
      throw new Error('Không thể lấy danh sách tỉnh/thành phố');
    }
  },

  // Lấy danh sách quận/huyện theo tỉnh/thành phố
  getDistrictsByCity: async (cityCode) => {
    try {
      const response = await axios.get(`${API_URL}/p/${cityCode}?depth=2`);
      return response.data.districts.map(district => ({
        id: district.code.toString(),
        name: district.name
      }));
    } catch (error) {
      console.error('Get districts error:', error);
      throw new Error('Không thể lấy danh sách quận/huyện');
    }
  },

  // Lấy danh sách phường/xã theo quận/huyện
  getWardsByDistrict: async (districtCode) => {
    try {
      const response = await axios.get(`${API_URL}/d/${districtCode}?depth=2`);
      return response.data.wards.map(ward => ({
        code: ward.code.toString(),
        name: ward.name
      }));
    } catch (error) {
      console.error('Get wards error:', error);
      throw new Error('Không thể lấy danh sách phường/xã');
    }
  }
}; 