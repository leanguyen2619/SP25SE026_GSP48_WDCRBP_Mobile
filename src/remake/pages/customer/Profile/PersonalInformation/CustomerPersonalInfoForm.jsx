import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useState } from "react";
import { appColorTheme } from "../../../../config/appconfig.js";
import CheckboxList from "../../../../components/Utility/CheckboxList.jsx";
import { useUpdateUserInformationMutation } from "../../../../services/userApi.js";
import useAuth from "../../../../hooks/useAuth.js";
import { useNotify } from "../../../../components/Utility/Notify.jsx";
import PasswordInput from "../../../../components/Input/PasswordInput.jsx";
import { validateCustomerPersonalInfo } from "../../../../validations/index.js";

export default function CustomerPersonalInfoForm({ userData, refetch }) {
  const { auth } = useAuth();
  const notify = useNotify();
  const [personalInfoDisabled, setPersonalInfoDisabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showPasswordField, setShowPasswordField] = useState(false);

  const [updateUserInformation] = useUpdateUserInformationMutation();

  const handleCheckboxChange = (disabled) => {
    setPersonalInfoDisabled(disabled);
    setShowPasswordField(!disabled);
  };

  const handlePersonalInfoSubmit = async () => {
    // Collecting form data manually from component state
    const data = {
      userId: auth.userId,
      fullName: fullNameValue,
      email: emailValue,
      phone: phoneValue,
      password: passwordValue,
      isUpdating: !personalInfoDisabled,
    };

    // Validate form data
    const errors = validateCustomerPersonalInfo(data);
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

  // States for form fields
  const [fullNameValue, setFullNameValue] = useState(userData?.username || "");
  const [emailValue, setEmailValue] = useState(userData?.email || "");
  const [phoneValue, setPhoneValue] = useState(userData?.phone || "");
  const [passwordValue, setPasswordValue] = useState("");

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.heading}>Thông tin cá nhân</Text>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Tên của bạn</Text>
          <TextInput
            style={styles.input}
            value={fullNameValue}
            onChangeText={setFullNameValue}
            placeholder="Nhập họ và tên"
            editable={!personalInfoDisabled}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={[styles.input, styles.readonlyInput]}
            value={emailValue}
            onChangeText={setEmailValue}
            placeholder="Nhập email"
            keyboardType="email-address"
            editable={false}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Số điện thoại</Text>
          <TextInput
            style={styles.input}
            value={phoneValue}
            onChangeText={setPhoneValue}
            placeholder="Nhập số điện thoại"
            keyboardType="phone-pad"
            editable={!personalInfoDisabled}
          />
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
            setButtonDisabled={handleCheckboxChange}
          />
        )}
      </View>

      {showPasswordField && (
        <View style={styles.section}>
          <PasswordInput
            label="Mật khẩu xác nhận"
            value={passwordValue}
            onChangeText={setPasswordValue}
            placeholder="Nhập mật khẩu để xác nhận thay đổi"
            isRequired
          />
        </View>
      )}

      <TouchableOpacity
        style={[styles.button, personalInfoDisabled && styles.disabledButton]}
        onPress={handlePersonalInfoSubmit}
        disabled={personalInfoDisabled || isLoading}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color="white" />
        ) : (
          <Text style={styles.buttonText}>Cập nhật thông tin</Text>
        )}
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
  },
  formGroup: {
    marginBottom: 24,
  },
  label: {
    marginBottom: 8,
    fontWeight: "500",
  },
  input: {
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 8,
    padding: 12,
    backgroundColor: "white",
  },
  readonlyInput: {
    backgroundColor: appColorTheme.grey_2,
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
