import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { appColorTheme } from "../../../../../config/appconfig.js";
import PersonalInfoForm from "./PersonalInfoForm.jsx";
import PasswordChangeForm from "./PasswordChangeForm.jsx";

export default function PersonalInformationManagement({ woodworker, refetch }) {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Quản lý Thông tin cá nhân</Text>

      <View style={styles.contentContainer}>
        <PersonalInfoForm woodworker={woodworker} refetch={refetch} />
        <View style={styles.divider} />
        <PasswordChangeForm refetch={refetch} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  heading: {
    fontSize: 22,
    fontWeight: "bold",
    color: appColorTheme.brown_2,
    marginBottom: 16,
  },
  contentContainer: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 40,
  },
});
