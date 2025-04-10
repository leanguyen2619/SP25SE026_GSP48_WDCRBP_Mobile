import axios from 'axios';

const API_BASE = 'https://provinces.open-api.vn/api';

export const resolveLocation = async ({ cityId, districtId, wardCode }) => {
  try {
    const res = await axios.get(`${API_BASE}/p/${cityId}?depth=3`);
    const cityData = res.data;

    const district = cityData.districts.find((d) => d.code === Number(districtId));
    const ward = district?.wards?.find((w) => w.code === Number(wardCode));

    return {
      city: cityData.name || '',
      district: district?.name || '',
      ward: ward?.name || '',
    };
  } catch (err) {
    console.error('Lỗi khi fetch địa danh:', err);
    return { city: '', district: '', ward: '' };
  }
};
