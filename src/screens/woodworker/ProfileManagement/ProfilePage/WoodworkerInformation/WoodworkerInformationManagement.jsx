import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { appColorTheme } from "../../../../../config/appconfig.js";
import ImageUpdateUploader from "../../../../../components/Utility/ImageUpdateUploader.jsx";
import AddressInput from "../../../../../components/Utility/AddressInput.jsx";
import CheckboxList from "../../../../../components/Utility/CheckboxList.jsx";
import { useNotify } from "../../../../../components/Utility/Notify.jsx";
import Icon from "react-native-vector-icons/Feather";
import useAuth from "../../../../../hooks/useAuth.js";
import { useUpdateWoodworkerProfileMutation } from "../../../../../services/woodworkerApi.js";

export default function WoodworkerInformationManagement({
  woodworker,
  address,
  setAddress,
  isAddressUpdate,
  setIsAddressUpdate,
  refetch,
}) {
  const { auth } = useAuth();
  const woodworkerId = auth?.wwId;
  const [imgUrl, setImgUrl] = useState("");
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [formData, setFormData] = useState({
    brandName: woodworker.brandName || "",
    businessType: woodworker.businessType || "Cá nhân",
    bio: woodworker.bio || "",
  });
  const notify = useNotify();
  const [isLoading, setIsLoading] = useState(false);
  const [updateWoodworkerProfile] = useUpdateWoodworkerProfileMutation();

  const handleInputChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async () => {
    // Create the request body
    const requestBody = {
      woodworkerId: woodworkerId,
      brandName: formData.brandName,
      bio: formData.bio,
      businessType: formData.businessType,
      imgUrl: woodworker.imgUrl,
    };

    // Thêm địa chỉ vào data nếu đang cập nhật
    if (address) {
      requestBody.address = `${address.street}, ${address.wardName}, ${address.districtName}, ${address.cityName}`;
      requestBody.cityId = address.cityId;
      requestBody.districtId = address.districtId;
      requestBody.wardCode = address.wardCode;
    }

    // Thêm ảnh vào data nếu có
    if (imgUrl) {
      requestBody.imgUrl = imgUrl;
    }

    try {
      setIsLoading(true);
      await updateWoodworkerProfile(requestBody).unwrap();
      notify("Cập nhật thành công", "Thông tin đã được cập nhật", "success");
      refetch();
      setIsAddressUpdate(false);
      setButtonDisabled(true);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      notify(
        "Cập nhật thất bại",
        error.data?.data || "Vui lòng thử lại sau",
        "error"
      );
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Quản lý Thông tin xưởng mộc</Text>

      <View style={styles.formContainer}>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Tên xưởng mộc *</Text>
          <TextInput
            style={styles.input}
            placeholder="Nhập Tên xưởng mộc"
            value={formData.brandName}
            onChangeText={(text) => handleInputChange("brandName", text)}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Loại hình kinh doanh *</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={formData.businessType}
              onValueChange={(value) =>
                handleInputChange("businessType", value)
              }
              style={styles.picker}
            >
              <Picker.Item label="Cá nhân" value="Cá nhân" />
              <Picker.Item label="Hộ kinh doanh" value="Hộ kinh doanh" />
            </Picker>
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Địa chỉ xưởng *</Text>
          {isAddressUpdate ? (
            <AddressInput
              value={address}
              onChange={setAddress}
              oldAddress={address}
            />
          ) : (
            <TextInput
              style={[styles.input, styles.readOnlyInput]}
              value={woodworker.address}
              editable={false}
            />
          )}
          <TouchableOpacity
            style={styles.linkButton}
            onPress={() => setIsAddressUpdate(!isAddressUpdate)}
          >
            <Text style={styles.linkText}>
              {isAddressUpdate ? "Hủy cập nhật" : "Cập nhật địa chỉ"}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Mã số thuế *</Text>
          <TextInput
            style={[styles.input, styles.readOnlyInput]}
            placeholder="Nhập mã số thuế"
            value={woodworker.taxCode}
            editable={false}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Giới thiệu *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Giới thiệu về xưởng mộc của bạn"
            value={formData.bio}
            onChangeText={(text) => handleInputChange("bio", text)}
            multiline
            numberOfLines={4}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Ảnh đại diện cho xưởng *</Text>
          <ImageUpdateUploader
            onUploadComplete={(results) => {
              setImgUrl(results);
            }}
            maxFiles={1}
            imgUrls={woodworker.imgUrl}
          />
        </View>

        <View style={styles.checkboxContainer}>
          {isLoading ? (
            <ActivityIndicator size="small" color={appColorTheme.brown_2} />
          ) : (
            <CheckboxList
              items={[
                {
                  description: "Tôi đã kiểm tra thông tin và xác nhận thao tác",
                  isOptional: false,
                },
              ]}
              setButtonDisabled={setButtonDisabled}
            />
          )}
        </View>

        <TouchableOpacity
          style={[styles.submitButton, buttonDisabled && styles.disabledButton]}
          onPress={handleSubmit}
          disabled={buttonDisabled || isLoading}
        >
          <Icon name="check-circle" size={18} color="white" />
          <Text style={styles.buttonText}>Cập nhật thông tin</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  heading: {
    fontSize: 22,
    fontWeight: "bold",
    color: appColorTheme.brown_2,
    marginBottom: 16,
  },
  formContainer: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
    padding: 10,
    fontSize: 16,
  },
  readOnlyInput: {
    backgroundColor: appColorTheme.grey_1,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
  },
  picker: {
    height: 50,
  },
  linkButton: {
    marginTop: 8,
  },
  linkText: {
    color: appColorTheme.brown_2,
    fontSize: 14,
  },
  checkboxContainer: {
    marginTop: 16,
  },
  submitButton: {
    backgroundColor: appColorTheme.brown_2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 40,
    marginTop: 30,
    gap: 8,
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
  disabledButton: {
    opacity: 0.5,
  },
});
