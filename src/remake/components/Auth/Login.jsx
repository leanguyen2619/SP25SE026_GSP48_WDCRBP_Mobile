import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { appColorTheme } from "../../config/appconfig.js";
import PasswordLogin from "./PasswordLogin";
import EmailOTPLogin from "./EmailOTPLogin";

export default function Login({ changeTab }) {
  const [loginMethod, setLoginMethod] = useState("password");

  const renderLoginForm = () => {
    switch (loginMethod) {
      case "password":
        return <PasswordLogin />;

      case "emailOTP":
        return <EmailOTPLogin />;

      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đăng nhập</Text>

      {renderLoginForm()}

      <Text style={styles.methodLabel}>Phương thức đăng nhập</Text>

      <View style={styles.methodButtonsContainer}>
        <TouchableOpacity
          style={[
            styles.methodButton,
            loginMethod === "password"
              ? styles.activeMethodButton
              : styles.inactiveMethodButton,
          ]}
          onPress={() => setLoginMethod("password")}
        >
          <Text
            style={[
              styles.methodButtonText,
              loginMethod === "password"
                ? styles.activeMethodButtonText
                : styles.inactiveMethodButtonText,
            ]}
          >
            Mật khẩu
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.methodButton,
            loginMethod === "emailOTP"
              ? styles.activeMethodButton
              : styles.inactiveMethodButton,
          ]}
          onPress={() => setLoginMethod("emailOTP")}
        >
          <Text
            style={[
              styles.methodButtonText,
              loginMethod === "emailOTP"
                ? styles.activeMethodButtonText
                : styles.inactiveMethodButtonText,
            ]}
          >
            Email OTP
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity onPress={() => changeTab("forgetPassword")}>
          <Text style={styles.footerLink}>Quên mật khẩu</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => changeTab("register")}>
          <Text style={styles.footerLink}>Đăng ký</Text>
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
  methodLabel: {
    marginTop: 16,
    marginBottom: 8,
    fontSize: 14,
    color: "#718096",
  },
  methodButtonsContainer: {
    flexDirection: "row",
    gap: 8,
  },
  methodButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  activeMethodButton: {
    backgroundColor: "#4299E1",
  },
  inactiveMethodButton: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#CBD5E0",
  },
  methodButtonText: {
    fontSize: 16,
    fontWeight: "500",
  },
  activeMethodButtonText: {
    color: "white",
  },
  inactiveMethodButtonText: {
    color: "#718096",
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
