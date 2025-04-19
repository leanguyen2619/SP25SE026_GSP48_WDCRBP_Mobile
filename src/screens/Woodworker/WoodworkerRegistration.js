import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';

import { addressService } from '../../services/addressService';
import { registerWoodworker, resetRegisterState } from '../../redux/slice/woodworkerRegisterSlice';
import { appColorTheme } from '../../theme/colors';

const WoodworkerRegistration = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.woodworkerRegister);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    workshopName: '',
    address: '',
    cityId: '',
    districtId: '',
    wardCode: '',
    taxCode: '',
    description: '',
    imgUrl: '',
    image: null,
  });

  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [loadingCities, setLoadingCities] = useState(false);
  const [loadingDistricts, setLoadingDistricts] = useState(false);
  const [loadingWards, setLoadingWards] = useState(false);

  useEffect(() => {
    loadCities();
  }, []);

  const loadCities = async () => {
    try {
      setLoadingCities(true);
      const data = await addressService.getCities();
      setCities(data);
    } catch (err) {
      Alert.alert('Lỗi', err.message);
    } finally {
      setLoadingCities(false);
    }
  };

  const handleCityChange = async (cityId) => {
    setFormData((prev) => ({ ...prev, cityId, districtId: '', wardCode: '' }));
    setDistricts([]);
    setWards([]);

    try {
      setLoadingDistricts(true);
      const data = await addressService.getDistrictsByCity(cityId);
      setDistricts(data);
    } catch (err) {
      Alert.alert('Lỗi', err.message);
    } finally {
      setLoadingDistricts(false);
    }
  };

  const handleDistrictChange = async (districtId) => {
    setFormData((prev) => ({ ...prev, districtId, wardCode: '' }));
    setWards([]);

    try {
      setLoadingWards(true);
      const data = await addressService.getWardsByDistrict(districtId);
      setWards(data);
    } catch (err) {
      Alert.alert('Lỗi', err.message);
    } finally {
      setLoadingWards(false);
    }
  };

  const pickImage = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (permission.status !== 'granted') {
        Alert.alert('Quyền bị từ chối', 'Ứng dụng cần quyền truy cập thư viện ảnh');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        base64: true,
        quality: 0.8,
      });

      if (result.canceled || !result.assets || !result.assets[0].base64) {
        console.log('❌ Người dùng huỷ chọn ảnh hoặc không có ảnh');
        return;
      }

      const localUri = result.assets[0].uri;
      setFormData((prev) => ({ ...prev, image: { uri: localUri } }));
      Alert.alert('Đang tải ảnh...', 'Vui lòng chờ vài giây.');

      const base64Image = result.assets[0].base64;
      const apiKey = Constants.expoConfig.extra.imgbbApiKey;

      const formDataUpload = new FormData();
      formDataUpload.append('image', base64Image);

      const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: 'POST',
        body: formDataUpload,
      });

      const json = await response.json();

      if (json.success) {
        const uploadedUrl = json.data.url;
        console.log('✅ Uploaded image URL:', uploadedUrl);
        setFormData((prev) => ({ ...prev, imgUrl: uploadedUrl }));
      } else {
        console.error('❌ Upload failed:', json);
        Alert.alert('Lỗi', 'Tải ảnh lên thất bại, vui lòng thử lại.');
      }
    } catch (error) {
      console.error('❌ Image picker error:', error);
      Alert.alert('Lỗi', 'Không thể chọn hoặc tải ảnh.');
    }
  };

  const validateForm = () => {
    const {
      fullName, email, phone, workshopName, address,
      cityId, districtId, wardCode, taxCode, description, imgUrl
    } = formData;

    if (!fullName || !email || !phone || !workshopName || !address || !cityId ||
      !districtId || !wardCode || !taxCode || !description || !imgUrl) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin và chọn ảnh.');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const payload = {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        wardCode: formData.wardCode,
        districtId: formData.districtId,
        cityId: formData.cityId,
        businessType: 'Cá nhân',
        taxCode: formData.taxCode,
        brandName: formData.workshopName,
        bio: formData.description,
        imgUrl: formData.imgUrl,
      };

      await dispatch(registerWoodworker(payload)).unwrap();

      Alert.alert('Thành công', 'Đăng ký thành công! Kiểm tra email để nhận mật khẩu.', [
        { text: 'OK', onPress: () => navigation.navigate('Login') },
      ]);
      dispatch(resetRegisterState());
    } catch (err) {
      Alert.alert('Lỗi', err.message || 'Đăng ký thất bại');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        <Text style={styles.sectionTitle}>Đăng ký xưởng mộc</Text>

        <TextInputField label="Họ và tên" value={formData.fullName} onChange={(text) => setFormData({ ...formData, fullName: text })} />
        <TextInputField label="Email" keyboardType="email-address" value={formData.email} onChange={(text) => setFormData({ ...formData, email: text })} />
        <TextInputField label="Số điện thoại" keyboardType="phone-pad" value={formData.phone} onChange={(text) => setFormData({ ...formData, phone: text })} />
        <TextInputField label="Tên xưởng" value={formData.workshopName} onChange={(text) => setFormData({ ...formData, workshopName: text })} />

        <PickerInput label="Tỉnh/Thành phố" selectedValue={formData.cityId} onChange={handleCityChange} items={cities} loading={loadingCities} />
        <PickerInput label="Quận/Huyện" selectedValue={formData.districtId} onChange={handleDistrictChange} items={districts} loading={loadingDistricts} enabled={!!formData.cityId} />
        <PickerInput label="Phường/Xã" selectedValue={formData.wardCode} onChange={(code) => setFormData({ ...formData, wardCode: code })} items={wards} loading={loadingWards} enabled={!!formData.districtId} />

        <TextInputField label="Địa chỉ cụ thể" value={formData.address} onChange={(text) => setFormData({ ...formData, address: text })} />
        <TextInputField label="Mã số thuế" value={formData.taxCode} onChange={(text) => setFormData({ ...formData, taxCode: text })} />
        <TextInputField label="Giới thiệu" multiline value={formData.description} onChange={(text) => setFormData({ ...formData, description: text })} />

        {/* Image Upload Field */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>
            Ảnh đại diện cho xưởng <Text style={styles.required}>*</Text>
          </Text>
          <TouchableOpacity style={styles.imageUpload} onPress={pickImage}>
            {formData.image?.uri ? (
              <Image source={{ uri: formData.image.uri }} style={styles.selectedImage} />
            ) : (
              <View style={styles.uploadPlaceholder}>
                <Icon name="cloud-upload" size={32} color="#888" />
                <Text style={styles.uploadText}>Chọn ảnh từ thiết bị</Text>
              </View>
            )}
          </TouchableOpacity>
          {/* 🔒 Removed text below the image per teacher’s instruction */}
        </View>


        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={loading}>
          {loading ? <ActivityIndicator color="white" /> : <Text style={styles.submitButtonText}>Đăng ký</Text>}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

// Reusable components
const TextInputField = ({ label, value, onChange, ...rest }) => (
  <View style={styles.inputContainer}>
    <Text style={styles.label}>{label} <Text style={styles.required}>*</Text></Text>
    <TextInput style={styles.input} value={value} onChangeText={onChange} {...rest} />
  </View>
);

const PickerInput = ({ label, selectedValue, onChange, items, loading, enabled = true }) => (
  <View style={styles.inputContainer}>
    <Text style={styles.label}>{label} <Text style={styles.required}>*</Text></Text>
    <View style={[styles.pickerContainer, !enabled && styles.disabledPicker]}>
      {loading ? (
        <ActivityIndicator size="small" />
      ) : (
        <Picker selectedValue={selectedValue} onValueChange={onChange} enabled={enabled} style={styles.picker}>
          <Picker.Item label={`Chọn ${label}`} value="" />
          {items.map((item) => (
            <Picker.Item key={item.id || item.code} label={item.name} value={item.id || item.code} />
          ))}
        </Picker>
      )}
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { padding: 16 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 16 },
  inputContainer: { marginBottom: 16 },
  label: { fontSize: 14, marginBottom: 6 },
  required: { color: 'red' },
  input: {
    borderWidth: 1, borderColor: '#ccc', borderRadius: 8,
    padding: 12, fontSize: 16
  },
  pickerContainer: {
    borderWidth: 1, borderColor: '#ccc', borderRadius: 8,
    overflow: 'hidden'
  },
  picker: { height: 50 },
  disabledPicker: { opacity: 0.5 },
  imageUpload: {
    width: '100%', height: 200, borderWidth: 2, borderColor: '#ccc',
    borderStyle: 'dashed', borderRadius: 8,
    justifyContent: 'center', alignItems: 'center'
  },
  selectedImage: { width: '100%', height: '100%', borderRadius: 8 },
  uploadPlaceholder: { justifyContent: 'center', alignItems: 'center' },
  uploadText: { marginTop: 8, color: '#888' },
  submitButton: {
    backgroundColor: appColorTheme.brown_0 || '#8B4513',
    padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 20
  },
  submitButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' }
});

export default WoodworkerRegistration;
