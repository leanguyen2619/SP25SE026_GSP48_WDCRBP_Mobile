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
import { addressService } from '../../../services/addressService';
import { useDispatch } from 'react-redux';
import { createUserAddress } from '../../../redux/slice/userAddressSlice';
import CustomAlert from '../../common/Alert/CustomAlert';


const AddAddressModal = ({ isVisible, onClose, userId }) => {
  const dispatch = useDispatch();
  const [errorVisible, setErrorVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');


  const [isDefault, setIsDefault] = useState(true);
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  const [selectedCity, setSelectedCity] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedWard, setSelectedWard] = useState('');
  const [address, setAddress] = useState('');

  const [loadingDistricts, setLoadingDistricts] = useState(false);
  const [loadingWards, setLoadingWards] = useState(false);

  useEffect(() => {
    if (isVisible) {
      loadCities();
      resetForm();
    }
  }, [isVisible]);

  const resetForm = () => {
    setSelectedCity('');
    setSelectedDistrict('');
    setSelectedWard('');
    setAddress('');
    setDistricts([]);
    setWards([]);
    setIsDefault(true);
  };

  const loadCities = async () => {
    try {
      const data = await addressService.getCities();
      setCities(data);
    } catch (e) {
      Alert.alert('Lỗi', 'Không thể tải danh sách tỉnh/thành phố');
    }
  };

  const handleCityChange = async (cityId) => {
    setSelectedCity(cityId);
    setSelectedDistrict('');
    setSelectedWard('');
    setDistricts([]);
    setWards([]);
    setLoadingDistricts(true);
    try {
      const data = await addressService.getDistrictsByCity(cityId);
      setDistricts(data);
    } catch (e) {
      Alert.alert('Lỗi', 'Không thể tải danh sách quận/huyện');
    }
    setLoadingDistricts(false);
  };

  const handleDistrictChange = async (districtId) => {
    setSelectedDistrict(districtId);
    setSelectedWard('');
    setWards([]);
    setLoadingWards(true);
    try {
      const data = await addressService.getWardsByDistrict(districtId);
      setWards(data);
    } catch (e) {
      Alert.alert('Lỗi', 'Không thể tải danh sách phường/xã');
    }
    setLoadingWards(false);
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
        // 👇 Clean and format the message
        const cleanMsg = (res.payload || '').replace('Không thể thực thi:', '').trim();
        setErrorMessage(cleanMsg);
        setErrorVisible(true);
        return;
      }
      onClose();
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

        <Picker selectedValue={selectedCity} onValueChange={handleCityChange}>
          <Picker.Item label="Chọn tỉnh/thành phố" value="" />
          {cities.map((city) => (
            <Picker.Item key={city.id} label={city.name} value={city.id} />
          ))}
        </Picker>

        {loadingDistricts ? (
          <ActivityIndicator color="orange" />
        ) : (
          <Picker
            selectedValue={selectedDistrict}
            onValueChange={handleDistrictChange}
            enabled={districts.length > 0}
          >
            <Picker.Item label="Chọn quận/huyện" value="" />
            {districts.map((d) => (
              <Picker.Item key={d.id} label={d.name} value={d.id} />
            ))}
          </Picker>
        )}

        {loadingWards ? (
          <ActivityIndicator color="orange" />
        ) : (
          <Picker
            selectedValue={selectedWard}
            onValueChange={setSelectedWard}
            enabled={wards.length > 0}
          >
            <Picker.Item label="Chọn phường/xã" value="" />
            {wards.map((w) => (
              <Picker.Item key={w.code} label={w.name} value={w.code} />
            ))}
          </Picker>
        )}

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
