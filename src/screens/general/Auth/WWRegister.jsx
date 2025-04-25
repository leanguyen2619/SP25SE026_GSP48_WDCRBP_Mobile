import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { appColorTheme } from "../../../config/appconfig.js";
import ImageUpload from "../../../components/Utility/ImageUpload.jsx";
import AddressInput from "../../../components/Utility/AddressInput.jsx";
import { useRegisterWoodworkerMutation } from "../../../services/woodworkerApi.js";
import { useNavigation } from "@react-navigation/native";
import { validateWoodworkerRegister } from "../../../validations";
import useAuth from "../../../hooks/useAuth.js";
import CheckboxList from "../../../components/Utility/CheckboxList.jsx";
import { Ionicons } from "@expo/vector-icons";
import RootLayout from "../../../layouts/RootLayout.jsx";

export default function WWRegister() {
  const { auth } = useAuth();
  const [imgUrl, setImgUrl] = useState("");
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const navigation = useNavigation();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    businessType: "",
    taxCode: "",
    brandName: "",
    bio: "",
  });
  const [fullAddress, setFullAddress] = useState({
    street: "",
    cityId: "",
    districtId: "",
    wardCode: "",
    cityName: "",
    districtName: "",
    wardName: "",
  });
  const [registerWoodworker, { isLoading }] = useRegisterWoodworkerMutation();
  const [error, setError] = useState("");

  const handleChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    const errors = validateWoodworkerRegister({
      ...formData,
      imgUrl,
      address: fullAddress.street,
      wardCode: fullAddress.wardCode,
      districtId: fullAddress.districtId,
      cityId: fullAddress.cityId,
    });

    if (errors.length > 0) {
      setError(errors.join(" \n "));
      return;
    }

    try {
      const registerData = {
        ...formData,
        address: `${fullAddress.street}, ${fullAddress.wardName}, ${fullAddress.districtName}, ${fullAddress.cityName}`,
        wardCode: fullAddress.wardCode,
        districtId: fullAddress.districtId,
        cityId: fullAddress.cityId,
        imgUrl,
      };

      await registerWoodworker(registerData).unwrap();

      navigation.navigate("Success", {
        title: "Đăng ký thành công",
        desc: "Chúng tôi đã nhận được thông tin của bạn, bạn sẽ nhận được phản hồi trong thời gian sớm nhất. Thông tin tài khoản của bạn sẽ được gửi đến email của bạn sau khi được kiểm duyệt.",
      });
    } catch (error) {
      setError(error.data?.data || "Vui lòng thử lại sau");
    }
  };

  return (
    <RootLayout>
      <View style={styles.container}>
        <Text style={styles.pageTitle}>Đăng ký thông tin xưởng mộc</Text>

        <View style={styles.formContainer}>
          {/* Hiển thị lỗi nếu có */}
          {error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          {/* Thông tin người đại diện */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Thông tin người đại diện</Text>

            <View style={styles.formGroup}>
              <Text style={styles.label}>
                Họ và tên <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Nhập họ và tên"
                value={formData.fullName}
                onChangeText={(text) => handleChange("fullName", text)}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>
                Email <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Nhập email"
                keyboardType="email-address"
                value={formData.email}
                onChangeText={(text) => handleChange("email", text)}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>
                Số điện thoại <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Nhập số điện thoại"
                keyboardType="phone-pad"
                value={formData.phone}
                onChangeText={(text) => handleChange("phone", text)}
              />
            </View>
          </View>

          {/* Thông tin xưởng mộc */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Thông tin xưởng mộc</Text>

            <View style={styles.formGroup}>
              <Text style={styles.label}>
                Tên xưởng mộc <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Nhập tên xưởng mộc"
                value={formData.brandName}
                onChangeText={(text) => handleChange("brandName", text)}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>
                Loại hình kinh doanh <Text style={styles.required}>*</Text>
              </Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={formData.businessType}
                  style={styles.picker}
                  onValueChange={(value) => handleChange("businessType", value)}
                >
                  <Picker.Item label="Chọn loại hình" value="" />
                  <Picker.Item label="Cá nhân" value="Cá nhân" />
                  <Picker.Item label="Hộ kinh doanh" value="Hộ kinh doanh" />
                </Picker>
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>
                Địa chỉ <Text style={styles.required}>*</Text>
              </Text>
              <AddressInput value={fullAddress} onChange={setFullAddress} />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>
                Mã số thuế <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Nhập mã số thuế"
                value={formData.taxCode}
                onChangeText={(text) => handleChange("taxCode", text)}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>
                Giới thiệu <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Giới thiệu về xưởng mộc của bạn"
                multiline
                numberOfLines={4}
                value={formData.bio}
                onChangeText={(text) => handleChange("bio", text)}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>
                Ảnh đại diện cho xưởng <Text style={styles.required}>*</Text>
              </Text>
              <ImageUpload
                onUploadComplete={(results) => {
                  setImgUrl(results);
                }}
                maxFiles={1}
              />
            </View>
          </View>

          <View style={styles.checkboxContainer}>
            <CheckboxList
              items={[
                {
                  isOptional: false,
                  description: "Tôi đã kiểm tra thông tin và xác nhận thao tác",
                },
              ]}
              setButtonDisabled={setButtonDisabled}
            />
          </View>

          <TouchableOpacity
            style={[
              styles.submitButton,
              buttonDisabled && styles.disabledButton,
            ]}
            onPress={handleSubmit}
            disabled={buttonDisabled || isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <>
                <Ionicons
                  name="person-add"
                  size={20}
                  color="white"
                  style={styles.buttonIcon}
                />
                <Text style={styles.submitButtonText}>Đăng ký</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </RootLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: appColorTheme.brown_2,
    marginBottom: 20,
  },
  formContainer: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  errorContainer: {
    backgroundColor: "#FFF5F5",
    borderRadius: 5,
    padding: 10,
    marginBottom: 16,
  },
  errorText: {
    color: "#E53E3E",
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    fontWeight: "500",
  },
  required: {
    color: "#E53E3E",
  },
  input: {
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
  textArea: {
    textAlignVertical: "top",
    minHeight: 100,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 5,
  },
  picker: {
    height: 50,
  },
  checkboxContainer: {
    marginBottom: 16,
  },
  submitButton: {
    backgroundColor: appColorTheme.brown_2,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
    borderRadius: 30,
  },
  buttonIcon: {
    marginRight: 8,
  },
  submitButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  disabledButton: {
    opacity: 0.5,
  },
});
