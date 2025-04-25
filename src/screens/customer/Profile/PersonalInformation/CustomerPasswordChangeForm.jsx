import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useState } from "react";
import { appColorTheme } from "../../../../config/appconfig.js";
import CheckboxList from "../../../../components/Utility/CheckboxList.jsx";
import { useChangePasswordMutation } from "../../../../services/userApi.js";
import useAuth from "../../../../hooks/useAuth.js";
import { useNotify } from "../../../../components/Utility/Notify.jsx";
import PasswordInput from "../../../../components/Input/PasswordInput.jsx";

export default function CustomerPasswordChangeForm({ refetch }) {
  const { auth } = useAuth();
  const notify = useNotify();
  const [passwordDisabled, setPasswordDisabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // States for form fields
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [changePassword] = useChangePasswordMutation();

  const handlePasswordSubmit = async () => {
    const postData = {
      oldPassword,
      newPassword,
      confirmPassword,
    };

    if (postData.newPassword !== postData.confirmPassword) {
      notify("Lỗi", "Mật khẩu mới không khớp", "error");
      return;
    }

    try {
      setIsLoading(true);
      await changePassword({
        userId: auth.userId,
        data: postData,
      }).unwrap();

      refetch();
      notify("Đổi mật khẩu thành công", "Mật khẩu đã được cập nhật", "success");

      // Reset form
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
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
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.heading}>Đổi mật khẩu</Text>

        <View style={styles.formContainer}>
          <View style={styles.formGroup}>
            <PasswordInput
              label="Mật khẩu hiện tại"
              value={oldPassword}
              onChangeText={setOldPassword}
              placeholder="Nhập mật khẩu hiện tại"
              isRequired
            />
          </View>

          <View style={styles.formGroup}>
            <PasswordInput
              label="Mật khẩu mới"
              value={newPassword}
              onChangeText={setNewPassword}
              placeholder="Nhập mật khẩu mới"
              isRequired
            />
          </View>

          <View style={styles.formGroup}>
            <PasswordInput
              label="Xác nhận mật khẩu mới"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Xác nhận mật khẩu mới"
              isRequired
            />
          </View>
        </View>
      </View>

      <View style={styles.section}>
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
        style={[styles.button, passwordDisabled && styles.disabledButton]}
        onPress={handlePasswordSubmit}
        disabled={passwordDisabled}
      >
        <Text style={styles.buttonText}>Đổi mật khẩu</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
  },
  heading: {
    fontSize: 18,
    fontFamily: "Montserrat",
    fontWeight: "700",
    marginBottom: 24,
    marginTop: 24,
  },
  formContainer: {
    marginBottom: 24,
  },
  formGroup: {
    marginBottom: 24,
  },
  button: {
    backgroundColor: appColorTheme.brown_2,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 40,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
  },
});
