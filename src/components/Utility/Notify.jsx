import { StyleSheet, View, Text, TouchableOpacity, Alert } from "react-native";
import Icon from "react-native-vector-icons/Feather";

// Custom alert config
const alertConfig = {
  success: ({ text1, text2, props, ...rest }) => (
    <View style={[styles.toastContainer, styles.successToast]}>
      <View style={styles.toastContent}>
        <Text style={styles.toastTitle}>{text1}</Text>
        <Text style={styles.toastMessage}>{text2}</Text>
      </View>
      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => Alert.alert("Thông báo", "Đóng thông báo")}
      >
        <Icon name="x" size={20} color="#333" />
      </TouchableOpacity>
    </View>
  ),
  error: ({ text1, text2, props, ...rest }) => (
    <View style={[styles.toastContainer, styles.errorToast]}>
      <View style={styles.toastContent}>
        <Text style={styles.toastTitle}>{text1}</Text>
        <Text style={styles.toastMessage}>{text2}</Text>
      </View>
      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => Alert.alert("Thông báo", "Đóng thông báo")}
      >
        <Icon name="x" size={20} color="#333" />
      </TouchableOpacity>
    </View>
  ),
  info: ({ text1, text2, props, ...rest }) => (
    <View style={[styles.toastContainer, styles.infoToast]}>
      <View style={styles.toastContent}>
        <Text style={styles.toastTitle}>{text1}</Text>
        <Text style={styles.toastMessage}>{text2}</Text>
      </View>
      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => Alert.alert("Thông báo", "Đóng thông báo")}
      >
        <Icon name="x" size={20} color="#333" />
      </TouchableOpacity>
    </View>
  ),
  warning: ({ text1, text2, props, ...rest }) => (
    <View style={[styles.toastContainer, styles.warningToast]}>
      <View style={styles.toastContent}>
        <Text style={styles.toastTitle}>{text1}</Text>
        <Text style={styles.toastMessage}>{text2}</Text>
      </View>
      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => Alert.alert("Thông báo", "Đóng thông báo")}
      >
        <Icon name="x" size={20} color="#333" />
      </TouchableOpacity>
    </View>
  ),
};

export const useNotify = () => {
  const notify = (title, description, status = "info", duration = 2222) => {
    // Map status to alert type
    let message = `${description}`;
    switch (status) {
      case "success":
        message = `Thành công: ${description}`;
        break;
      case "error":
        message = `Lỗi: ${description}`;
        break;
      case "warning":
        message = `Cảnh báo: ${description}`;
        break;
      case "info":
      default:
        message = `Thông tin: ${description}`;
        break;
    }

    // Show alert using the Alert API
    Alert.alert(title, message);
  };

  return notify;
};

const styles = StyleSheet.create({
  toastContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "90%",
    padding: 15,
    borderRadius: 8,
    marginVertical: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  successToast: {
    backgroundColor: "#E6F4EA",
    borderLeftWidth: 5,
    borderLeftColor: "#34A853",
  },
  errorToast: {
    backgroundColor: "#FDEDED",
    borderLeftWidth: 5,
    borderLeftColor: "#EA4335",
  },
  infoToast: {
    backgroundColor: "#E8F0FE",
    borderLeftWidth: 5,
    borderLeftColor: "#4285F4",
  },
  warningToast: {
    backgroundColor: "#FEF7E0",
    borderLeftWidth: 5,
    borderLeftColor: "#FBBC05",
  },
  toastContent: {
    flex: 1,
    marginRight: 10,
  },
  toastTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  toastMessage: {
    fontSize: 14,
  },
  closeButton: {
    padding: 5,
  },
});
