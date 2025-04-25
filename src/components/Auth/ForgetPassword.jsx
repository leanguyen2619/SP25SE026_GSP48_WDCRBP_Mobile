import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import {
  useSendOTPMutation,
  useResetPasswordMutation,
} from "../../services/authApi";
import { useNotify } from "../Utility/Notify";
import { Feather } from "@expo/vector-icons";
import { appColorTheme } from "../../config/appconfig.js";

export default function ForgetPassword({ changeTab }) {
  const notify = useNotify();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [sendOTPLoading, setSendOTPLoading] = useState(false);
  const [sendOTP] = useSendOTPMutation();
  const [resetPassword, { isLoading: isResetting }] =
    useResetPasswordMutation();

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  const handleResendOTP = async () => {
    try {
      setSendOTPLoading(true);
      await sendOTP(email).unwrap();
      notify(
        "Gửi mã OTP thành công",
        "Vui lòng kiểm tra email của bạn",
        "success"
      );
      setCountdown(60);
      setSendOTPLoading(false);
    } catch (error) {
      notify(
        "Gửi mã OTP thất bại",
        error?.data?.message || "Có lỗi xảy ra, vui lòng thử lại sau",
        "error"
      );
      setSendOTPLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      const postData = {
        email,
        otp,
        newPassword,
        confirmPassword,
      };

      await resetPassword(postData).unwrap();

      notify("Đổi mật khẩu thành công", "Vui lòng đăng nhập lại", "success");
      changeTab("login");
    } catch (error) {
      notify(
        "Đổi mật khẩu thất bại",
        error?.data?.message || "Có lỗi xảy ra, vui lòng thử lại sau",
        "error"
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quên mật khẩu</Text>

      <View style={styles.formContainer}>
        <View style={styles.formControl}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Nhập email của bạn"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
        </View>

        <View style={styles.formControl}>
          <View style={styles.labelContainer}>
            <Text style={styles.label}>Mã OTP</Text>
            <TouchableOpacity
              style={[
                styles.otpButton,
                (countdown > 0 || sendOTPLoading) && styles.disabledButton,
              ]}
              onPress={handleResendOTP}
              disabled={countdown > 0 || sendOTPLoading}
            >
              <Text
                style={[
                  styles.otpButtonText,
                  countdown > 0 && styles.disabledButtonText,
                ]}
              >
                {countdown > 0 ? `Chờ ${countdown}s` : "Gửi OTP"}
              </Text>
            </TouchableOpacity>
          </View>
          <TextInput
            style={styles.input}
            placeholder="Nhập mã OTP"
            value={otp}
            onChangeText={setOtp}
            keyboardType="number-pad"
          />
          <Text style={styles.helperText}>
            Hệ thống sẽ gửi mã OTP về mail của bạn
          </Text>
        </View>

        <View style={styles.formControl}>
          <Text style={styles.label}>Mật khẩu mới</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Nhập mật khẩu mới"
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry={!showNewPassword}
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setShowNewPassword(!showNewPassword)}
            >
              <Feather
                name={showNewPassword ? "eye-off" : "eye"}
                size={20}
                color="#718096"
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.formControl}>
          <Text style={styles.label}>Xác nhận mật khẩu</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Xác nhận mật khẩu mới"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirmPassword}
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              <Feather
                name={showConfirmPassword ? "eye-off" : "eye"}
                size={20}
                color="#718096"
              />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit}
          disabled={isResetting}
        >
          {isResetting ? (
            <ActivityIndicator color="white" size="small" />
          ) : (
            <>
              <Feather name="lock" size={20} color="white" />
              <Text style={styles.submitButtonText}>Xác nhận</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <View style={{ flex: 1 }} />
        <TouchableOpacity onPress={() => changeTab("login")}>
          <Text style={styles.footerLink}>Đăng nhập</Text>
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
  labelContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
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
  helperText: {
    fontSize: 12,
    color: "#718096",
    textAlign: "right",
    marginTop: 4,
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
  otpButton: {
    padding: 4,
  },
  otpButtonText: {
    color: appColorTheme.brown_2,
    fontSize: 14,
  },
  disabledButton: {
    opacity: 0.6,
  },
  disabledButtonText: {
    color: "#718096",
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
