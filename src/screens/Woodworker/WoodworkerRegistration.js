import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Image,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { appColorTheme } from '../../theme/colors';
import { authService } from '../../services/authService';

const CITIES = [
  { id: '1', name: 'Hồ Chí Minh' },
  { id: '2', name: 'Hà Nội' },
  { id: '3', name: 'Đà Nẵng' },
  { id: '4', name: 'Cần Thơ' },
  { id: '5', name: 'Hải Phòng' },
  { id: '6', name: 'Bình Dương' },
  { id: '7', name: 'Đồng Nai' },
  { id: '8', name: 'Bà Rịa - Vũng Tàu' },
  { id: '9', name: 'Long An' },
  { id: '10', name: 'Quảng Ninh' },
];

const DISTRICTS = {
  '1': [ // Hồ Chí Minh
    { id: '1', name: 'Quận 1' },
    { id: '2', name: 'Quận 3' },
    { id: '3', name: 'Quận 4' },
    { id: '4', name: 'Quận 5' },
    { id: '5', name: 'Quận 6' },
    { id: '6', name: 'Quận 7' },
    { id: '7', name: 'Quận 8' },
    { id: '8', name: 'Quận 10' },
    { id: '9', name: 'Quận 11' },
    { id: '10', name: 'Quận Bình Thạnh' },
    { id: '11', name: 'Quận Gò Vấp' },
    { id: '12', name: 'Quận Phú Nhuận' },
    { id: '13', name: 'Quận Tân Bình' },
    { id: '14', name: 'Quận Tân Phú' },
  ],
  '2': [ // Hà Nội
    { id: '15', name: 'Quận Ba Đình' },
    { id: '16', name: 'Quận Hoàn Kiếm' },
    { id: '17', name: 'Quận Hai Bà Trưng' },
    { id: '18', name: 'Quận Đống Đa' },
    { id: '19', name: 'Quận Tây Hồ' },
    { id: '20', name: 'Quận Cầu Giấy' },
    { id: '21', name: 'Quận Thanh Xuân' },
    { id: '22', name: 'Quận Hoàng Mai' },
  ],
  '3': [ // Đà Nẵng
    { id: '23', name: 'Quận Hải Châu' },
    { id: '24', name: 'Quận Thanh Khê' },
    { id: '25', name: 'Quận Sơn Trà' },
    { id: '26', name: 'Quận Ngũ Hành Sơn' },
    { id: '27', name: 'Quận Liên Chiểu' },
  ],
};

const WARDS = {
  '1': [ // Quận 1 - HCM
    { code: 'W1', name: 'Phường Bến Nghé' },
    { code: 'W2', name: 'Phường Bến Thành' },
    { code: 'W3', name: 'Phường Cô Giang' },
    { code: 'W4', name: 'Phường Cầu Kho' },
    { code: 'W5', name: 'Phường Cầu Ông Lãnh' },
  ],
  '2': [ // Quận 3 - HCM
    { code: 'W6', name: 'Phường 1' },
    { code: 'W7', name: 'Phường 2' },
    { code: 'W8', name: 'Phường 3' },
    { code: 'W9', name: 'Phường 4' },
    { code: 'W10', name: 'Phường 5' },
  ],
  '10': [ // Quận Bình Thạnh - HCM
    { code: 'W21', name: 'Phường 1' },
    { code: 'W22', name: 'Phường 2' },
    { code: 'W23', name: 'Phường 3' },
    { code: 'W24', name: 'Phường 5' },
    { code: 'W25', name: 'Phường 6' },
    { code: 'W26', name: 'Phường 7' },
    { code: 'W27', name: 'Phường 11' },
    { code: 'W28', name: 'Phường 12' },
    { code: 'W29', name: 'Phường 13' },
    { code: 'W30', name: 'Phường 14' },
    { code: 'W31', name: 'Phường 15' },
    { code: 'W32', name: 'Phường 17' },
    { code: 'W33', name: 'Phường 19' },
    { code: 'W34', name: 'Phường 21' },
    { code: 'W35', name: 'Phường 22' },
    { code: 'W36', name: 'Phường 24' },
    { code: 'W37', name: 'Phường 25' },
    { code: 'W38', name: 'Phường 26' },
    { code: 'W39', name: 'Phường 27' },
    { code: 'W40', name: 'Phường 28' },
  ],
  '15': [ // Quận Ba Đình - HN
    { code: 'W11', name: 'Phường Phúc Xá' },
    { code: 'W12', name: 'Phường Trúc Bạch' },
    { code: 'W13', name: 'Phường Vĩnh Phúc' },
    { code: 'W14', name: 'Phường Cống Vị' },
    { code: 'W15', name: 'Phường Liễu Giai' },
  ],
  '23': [ // Quận Hải Châu - ĐN
    { code: 'W16', name: 'Phường Hải Châu 1' },
    { code: 'W17', name: 'Phường Hải Châu 2' },
    { code: 'W18', name: 'Phường Nam Dương' },
    { code: 'W19', name: 'Phường Phước Ninh' },
    { code: 'W20', name: 'Phường Hòa Thuận Tây' },
  ],
};

const WoodworkerRegistration = () => {
  const navigation = useNavigation();
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
    image: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  useEffect(() => {
    setCities(CITIES);
  }, []);

  const handleCityChange = (cityId) => {
    setFormData({ ...formData, cityId, districtId: '', wardCode: '' });
    setDistricts(DISTRICTS[cityId] || []);
    setWards([]);
  };

  const handleDistrictChange = (districtId) => {
    setFormData({ ...formData, districtId, wardCode: '' });
    setWards(WARDS[districtId] || []);
  };

  const pickImage = async () => {
    try {
      // Hiển thị lựa chọn giữa camera và thư viện ảnh
      Alert.alert(
        "Chọn ảnh",
        "Vui lòng chọn nguồn ảnh",
        [
          {
            text: "Máy ảnh",
            onPress: async () => {
              const { status } = await ImagePicker.requestCameraPermissionsAsync();
              if (status !== 'granted') {
                alert('Xin lỗi, chúng tôi cần quyền truy cập camera!');
                return;
              }

              const result = await ImagePicker.launchCameraAsync({
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
              });

              if (!result.canceled && result.assets && result.assets.length > 0) {
                setFormData({
                  ...formData,
                  image: { uri: result.assets[0].uri }
                });
              }
            }
          },
          {
            text: "Thư viện ảnh",
            onPress: async () => {
              const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
              if (status !== 'granted') {
                alert('Xin lỗi, chúng tôi cần quyền truy cập thư viện ảnh!');
                return;
              }

              const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
              });

              if (!result.canceled && result.assets && result.assets.length > 0) {
                setFormData({
                  ...formData,
                  image: { uri: result.assets[0].uri }
                });
              }
            }
          },
          {
            text: "Hủy",
            style: "cancel"
          }
        ]
      );
    } catch (error) {
      console.error('Lỗi khi chọn ảnh:', error);
      alert('Không thể chọn ảnh. Vui lòng thử lại!');
    }
  };

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập họ và tên');
      return false;
    }
    if (!formData.email.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập email');
      return false;
    }
    if (!formData.phone.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập số điện thoại');
      return false;
    }
    if (!formData.workshopName.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập tên xưởng');
      return false;
    }
    if (!formData.cityId) {
      Alert.alert('Lỗi', 'Vui lòng chọn Tỉnh/Thành phố');
      return false;
    }
    if (!formData.districtId) {
      Alert.alert('Lỗi', 'Vui lòng chọn Quận/Huyện');
      return false;
    }
    if (!formData.wardCode) {
      Alert.alert('Lỗi', 'Vui lòng chọn Phường/Xã');
      return false;
    }
    if (!formData.address.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập địa chỉ cụ thể');
      return false;
    }
    if (!formData.taxCode.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập mã số thuế');
      return false;
    }
    if (!formData.description.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập giới thiệu về xưởng');
      return false;
    }
    if (!formData.image) {
      Alert.alert('Lỗi', 'Vui lòng chọn ảnh đại diện cho xưởng');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    try {
      if (!validateForm()) {
        return;
      }

      setIsLoading(true);

      // Tạo FormData để gửi file
      const formDataToSend = new FormData();

      // Thêm thông tin cơ bản
      formDataToSend.append('fullName', formData.fullName);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('phone', formData.phone);
      formDataToSend.append('address', formData.address);
      formDataToSend.append('wardCode', formData.wardCode);
      formDataToSend.append('districtId', formData.districtId);
      formDataToSend.append('cityId', formData.cityId);
      formDataToSend.append('taxCode', formData.taxCode);
      formDataToSend.append('brandName', formData.workshopName);
      formDataToSend.append('bio', formData.description);

      // Xử lý ảnh
      if (formData.image) {
        const imageUri = formData.image.uri;
        const imageName = imageUri.split('/').pop();
        const match = /\.(\w+)$/.exec(imageName);
        const imageType = match ? `image/${match[1]}` : 'image/jpeg';

        formDataToSend.append('image', {
          uri: imageUri,
          name: imageName,
          type: imageType,
        });
      }

      // Gọi API đăng ký
      const response = await authService.registerWoodworker(formDataToSend);
      
      if (response.success) {
        Alert.alert(
          'Thành công',
          'Đăng ký thông tin xưởng mộc thành công!',
          [
            {
              text: 'OK',
              onPress: () => navigation.navigate('WoodworkerDashboard')
            }
          ]
        );
      } else {
        Alert.alert('Lỗi', response.message || 'Đã có lỗi xảy ra khi đăng ký');
      }
    } catch (error) {
      console.error('Lỗi đăng ký:', error);
      Alert.alert(
        'Lỗi',
        error.message || 'Đã có lỗi xảy ra khi đăng ký. Vui lòng thử lại sau.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const pickerHeaderStyle = {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#8B4513', // Màu nâu cho tiêu đề
    textTransform: 'uppercase',
  };

  const pickerItemStyle = {
    fontSize: 14,
    color: '#333333', // Màu tối cho các lựa chọn
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color={appColorTheme.black_0} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Đăng ký thông tin xưởng mộc</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.sectionTitle}>Thông tin người đại diện</Text>
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Họ và tên <Text style={styles.required}>*</Text></Text>
          <TextInput
            style={styles.input}
            placeholder="Nhập họ và tên"
            value={formData.fullName}
            onChangeText={(text) => setFormData({...formData, fullName: text})}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email <Text style={styles.required}>*</Text></Text>
          <TextInput
            style={styles.input}
            placeholder="Nhập email"
            keyboardType="email-address"
            value={formData.email}
            onChangeText={(text) => setFormData({...formData, email: text})}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Số điện thoại <Text style={styles.required}>*</Text></Text>
          <TextInput
            style={styles.input}
            placeholder="Nhập số điện thoại"
            keyboardType="phone-pad"
            value={formData.phone}
            onChangeText={(text) => setFormData({...formData, phone: text})}
          />
        </View>

        <Text style={[styles.sectionTitle, styles.marginTop]}>Thông tin xưởng mộc</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Tên xưởng <Text style={styles.required}>*</Text></Text>
          <TextInput
            style={styles.input}
            placeholder="Nhập tên xưởng"
            value={formData.workshopName}
            onChangeText={(text) => setFormData({...formData, workshopName: text})}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Tỉnh/Thành phố <Text style={styles.required}>*</Text></Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={formData.cityId}
              onValueChange={handleCityChange}
              style={styles.picker}
              itemStyle={styles.pickerItem}
              mode="dropdown"
            >
              <Picker.Item label="Chọn Tỉnh/Thành phố" value="" />
              {CITIES.map((city) => (
                <Picker.Item 
                  key={city.id} 
                  label={city.name} 
                  value={city.id}
                />
              ))}
            </Picker>
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Quận/Huyện <Text style={styles.required}>*</Text></Text>
          <View style={[
            styles.pickerContainer,
            !formData.cityId && styles.disabledPicker
          ]}>
            <Picker
              selectedValue={formData.districtId}
              onValueChange={handleDistrictChange}
              style={styles.picker}
              itemStyle={styles.pickerItem}
              mode="dropdown"
              enabled={!!formData.cityId}
            >
              <Picker.Item label="Chọn Quận/Huyện" value="" />
              {DISTRICTS[formData.cityId]?.map((district) => (
                <Picker.Item 
                  key={district.id} 
                  label={district.name} 
                  value={district.id}
                />
              ))}
            </Picker>
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Phường/Xã <Text style={styles.required}>*</Text></Text>
          <View style={[
            styles.pickerContainer,
            !formData.districtId && styles.disabledPicker
          ]}>
            <Picker
              selectedValue={formData.wardCode}
              onValueChange={(wardCode) => setFormData({...formData, wardCode})}
              style={styles.picker}
              itemStyle={styles.pickerItem}
              mode="dropdown"
              enabled={!!formData.districtId}
            >
              <Picker.Item label="Chọn Phường/Xã" value="" />
              {WARDS[formData.districtId]?.map((ward) => (
                <Picker.Item 
                  key={ward.code} 
                  label={ward.name} 
                  value={ward.code}
                />
              ))}
            </Picker>
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Địa chỉ cụ thể <Text style={styles.required}>*</Text></Text>
          <TextInput
            style={styles.input}
            placeholder="Nhập số nhà, tên đường"
            value={formData.address}
            onChangeText={(text) => setFormData({...formData, address: text})}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Mã số thuế <Text style={styles.required}>*</Text></Text>
          <TextInput
            style={styles.input}
            placeholder="Nhập mã số thuế"
            value={formData.taxCode}
            onChangeText={(text) => setFormData({...formData, taxCode: text})}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Giới thiệu <Text style={styles.required}>*</Text></Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Giới thiệu về xưởng mộc của bạn"
            multiline
            numberOfLines={4}
            value={formData.description}
            onChangeText={(text) => setFormData({...formData, description: text})}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Ảnh đại diện cho xưởng <Text style={styles.required}>*</Text></Text>
          <TouchableOpacity style={styles.imageUpload} onPress={pickImage}>
            {formData.image ? (
              <View style={styles.selectedImageContainer}>
                <Image
                  source={{ uri: formData.image.uri }}
                  style={styles.selectedImage}
                />
                <TouchableOpacity
                  style={styles.removeImageButton}
                  onPress={() => setFormData({ ...formData, image: null })}
                >
                  <Icon name="close" size={20} color={appColorTheme.white_0} />
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.uploadPlaceholder}>
                <Icon name="add-photo-alternate" size={40} color={appColorTheme.grey_0} />
                <Text style={styles.uploadText}>Chọn ảnh từ thư viện</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={[
            styles.submitButton,
            isLoading && styles.submitButtonDisabled
          ]} 
          onPress={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color={appColorTheme.white_0} />
          ) : (
            <Text style={styles.submitButtonText}>Đăng ký</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appColorTheme.white_0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: appColorTheme.grey_1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: appColorTheme.black_0,
  },
  placeholder: {
    width: 24,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: appColorTheme.black_0,
    marginBottom: 16,
  },
  marginTop: {
    marginTop: 24,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    color: appColorTheme.black_0,
  },
  required: {
    color: 'red',
  },
  input: {
    borderWidth: 1,
    borderColor: appColorTheme.grey_1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: appColorTheme.grey_1,
    borderRadius: 8,
    marginTop: 5,
    backgroundColor: appColorTheme.white_0,
    height: 50,
  },
  picker: {
    height: 50,
    width: '100%',
    color: appColorTheme.black_0,
  },
  pickerItem: {
    color: appColorTheme.black_0,
    fontSize: 16,
  },
  disabledPicker: {
    opacity: 0.5,
  },
  imageUpload: {
    width: '100%',
    height: 200,
    borderWidth: 2,
    borderColor: appColorTheme.grey_1,
    borderStyle: 'dashed',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    overflow: 'hidden',
  },
  selectedImageContainer: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  selectedImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  removeImageButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadText: {
    marginTop: 8,
    color: appColorTheme.grey_0,
    fontSize: 14,
  },
  submitButton: {
    backgroundColor: appColorTheme.brown_0,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 24,
  },
  submitButtonText: {
    color: appColorTheme.white_0,
    fontSize: 16,
    fontWeight: '600',
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
});

export default WoodworkerRegistration; 