import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { useImageUpload } from "../../hooks/useImageUpload";
import { appColorTheme } from "../../config/appconfig";

export default function ImageUpdateUploader({
  onUploadComplete,
  maxFiles = 5,
  imgUrls = "",
}) {
  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isUploadComplete, setIsUploadComplete] = useState(false);
  const { uploadMultipleImages, uploading, error } = useImageUpload();

  // Phân tích imgUrls để hiển thị hình ảnh hiện có
  useEffect(() => {
    if (imgUrls) {
      const initialUrls = imgUrls
        .split(";")
        .filter((url) => url.trim().length > 0);
      if (initialUrls.length > 0) {
        setExistingImages(
          initialUrls.map((url) => ({ uri: url, isExisting: true }))
        );
      }
    }
  }, [imgUrls]);

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

  // Tổng số ảnh (cũ + mới)
  const totalImages = existingImages.length + newImages.length;

  // Chọn ảnh từ thư viện
  const pickImages = async () => {
    if (totalImages >= maxFiles) {
      Alert.alert(
        "Quá nhiều ảnh",
        `Bạn chỉ có thể tải lên tối đa ${maxFiles} ảnh`
      );
      return;
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 0.8,
        selectionLimit: maxFiles - totalImages,
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

        setNewImages((prev) => [...prev, ...validAssets]);
      }
    } catch (err) {
      Alert.alert("Lỗi", "Không thể chọn ảnh. Vui lòng thử lại.");
    }
  };

  // Chụp ảnh từ camera
  const takePhoto = async () => {
    if (totalImages >= maxFiles) {
      Alert.alert(
        "Quá nhiều ảnh",
        `Bạn chỉ có thể tải lên tối đa ${maxFiles} ảnh`
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
        setNewImages((prev) => [...prev, ...result.assets]);
      }
    } catch (err) {
      Alert.alert("Lỗi", "Không thể chụp ảnh. Vui lòng thử lại.");
    }
  };

  // Xóa ảnh (cả ảnh cũ và mới)
  const removeImage = (index, isExisting) => {
    if (isExisting) {
      setExistingImages((prev) => prev.filter((_, i) => i !== index));
    } else {
      setNewImages((prev) => prev.filter((_, i) => i !== index));
    }
  };

  // Tải lên ảnh mới và cập nhật danh sách ảnh
  const handleUpload = async () => {
    try {
      setIsUploading(true);

      // Nếu có ảnh mới, tải lên
      let newImageUrls = [];
      if (newImages.length > 0) {
        const imageUris = newImages.map((img) => img.uri);
        const results = await uploadMultipleImages(imageUris);
        newImageUrls = results.map((result) => result.url);
      }

      // Kết hợp URL ảnh cũ và URL ảnh mới
      const existingUrls = existingImages.map((img) => img.uri);
      const allUrls = [...existingUrls, ...newImageUrls];

      if (allUrls.length > 0) {
        onUploadComplete(allUrls.join(";"));
        setIsUploadComplete(true);
        Alert.alert("Thành công", "Cập nhật ảnh thành công");
      } else {
        Alert.alert("Cảnh báo", "Không có ảnh nào được chọn");
      }
    } catch (err) {
      Alert.alert(
        "Cập nhật thất bại",
        error || "Có lỗi xảy ra khi tải lên ảnh. Vui lòng thử lại."
      );
    } finally {
      setIsUploading(false);
    }
  };

  // Khôi phục trạng thái ban đầu
  const handleCancel = () => {
    if (imgUrls) {
      const initialUrls = imgUrls
        .split(";")
        .filter((url) => url.trim().length > 0);
      setExistingImages(
        initialUrls.map((url) => ({ uri: url, isExisting: true }))
      );
    } else {
      setExistingImages([]);
    }
    setNewImages([]);
  };

  // Hiển thị mỗi ảnh (ảnh cũ hoặc ảnh mới)
  const renderImageItem = (item, index, isExisting) => (
    <View style={styles.imageContainer} key={index}>
      <Image source={{ uri: item.uri }} style={styles.image} />
      {!isUploadComplete && (
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => removeImage(index, isExisting)}
        >
          <Ionicons name="close-circle" size={22} color="red" />
        </TouchableOpacity>
      )}
    </View>
  );

  // Kết hợp ảnh cũ và ảnh mới để hiển thị
  const renderAllImages = () => {
    return (
      <View style={styles.imagesGrid}>
        {existingImages.map((item, index) =>
          renderImageItem(item, index, true)
        )}
        {newImages.map((item, index) => renderImageItem(item, index, false))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Phần tải lên ảnh */}
      {totalImages < maxFiles && !isUploadComplete && (
        <View style={styles.uploadSection}>
          <TouchableOpacity style={styles.uploadButton} onPress={pickImages}>
            <Ionicons
              name="images-outline"
              size={24}
              color={appColorTheme.brown_2}
            />
            <Text style={styles.uploadButtonText}>Thư viện ảnh</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.uploadButton} onPress={takePhoto}>
            <Ionicons
              name="camera-outline"
              size={24}
              color={appColorTheme.brown_2}
            />
            <Text style={styles.uploadButtonText}>Chụp ảnh</Text>
          </TouchableOpacity>
        </View>
      )}

      <Text style={styles.helpText}>
        Tối đa {maxFiles} ảnh, mỗi ảnh không quá 5MB
      </Text>

      {/* Hiển thị ảnh (cả cũ và mới) */}
      {totalImages > 0 && renderAllImages()}

      {/* Nút lưu và hủy */}
      {!isUploadComplete && (
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
            <Text style={styles.cancelButtonText}>Hiện ảnh ban đầu</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.updateButton,
              (isUploading || totalImages === 0) && styles.disabledButton,
            ]}
            onPress={handleUpload}
            disabled={isUploading || totalImages === 0}
          >
            {isUploading ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <>
                <Ionicons
                  name="cloud-upload-outline"
                  size={16}
                  color="white"
                  style={styles.buttonIcon}
                />
                <Text style={styles.updateButtonText}>Cập nhật ảnh</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
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
  imagesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    marginVertical: 10,
  },
  imageContainer: {
    position: "relative",
    margin: 4,
  },
  image: {
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
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  cancelButton: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 8,
    marginRight: 8,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#4A5568",
  },
  updateButton: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: appColorTheme.green_0,
    padding: 10,
    borderRadius: 8,
    marginLeft: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  updateButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonIcon: {
    marginRight: 8,
  },
});
