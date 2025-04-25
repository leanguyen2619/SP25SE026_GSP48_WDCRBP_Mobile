import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useNotify } from "../Utility/Notify";
import { Feather } from "@expo/vector-icons";
import { useRegisterMutation } from "../../services/authApi";
import { validateRegister } from "../../validations";
import { appColorTheme } from "../../config/appconfig.js";

export default function Register({ setRegisterEmail, changeTab }) {
  const [register, { isLoading: isRegisterLoading }] = useRegisterMutation();
  const notify = useNotify();
  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    rePassword: "",
    phone: "",
  });

  const handleChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRegister = async () => {
    try {
      // Validate data
      const errors = validateRegister(formData);
      if (errors.length > 0) {
        notify("Đăng ký thất bại", errors.join(" [---] "), "info", 5000);
        return;
      }

      // Remove rePassword before sending to server
      const { rePassword, ...registerData } = formData;
      await register(registerData).unwrap();

      notify(
        "Đăng ký thành công",
        `Vui lòng xác nhận bằng OTP đã gửi về email ${formData.email}`,
        "success"
      );

      setRegisterEmail(formData.email);
      changeTab("verify");
    } catch (err) {
      notify(
        "Đăng ký thất bại",
        err?.data?.message || "Có lỗi xảy ra, vui lòng thử lại sau",
        "error"
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đăng ký</Text>

      <View style={styles.formContainer}>
        <View style={styles.formControl}>
          <Text style={styles.label}>Tên của bạn</Text>
          <TextInput
            style={styles.input}
            placeholder="Nhập tên của bạn"
            value={formData.username}
            onChangeText={(text) => handleChange("username", text)}
          />
        </View>

        <View style={styles.formControl}>
          <Text style={styles.label}>Nhập email</Text>
          <TextInput
            style={styles.input}
            placeholder="Nhập email của bạn"
            value={formData.email}
            onChangeText={(text) => handleChange("email", text)}
            keyboardType="email-address"
          />
        </View>

        <View style={styles.formControl}>
          <Text style={styles.label}>Nhập mật khẩu</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Nhập mật khẩu của bạn"
              value={formData.password}
              onChangeText={(text) => handleChange("password", text)}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Feather
                name={showPassword ? "eye-off" : "eye"}
                size={20}
                color="#718096"
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.formControl}>
          <Text style={styles.label}>Nhập lại mật khẩu</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Nhập lại mật khẩu của bạn"
              value={formData.rePassword}
              onChangeText={(text) => handleChange("rePassword", text)}
              secureTextEntry={!showRePassword}
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setShowRePassword(!showRePassword)}
            >
              <Feather
                name={showRePassword ? "eye-off" : "eye"}
                size={20}
                color="#718096"
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.formControl}>
          <Text style={styles.label}>Nhập số điện thoại</Text>
          <TextInput
            style={styles.input}
            placeholder="Nhập số điện thoại của bạn"
            value={formData.phone}
            onChangeText={(text) => handleChange("phone", text)}
            keyboardType="phone-pad"
          />
        </View>

        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleRegister}
          disabled={isRegisterLoading}
        >
          {isRegisterLoading ? (
            <ActivityIndicator color="white" size="small" />
          ) : (
            <>
              <Feather name="user-plus" size={20} color="white" />
              <Text style={styles.submitButtonText}>Đăng ký</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity onPress={() => changeTab("login")}>
          <Text style={styles.footerLink}>Đăng nhập</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => changeTab("verify")}>
          <Text style={styles.footerLink}>Xác nhận tài khoản</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 20,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    fontFamily: "Montserrat",
  },
  formContainer: {
    width: "100%",
  },
  formControl: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: "500",
  },
  input: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 6,
    padding: 12,
    fontSize: 16,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 6,
  },
  passwordInput: {
    flex: 1,
    padding: 12,
    fontSize: 16,
  },
  eyeIcon: {
    padding: 12,
  },
  submitButton: {
    backgroundColor: appColorTheme.brown_2,
    padding: 14,
    borderRadius: 6,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  submitButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  footer: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  footerLink: {
    color: appColorTheme.brown_2,
    fontSize: 16,
  },
});
