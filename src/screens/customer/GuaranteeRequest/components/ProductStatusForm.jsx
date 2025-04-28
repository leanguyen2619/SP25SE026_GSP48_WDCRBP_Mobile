import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";
import ImageUpdateUploader from "../../../../components/Utility/ImageUpdateUploader.jsx";
import ImageListSelector from "../../../../components/Utility/ImageListSelector.jsx";
import GuaranteeErrorSelection from "./GuaranteeErrorSelection.jsx";

export default function ProductStatusForm({
  currentProductStatus,
  setCurrentProductStatus,
  currentProductImages,
  handleUploadComplete,
  isWarrantyValid,
  guaranteeError,
  setGuaranteeError,
  isGuarantee,
  setIsGuarantee,
  woodworkerId,
}) {
  // Toggle between guarantee and repair
  const toggleGuaranteeMode = () => {
    setIsGuarantee(!isGuarantee);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Tình trạng sản phẩm hiện tại</Text>

      {isWarrantyValid && (
        <View style={styles.modeSelection}>
          <View style={styles.labelContainer}>
            <Text style={styles.labelText}>Hình thức yêu cầu:</Text>
            <View
              style={[
                styles.badge,
                isGuarantee ? styles.greenBadge : styles.blueBadge,
              ]}
            >
              <Text style={styles.badgeText}>
                {isGuarantee ? "Bảo hành" : "Sửa chữa"}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={[
              styles.toggleButton,
              isGuarantee ? styles.blueButton : styles.greenButton,
            ]}
            onPress={toggleGuaranteeMode}
          >
            <Text style={styles.toggleButtonText}>
              {isGuarantee
                ? "Không tìm thấy lỗi của bạn, chuyển sang sửa chữa"
                : "Chuyển về bảo hành"}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {isWarrantyValid && isGuarantee && (
        <GuaranteeErrorSelection
          woodworkerId={woodworkerId}
          guaranteeError={guaranteeError}
          setGuaranteeError={setGuaranteeError}
        />
      )}

      <View style={styles.formGroup}>
        <Text style={styles.label}>
          Mô tả tình trạng hiện tại: <Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          style={styles.textArea}
          value={currentProductStatus}
          onChangeText={setCurrentProductStatus}
          placeholder="Mô tả chi tiết tình trạng sản phẩm và nêu rõ vấn đề bạn gặp phải..."
          multiline={true}
          numberOfLines={4}
          textAlignVertical="top"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>
          Hình ảnh tình trạng hiện tại: <Text style={styles.required}>*</Text>
        </Text>
        <ImageUpdateUploader
          imgUrls=""
          maxFiles={3}
          onUploadComplete={handleUploadComplete}
        />
        {currentProductImages.length > 0 && (
          <View style={styles.imagePreview}>
            <Text style={styles.previewLabel}>Hình ảnh đã tải lên:</Text>
            <ImageListSelector imgUrls={currentProductImages} imgH={100} />
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  heading: {
    fontSize: 17,
    fontWeight: "600",
    marginBottom: 15,
  },
  modeSelection: {
    marginBottom: 15,
  },
  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  labelText: {
    fontWeight: "500",
    marginRight: 8,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  greenBadge: {
    backgroundColor: "rgba(56, 161, 105, 0.1)",
  },
  blueBadge: {
    backgroundColor: "rgba(49, 130, 206, 0.1)",
  },
  badgeText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#2F855A",
  },
  toggleButton: {
    borderWidth: 1,
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignSelf: "flex-start",
  },
  blueButton: {
    borderColor: "#3182CE",
  },
  greenButton: {
    borderColor: "#38A169",
  },
  toggleButtonText: {
    fontSize: 13,
    color: "#2C5282",
    fontWeight: "500",
  },
  formGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 6,
  },
  required: {
    color: "#E53E3E",
  },
  textArea: {
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 6,
    padding: 10,
    minHeight: 100,
    fontSize: 14,
  },
  imagePreview: {
    marginTop: 15,
  },
  previewLabel: {
    fontWeight: "500",
    marginBottom: 8,
  },
});
