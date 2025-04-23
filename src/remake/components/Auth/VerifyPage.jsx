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
  useVerifyOTPMutation,
  useSendOTPMutation,
} from "../../services/authApi.js";
import { useNotify } from "../Utility/Notify.jsx";
import { Feather } from "@expo/vector-icons";
import { appColorTheme } from "../../config/appconfig.js";

export default function VerifyPage({ changeTab, registerEmail }) {
  const notify = useNotify();
  const [verifyOTP, { isLoading: isVerifying }] = useVerifyOTPMutation();
  const [sendOTP] = useSendOTPMutation();
  const [countdown, setCountdown] = useState(registerEmail ? 60 : 0);
  const [sendOTPLoading, setSendOTPLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: registerEmail || "",
    otp: "",
  });

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  const handleChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleResendOTP = async () => {
    try {
      setSendOTPLoading(true);
      await sendOTP(formData.email).unwrap();
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

  const handleVerify = async () => {
    try {
      await verifyOTP(formData).unwrap();
      notify(
        "Xác thực thành công",
        "Bạn có thể đăng nhập vào hệ thống bằng tài khoản này",
        "success"
      );
      changeTab("login");
    } catch (error) {
      notify(
        "Xác thực thất bại",
        error?.data?.message || "Có lỗi xảy ra, vui lòng thử lại sau",
        "error"
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Xác nhận tài khoản</Text>

      <View style={styles.formContainer}>
        <View style={styles.formControl}>
          <Text style={styles.label}>Nhập email</Text>
          <TextInput
            style={[styles.input, registerEmail ? styles.disabledInput : null]}
            placeholder="Nhập email của bạn"
            value={formData.email}
            onChangeText={(text) => handleChange("email", text)}
            keyboardType="email-address"
            editable={!registerEmail}
          />
        </View>

        <View style={styles.formControl}>
          <View style={styles.labelContainer}>
            <Text style={styles.label}>Nhập OTP</Text>
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
            value={formData.otp}
            onChangeText={(text) => handleChange("otp", text)}
            keyboardType="number-pad"
          />
        </View>

        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleVerify}
          disabled={isVerifying}
        >
          {isVerifying ? (
            <ActivityIndicator color="white" size="small" />
          ) : (
            <>
              <Feather name="check" size={20} color="white" />
              <Text style={styles.submitButtonText}>Xác nhận</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
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
  disabledInput: {
    backgroundColor: "#F7FAFC",
    color: "#718096",
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
    justifyContent: "flex-end",
  },
  footerLink: {
    color: appColorTheme.brown_2,
    fontSize: 16,
  },
});
