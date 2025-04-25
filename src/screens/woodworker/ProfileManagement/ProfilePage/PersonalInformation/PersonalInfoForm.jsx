import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { appColorTheme } from "../../../../../config/appconfig.js";
import CheckboxList from "../../../../../components/Utility/CheckboxList.jsx";
import { useUpdateUserInformationMutation } from "../../../../../services/userApi.js";
import useAuth from "../../../../../hooks/useAuth.js";
import { useNotify } from "../../../../../components/Utility/Notify.jsx";
import Icon from "react-native-vector-icons/Feather";
import PasswordInput from "../../../../../components/Input/PasswordInput.jsx";
import { validateWoodworkerPersonalInfo } from "../../../../../validations";

export default function PersonalInfoForm({ woodworker, refetch }) {
  const { auth } = useAuth();
  const notify = useNotify();
  const [personalInfoDisabled, setPersonalInfoDisabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showPasswordField, setShowPasswordField] = useState(false);
  const [formData, setFormData] = useState({
    fullName: woodworker.user?.username || "",
    email: woodworker.user?.email || "",
    phone: woodworker.user?.phone || "",
    password: "",
  });

  const [updateUserInformation] = useUpdateUserInformationMutation();

  const handleInputChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCheckboxChange = (disabled) => {
    setPersonalInfoDisabled(disabled);
    setShowPasswordField(!disabled);
  };

  const handlePersonalInfoSubmit = async () => {
    const data = {
      userId: auth.userId,
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
      isUpdating: !personalInfoDisabled,
    };

    // Validate form data
    const errors = validateWoodworkerPersonalInfo(data);
    if (errors.length > 0) {
      // Show the first error with notify
      notify("Lỗi xác thực", errors[0], "error");
      return;
    }

    try {
      setIsLoading(true);
      await updateUserInformation(data).unwrap();

      setIsLoading(false);
      refetch();
      notify("Cập nhật thành công", "Thông tin đã được cập nhật", "success");
    } catch (error) {
      setIsLoading(false);
      notify(
        "Cập nhật thất bại",
        error.data?.message || "Vui lòng thử lại sau",
        "error"
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.sectionContainer}>
        <Text style={styles.heading}>Thông tin người đại diện</Text>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Họ và tên *</Text>
          <TextInput
            style={styles.input}
            placeholder="Nhập họ và tên"
            value={formData.fullName}
            onChangeText={(text) => handleInputChange("fullName", text)}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Email *</Text>
          <TextInput
            style={[styles.input, styles.readOnlyInput]}
            value={formData.email}
            editable={false}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Số điện thoại *</Text>
          <TextInput
            style={styles.input}
            placeholder="Nhập số điện thoại"
            value={formData.phone}
            onChangeText={(text) => handleInputChange("phone", text)}
            keyboardType="phone-pad"
          />
        </View>
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
            setButtonDisabled={handleCheckboxChange}
          />
        )}
      </View>

      {showPasswordField && (
        <View style={styles.passwordSection}>
          <PasswordInput
            label="Mật khẩu xác nhận"
            value={formData.password}
            onChangeText={(text) => handleInputChange("password", text)}
            placeholder="Nhập mật khẩu để xác nhận thay đổi"
            isRequired
          />
        </View>
      )}

      <TouchableOpacity
        style={[
          styles.submitButton,
          personalInfoDisabled && styles.disabledButton,
        ]}
        onPress={handlePersonalInfoSubmit}
        disabled={personalInfoDisabled || isLoading}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color="white" />
        ) : (
          <>
            <Icon name="check-circle" size={18} color="white" />
            <Text style={styles.buttonText}>Cập nhật thông tin</Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  sectionContainer: {
    marginBottom: 24,
  },
  heading: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 24,
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
  checkboxContainer: {
    marginBottom: 24,
  },
  passwordSection: {
    marginTop: 8,
    marginBottom: 24,
  },
  submitButton: {
    backgroundColor: appColorTheme.brown_2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 40,
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
