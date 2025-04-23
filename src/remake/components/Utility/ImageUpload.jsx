import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { useImageUpload } from "../../hooks/useImageUpload";
import { appColorTheme } from "../../config/appconfig";

export default function ImageUpload({ onUploadComplete, maxFiles = 5 }) {
  const [images, setImages] = useState([]);
  const [uploadedUrls, setUploadedUrls] = useState("");
  const [isUploadComplete, setIsUploadComplete] = useState(false);
  const { uploadMultipleImages, uploading, error } = useImageUpload();

  // Yêu cầu quyền truy cập thư viện ảnh
  useEffect(() => {
    (async () => {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Cần quyền truy cập",
          "Ứng dụng cần quyền truy cập vào thư viện ảnh để tải ảnh lên"
        );
      }
    })();
  }, []);

  // Chọn ảnh từ thư viện
  const pickImages = async () => {
    // Kiểm tra số lượng ảnh hiện tại
    if (images.length >= maxFiles) {
      Alert.alert(
        "Quá nhiều ảnh",
        `Bạn chỉ có thể upload tối đa ${maxFiles} ảnh`
      );
      return;
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 0.8,
        selectionLimit: maxFiles - images.length,
      });

      if (!result.canceled && result.assets) {
        // Kiểm tra kích thước file (max 5MB)
        const validAssets = result.assets.filter((asset) => {
          if (asset.fileSize && asset.fileSize > 5 * 1024 * 1024) {
            Alert.alert(
              "File quá lớn",
              "Kích thước file không được vượt quá 5MB"
            );
            return false;
          }
          return true;
        });

        // Thêm ảnh mới vào state
        setImages((prevImages) => [...prevImages, ...validAssets]);
      }
    } catch (err) {
      Alert.alert("Lỗi", "Không thể chọn ảnh. Vui lòng thử lại.");
    }
  };

  // Chụp ảnh bằng camera
  const takePhoto = async () => {
    if (images.length >= maxFiles) {
      Alert.alert(
        "Quá nhiều ảnh",
        `Bạn chỉ có thể upload tối đa ${maxFiles} ảnh`
      );
      return;
    }

    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Cần quyền truy cập",
          "Ứng dụng cần quyền truy cập camera để chụp ảnh"
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setImages((prevImages) => [...prevImages, ...result.assets]);
      }
    } catch (err) {
      Alert.alert("Lỗi", "Không thể chụp ảnh. Vui lòng thử lại.");
    }
  };

  // Xóa ảnh
  const removeImage = (index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  // Upload ảnh
  const handleUpload = async () => {
    if (images.length === 0) {
      Alert.alert("Chưa có ảnh", "Vui lòng chọn ít nhất một ảnh để tải lên");
      return;
    }

    try {
      const imageUris = images.map((img) => img.uri);
      const results = await uploadMultipleImages(imageUris);
      const imgUrls = results.map((result) => result.url).join(";");

      onUploadComplete(imgUrls);
      setUploadedUrls(imgUrls);
      setIsUploadComplete(true);

      Alert.alert("Thành công", "Tải ảnh lên thành công");
    } catch (err) {
      Alert.alert(
        "Tải ảnh thất bại",
        error || "Có lỗi xảy ra khi tải ảnh lên. Vui lòng thử lại."
      );
    }
  };

  // Hiển thị mỗi ảnh trong danh sách
  const renderImageItem = ({ item, index }) => (
    <View style={styles.imageItemContainer}>
      <Image source={{ uri: item.uri }} style={styles.imagePreview} />
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => removeImage(index)}
      >
        <Ionicons name="close-circle" size={24} color="red" />
      </TouchableOpacity>
    </View>
  );

  // Nếu đã upload thành công, hiển thị các ảnh đã tải lên
  if (isUploadComplete) {
    return (
      <View style={styles.completedContainer}>
        <Text style={styles.successText}>Tải ảnh thành công!</Text>
        <FlatList
          data={uploadedUrls.split(";").map((url) => ({ uri: url }))}
          renderItem={({ item }) => (
            <Image source={{ uri: item.uri }} style={styles.uploadedImage} />
          )}
          keyExtractor={(_, index) => index.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Phần chọn ảnh */}
      <View style={styles.uploadSection}>
        <TouchableOpacity style={styles.uploadButton} onPress={pickImages}>
          <Ionicons
            name="images-outline"
            size={24}
            color={appColorTheme.brown_2}
          />
          <Text style={styles.uploadButtonText}>Chọn ảnh từ thư viện</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.uploadButton} onPress={takePhoto}>
          <Ionicons
            name="camera-outline"
            size={24}
            color={appColorTheme.brown_2}
          />
          <Text style={styles.uploadButtonText}>Chụp ảnh mới</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.helpText}>
        Hỗ trợ: JPG, JPEG, PNG, GIF (Tối đa {maxFiles} ảnh, 5MB/ảnh)
      </Text>

      {/* Hiển thị ảnh đã chọn */}
      {images.length > 0 && (
        <FlatList
          data={images}
          renderItem={renderImageItem}
          keyExtractor={(_, index) => index.toString()}
          horizontal={false}
          numColumns={3}
          contentContainerStyle={styles.imageListContainer}
        />
      )}

      {/* Nút tải lên */}
      {images.length > 0 && (
        <TouchableOpacity
          style={[
            styles.uploadButtonLarge,
            uploading && styles.uploadButtonDisabled,
          ]}
          onPress={handleUpload}
          disabled={uploading}
        >
          {uploading ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <>
              <Ionicons
                name="cloud-upload-outline"
                size={22}
                color="white"
                style={styles.buttonIcon}
              />
              <Text style={styles.uploadButtonLargeText}>
                Tải lên {images.length} ảnh
              </Text>
            </>
          )}
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginVertical: 10,
  },
  uploadSection: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 16,
  },
  uploadButton: {
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
    backgroundColor: "#F7FAFC",
    flex: 1,
    marginHorizontal: 4,
  },
  uploadButtonText: {
    marginTop: 8,
    color: appColorTheme.brown_2,
    textAlign: "center",
  },
  helpText: {
    fontSize: 12,
    color: "#718096",
    textAlign: "center",
    marginBottom: 16,
  },
  imageListContainer: {
    marginVertical: 10,
  },
  imageItemContainer: {
    margin: 4,
    position: "relative",
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  removeButton: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: "white",
    borderRadius: 12,
    elevation: 2,
  },
  uploadButtonLarge: {
    backgroundColor: appColorTheme.green_0,
    borderRadius: 8,
    padding: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },
  uploadButtonDisabled: {
    opacity: 0.7,
  },
  uploadButtonLargeText: {
    color: "white",
    fontWeight: "bold",
  },
  buttonIcon: {
    marginRight: 8,
  },
  completedContainer: {
    width: "100%",
    alignItems: "center",
  },
  successText: {
    color: appColorTheme.green_0,
    fontWeight: "bold",
    marginBottom: 10,
  },
  uploadedImage: {
    width: 120,
    height: 120,
    marginHorizontal: 4,
    borderRadius: 8,
  },
});
