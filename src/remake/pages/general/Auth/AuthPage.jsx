import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import useAuth from "../../../hooks/useAuth.js";
import Login from "../../../components/Auth/Login.jsx";
import Register from "../../../components/Auth/Register.jsx";
import ForgetPassword from "../../../components/Auth/ForgetPassword.jsx";
import VerifyPage from "../../../components/Auth/VerifyPage.jsx";
import { appColorTheme } from "../../../config/appconfig.js";
import RootLayout from "../../../layouts/RootLayout.jsx";

function AuthPage() {
  const { auth } = useAuth();
  const navigation = useNavigation();
  const [currentTab, setCurrentTab] = useState("login");
  const [registerEmail, setRegisterEmail] = useState("");

  // Redirect if user is already authenticated
  if (auth) {
    navigation.navigate("Home");
    return null;
  }

  const changeTab = (tab) => {
    setCurrentTab(tab);
  };

  return (
    <RootLayout>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.container}>
          <View style={styles.authBox}>
            {/* Conditional rendering based on currentTab state */}
            {currentTab === "login" && <Login changeTab={changeTab} />}
            {currentTab === "register" && (
              <Register
                setRegisterEmail={setRegisterEmail}
                changeTab={changeTab}
              />
            )}
            {currentTab === "forgetPassword" && (
              <ForgetPassword changeTab={changeTab} />
            )}
            {currentTab === "verify" && (
              <VerifyPage changeTab={changeTab} registerEmail={registerEmail} />
            )}
          </View>

          <TouchableOpacity
            style={styles.wwRegisterButton}
            onPress={() => navigation.navigate("WWRegister")}
          >
            <Text style={styles.wwRegisterText}>
              Đăng ký trở thành xưởng mộc
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </RootLayout>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    paddingVertical: 20,
  },
  container: {
    flex: 1,
    alignItems: "center",
    width: "100%",
  },
  authBox: {
    backgroundColor: "white",
    borderRadius: 10,
    width: "90%",
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  wwRegisterButton: {
    marginTop: 24,
    padding: 8,
    alignItems: "center",
  },
  wwRegisterText: {
    color: appColorTheme.brown_2,
    textDecorationLine: "underline",
    fontSize: 16,
  },
});

export default AuthPage;
