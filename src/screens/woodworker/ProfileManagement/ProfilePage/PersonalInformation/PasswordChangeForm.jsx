import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { appColorTheme } from "../../../../../config/appconfig.js";
import CheckboxList from "../../../../../components/Utility/CheckboxList.jsx";
import { useChangePasswordMutation } from "../../../../../services/userApi.js";
import useAuth from "../../../../../hooks/useAuth.js";
import { useNotify } from "../../../../../components/Utility/Notify.jsx";
import PasswordInput from "../../../../../components/Input/PasswordInput.jsx";
import Icon from "react-native-vector-icons/Feather";

export default function PasswordChangeForm({ refetch }) {
  const { auth } = useAuth();
  const notify = useNotify();
  const [passwordDisabled, setPasswordDisabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [changePassword] = useChangePasswordMutation();

  const handleInputChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handlePasswordSubmit = async () => {
    if (formData.newPassword !== formData.confirmPassword) {
      notify("Lỗi", "Mật khẩu mới không khớp", "error");
      return;
    }

    try {
      setIsLoading(true);
      await changePassword({
        userId: auth.userId,
        data: formData,
      }).unwrap();

      refetch();
      notify("Đổi mật khẩu thành công", "Mật khẩu đã được cập nhật", "success");

      // Reset form
      setFormData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setPasswordDisabled(true);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      notify(
        "Đổi mật khẩu thất bại",
        error.data?.message || "Vui lòng thử lại sau",
        "error"
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.sectionContainer}>
        <Text style={styles.heading}>Đổi mật khẩu</Text>

        <View style={styles.formGroup}>
          <PasswordInput
            label="Mật khẩu hiện tại"
            value={formData.oldPassword}
            onChangeText={(text) => handleInputChange("oldPassword", text)}
            placeholder="Nhập mật khẩu hiện tại"
            isRequired
          />
        </View>

        <View style={styles.formGroup}>
          <PasswordInput
            label="Mật khẩu mới"
            value={formData.newPassword}
            onChangeText={(text) => handleInputChange("newPassword", text)}
            placeholder="Nhập mật khẩu mới"
            isRequired
          />
        </View>

        <View style={styles.formGroup}>
          <PasswordInput
            label="Xác nhận mật khẩu mới"
            value={formData.confirmPassword}
            onChangeText={(text) => handleInputChange("confirmPassword", text)}
            placeholder="Xác nhận mật khẩu mới"
            isRequired
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
            setButtonDisabled={setPasswordDisabled}
          />
        )}
      </View>

      <TouchableOpacity
        style={[styles.submitButton, passwordDisabled && styles.disabledButton]}
        onPress={handlePasswordSubmit}
        disabled={passwordDisabled || isLoading}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color="white" />
        ) : (
          <>
            <Icon name="check-circle" size={18} color="white" />
            <Text style={styles.buttonText}>Đổi mật khẩu</Text>
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
  checkboxContainer: {
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
