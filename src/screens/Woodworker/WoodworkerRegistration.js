import React, { useState } from 'react';
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
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { appColorTheme } from '../../theme/colors';

const WoodworkerRegistration = () => {
  const navigation = useNavigation();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    workshopName: '',
    businessType: '',
    address: '',
    taxCode: '',
    description: '',
    image: null,
  });

  const pickImage = async () => {
    try {
      // Yêu cầu quyền truy cập thư viện ảnh
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          alert('Xin lỗi, chúng tôi cần quyền truy cập thư viện ảnh để thực hiện chức năng này!');
          return;
        }
      }

      // Mở thư viện ảnh để chọn
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: [ImagePicker.MediaType.Images],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
        maxWidth: 1000,
        maxHeight: 1000,
      });

      if (!result.canceled) {
        setFormData({ ...formData, image: result.assets[0] });
      }
    } catch (error) {
      console.error('Lỗi khi chọn ảnh:', error);
      alert('Có lỗi xảy ra khi chọn ảnh. Vui lòng thử lại!');
    }
  };

  const handleSubmit = () => {
    // Xử lý logic đăng ký ở đây
    console.log('Form data:', formData);
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
          <Text style={styles.label}>Loại hình kinh doanh <Text style={styles.required}>*</Text></Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={formData.businessType}
              onValueChange={(value) => setFormData({...formData, businessType: value})}
              style={styles.picker}
            >
              <Picker.Item label="Chọn loại hình" value="" />
              <Picker.Item label="Doanh nghiệp tư nhân" value="private" />
              <Picker.Item label="Công ty TNHH" value="limited" />
              <Picker.Item label="Công ty cổ phần" value="joint_stock" />
              <Picker.Item label="Hộ kinh doanh" value="household" />
            </Picker>
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Địa chỉ xưởng <Text style={styles.required}>*</Text></Text>
          <TextInput
            style={styles.input}
            placeholder="Nhập địa chỉ xưởng"
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
                <Icon name="cloud-upload" size={48} color={appColorTheme.brown_0} />
                <Text style={styles.uploadText}>Kéo thả ảnh vào đây hoặc click để chọn</Text>
                <Text style={styles.uploadHint}>(Tối đa 1 ảnh)</Text>
                <Text style={styles.uploadFormat}>Hỗ trợ: JPG, JPEG, PNG, GIF (Tối đa 5MB)</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Đăng ký</Text>
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
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  imageUpload: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: appColorTheme.brown_2,
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: appColorTheme.brown_0 + '10',
    minHeight: 200,
  },
  uploadPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  uploadText: {
    color: appColorTheme.brown_0,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  uploadHint: {
    color: appColorTheme.brown_0,
    fontSize: 14,
    fontWeight: '500',
  },
  uploadFormat: {
    color: appColorTheme.brown_1,
    fontSize: 12,
    marginTop: 4,
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
  selectedImageContainer: {
    width: '100%',
    height: 200,
    position: 'relative',
  },
  selectedImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  removeImageButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: appColorTheme.brown_0,
    borderRadius: 12,
    padding: 4,
  },
});

export default WoodworkerRegistration; 