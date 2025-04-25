import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { appColorTheme } from "../../config/appconfig.js";
import useAuth from "../../hooks/useAuth.js";
import { jwtDecode } from "jwt-decode";
import { useNavigation } from "@react-navigation/native";
import {
  useLoginWithOTPMutation,
  useSendOTPMutation,
} from "../../services/authApi";
import { useNotify } from "../Utility/Notify";
import { Feather } from "@expo/vector-icons";
import { API_URL } from "../../config";

export default function EmailOTPLogin() {
  const notify = useNotify();
  const { setAuth } = useAuth();
  const navigation = useNavigation();
  const [loginWithOTP, { isLoading: isLoggingIn }] = useLoginWithOTPMutation();
  const [sendOTP] = useSendOTPMutation();
  const [countdown, setCountdown] = useState(0);
  const [sendOTPLoading, setSendOTPLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
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

  const handleSubmit = async () => {
    try {
      const res = await loginWithOTP(formData).unwrap();
      const user = res.data;

      const decodedToken = jwtDecode(user.accessToken);
      const auth = {
        token: user.accessToken,
        ...decodedToken,
        refreshToken: user.refreshToken,
      };

      if (user?.role === "Customer" || user?.role === "Woodworker") {
        const walletRes = await fetch(
          `${API_URL}/api/v1/wallet/user/${decodedToken.userId}`,
          {
            headers: {
              Authorization: `Bearer ${user.access_token}`,
            },
          }
        ).then((res) => res.json());
        auth.wallet = walletRes.data;
      }

      switch (auth.role) {
        case "Customer":
          setAuth(auth);
          navigation.navigate("Home");
          break;
        case "Woodworker":
          setAuth(auth);
          navigation.navigate("WoodworkerWelcome");
          break;
      }
    } catch (error) {
      notify(
        "Đăng nhập thất bại",
        "Có lỗi xảy ra, vui lòng thử lại sau",
        "error"
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.formControl}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Nhập email của bạn"
          value={formData.email}
          onChangeText={(text) => handleChange("email", text)}
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
          value={formData.otp}
          onChangeText={(text) => handleChange("otp", text)}
          keyboardType="number-pad"
        />
      </View>

      <TouchableOpacity
        style={styles.submitButton}
        onPress={handleSubmit}
        disabled={isLoggingIn}
      >
        {isLoggingIn ? (
          <ActivityIndicator color="white" size="small" />
        ) : (
          <>
            <Feather name="log-in" size={20} color="white" />
            <Text style={styles.submitButtonText}>Đăng nhập</Text>
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
});
