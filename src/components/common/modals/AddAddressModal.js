import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Switch,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Modal from 'react-native-modal';
import { Picker } from '@react-native-picker/picker';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProvinces } from '../../../redux/slice/provinceSlice';
import { fetchDistricts, clearDistricts } from '../../../redux/slice/districtSlice';
import { fetchWards, clearWards } from '../../../redux/slice/wardSlice';
import { createUserAddress } from '../../../redux/slice/userAddressSlice';
import CustomAlert from '../../common/Alert/CustomAlert';

const AddAddressModal = ({ isVisible, onClose, userId, onSuccess }) => {
  const dispatch = useDispatch();

  const provinces = useSelector((state) => state.province.data);
  const districts = useSelector((state) => state.district.data);
  const wards = useSelector((state) => state.ward.data);
  const districtLoading = useSelector((state) => state.district.loading);
  const wardLoading = useSelector((state) => state.ward.loading);

  const [selectedCity, setSelectedCity] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedWard, setSelectedWard] = useState('');
  const [address, setAddress] = useState('');
  const [isDefault, setIsDefault] = useState(true);

  const [errorVisible, setErrorVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (isVisible) {
      dispatch(fetchProvinces());
      resetForm();
    }
  }, [isVisible]);

  const resetForm = () => {
    setSelectedCity('');
    setSelectedDistrict('');
    setSelectedWard('');
    setAddress('');
    setIsDefault(true);
    dispatch(clearDistricts());
    dispatch(clearWards());
  };

  const handleCityChange = (cityId) => {
    setSelectedCity(cityId);
    setSelectedDistrict('');
    setSelectedWard('');
    dispatch(fetchDistricts(cityId));
    dispatch(clearWards());
  };

  const handleDistrictChange = (districtId) => {
    setSelectedDistrict(districtId);
    setSelectedWard('');
    dispatch(fetchWards(districtId));
  };

  const handleSubmit = () => {
    if (!selectedCity || !selectedDistrict || !selectedWard || !address) {
      Alert.alert('Thiếu thông tin', 'Vui lòng điền đầy đủ các trường.');
      return;
    }

    const payload = {
      isDefault,
      address,
      wardCode: selectedWard,
      districtId: selectedDistrict,
      cityId: selectedCity,
      userId,
    };

    dispatch(createUserAddress(payload)).then((res) => {
      if (res.meta.requestStatus === 'rejected') {
        const cleanMsg = (res.payload || '').replace('Không thể thực thi:', '').trim();
        setErrorMessage(cleanMsg);
        setErrorVisible(true);
        return;
      }
      onSuccess?.(); // Refresh list in parent
    });
  };

  return (
    <Modal isVisible={isVisible} onBackdropPress={onClose}>
      <View style={styles.modalContent}>
        <Text style={styles.title}>Thêm địa chỉ</Text>

        <View style={styles.switchRow}>
          <Text>Mặc định</Text>
          <Switch value={isDefault} onValueChange={setIsDefault} />
        </View>

        {/* Province */}
        <Picker selectedValue={selectedCity} onValueChange={handleCityChange}>
          <Picker.Item label="Chọn tỉnh/thành phố" value="" />
          {provinces.map((city) => (
            <Picker.Item key={city.ProvinceID} label={city.ProvinceName} value={city.ProvinceID} />
          ))}
        </Picker>

        {/* District */}
        {districtLoading ? (
          <ActivityIndicator color="orange" />
        ) : (
          <Picker
            selectedValue={selectedDistrict}
            onValueChange={handleDistrictChange}
            enabled={districts.length > 0}
          >
            <Picker.Item label="Chọn quận/huyện" value="" />
            {districts.map((d) => (
              <Picker.Item key={d.DistrictID} label={d.DistrictName} value={d.DistrictID} />
            ))}
          </Picker>
        )}

        {/* Ward */}
        {wardLoading ? (
          <ActivityIndicator color="orange" />
        ) : (
          <Picker
            selectedValue={selectedWard}
            onValueChange={(val) => setSelectedWard(val)}
            enabled={wards.length > 0}
          >
            <Picker.Item label="Chọn phường/xã" value="" />
            {wards.map((w) => (
              <Picker.Item key={w.WardCode} label={w.WardName} value={w.WardCode} />
            ))}
          </Picker>
        )}

        {/* Address */}
        <TextInput
          placeholder="Nhập địa chỉ cụ thể (số nhà, tên đường...)"
          value={address}
          onChangeText={setAddress}
          style={styles.input}
        />

        <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
          <Text style={styles.submitText}>Thêm</Text>
        </TouchableOpacity>
      </View>

      <CustomAlert
        visible={errorVisible}
        message={errorMessage}
        onClose={() => setErrorVisible(false)}
      />
    </Modal>
  );
};

export default AddAddressModal;

const styles = StyleSheet.create({
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 10,
    textAlign: 'center',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    alignItems: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginVertical: 12,
  },
  submitBtn: {
    backgroundColor: '#28a745',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
