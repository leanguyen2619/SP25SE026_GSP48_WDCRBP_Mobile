import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';

const IMGBB_API_KEY = Constants.expoConfig.extra.imgbbApiKey;

export const pickAndUploadImage = async () => {
  try {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      alert('Quyền truy cập thư viện ảnh bị từ chối');
      return null;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      base64: true,
      quality: 0.8,
    });

    if (result.canceled || !result.assets || !result.assets[0].base64) {
      console.log('❌ Người dùng huỷ chọn ảnh hoặc không có ảnh');
      return null;
    }

    const base64Image = result.assets[0].base64;

    const formData = new FormData();
    formData.append('image', base64Image);

    const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
      method: 'POST',
      body: formData,
    });

    const json = await response.json();

    if (json.success) {
      console.log('✅ Uploaded image URL:', json.data.url);
      return json.data.url;
    } else {
      console.error('❌ Upload failed:', json);
      return null;
    }
  } catch (err) {
    console.error('❌ Error during upload:', err);
    return null;
  }
};
