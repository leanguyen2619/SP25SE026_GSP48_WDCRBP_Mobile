import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Switch,
} from "react-native";
import { useUpdateWoodworkerPublicStatusMutation } from "../../services/woodworkerApi";
import { useNotify } from "../../components/Utility/Notify";
import useAuth from "../../hooks/useAuth.js";
import { Feather } from "@expo/vector-icons";

export default function PublicProfileSwitch() {
  const { auth, setAuth } = useAuth();
  const notify = useNotify();
  const [updatePublicStatus, { isLoading }] =
    useUpdateWoodworkerPublicStatusMutation();

  const profilePublicStatus = auth?.woodworker?.publicStatus || false;
  const userId = auth?.userId;

  const handleToggle = async () => {
    try {
      const newStatus = !profilePublicStatus;

      await updatePublicStatus({
        userId: userId,
        publicStatus: newStatus,
        reasons: "ChangeStatus",
      }).unwrap();

      // Update auth context directly
      setAuth({
        ...auth,
        woodworker: {
          ...auth.woodworker,
          publicStatus: newStatus,
        },
      });

      notify(
        "Cập nhật thành công",
        newStatus
          ? "Xưởng của bạn đã được công khai"
          : "Xưởng của bạn đã được ẩn",
        "success"
      );
    } catch (error) {
      notify("Lỗi cập nhật", "Không thể cập nhật trạng thái xưởng", "error");
    }
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => !isLoading && handleToggle()}
      activeOpacity={0.7}
    >
      <View style={styles.textContainer}>
        <Text style={styles.text}>Công khai xưởng</Text>
        <Feather
          name="info"
          size={16}
          color="#718096"
          style={styles.infoIcon}
        />
      </View>

      {isLoading ? (
        <ActivityIndicator size="small" color="#F6E05E" />
      ) : (
        <Switch
          trackColor={{ false: "#CBD5E0", true: "#F6E05E" }}
          thumbColor={profilePublicStatus ? "#ffffff" : "#ffffff"}
          ios_backgroundColor="#CBD5E0"
          onValueChange={handleToggle}
          value={profilePublicStatus}
          disabled={isLoading}
        />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
    paddingHorizontal: 2,
  },
  textContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  text: {
    fontSize: 14,
    fontWeight: "500",
    marginRight: 4,
  },
  infoIcon: {
    marginLeft: 4,
  },
});
