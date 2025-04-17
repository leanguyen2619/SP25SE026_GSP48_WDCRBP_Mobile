export const getFullAddressFromIds = ({ address, city_id, district_id, ward_code }, provinces, districts, wards) => {
    const cityName = provinces.find(p => p.ProvinceID === parseInt(city_id))?.ProvinceName || '';
    const districtName = districts.find(d => d.DistrictID === parseInt(district_id))?.DistrictName || '';
    const wardName = wards.find(w => w.WardCode === ward_code)?.WardName || '';
  
    return `${address}, ${wardName}, ${districtName}, ${cityName}`;
  };
  