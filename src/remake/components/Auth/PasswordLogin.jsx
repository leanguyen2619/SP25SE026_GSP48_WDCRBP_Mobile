import React, { useState } from "react";
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
import { useNotify } from "../Utility/Notify.jsx";
import { useNavigation } from "@react-navigation/native";
import { useLoginWithPasswordMutation } from "../../services/authApi.js";
import { API_URL } from "../../config";
import { Feather } from "@expo/vector-icons";

export default function PasswordLogin() {
  const notify = useNotify();
  const { setAuth } = useAuth();
  const navigation = useNavigation();
  const [login, { isLoading }] = useLoginWithPasswordMutation();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const data = {
        emailOrPhone: formData.email,
        password: formData.password,
      };

      const res = await login(data).unwrap();
      const user = res.data;

      const decodedToken = jwtDecode(user.access_token);
      const auth = {
        token: user.access_token,
        ...decodedToken,
        refreshToken: user.refresh_token,
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
          navigation.navigate("WWDashboard");
          break;
        case "Admin":
          setAuth(auth);
          navigation.navigate("AdminDashboard");
          break;
        case "Staff":
          setAuth(auth);
          navigation.navigate("StaffDashboard");
          break;
        case "Moderator":
          setAuth(auth);
          navigation.navigate("ModDashboard");
          break;
      }
    } catch (err) {
      notify(
        "Đăng nhập thất bại",
        "Vui lòng kiểm tra lại thông tin đăng nhập",
        "error"
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.formControl}>
        <Text style={styles.label}>Email / Số điện thoại</Text>
        <TextInput
          style={styles.input}
          placeholder="Nhập email hoặc số điện thoại"
          value={formData.email}
          onChangeText={(text) => handleChange("email", text)}
        />
      </View>

      <View style={styles.formControl}>
        <Text style={styles.label}>Mật khẩu</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Nhập mật khẩu"
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

      <TouchableOpacity
        style={styles.submitButton}
        onPress={handleSubmit}
        disabled={isLoading}
      >
        {isLoading ? (
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
});
