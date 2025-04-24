import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import AddressInput from "../../../../components/Utility/AddressInput";
import CheckboxList from "../../../../components/Utility/CheckboxList";
import { useNotify } from "../../../../components/Utility/Notify";

export default function CreateAddressModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
}) {
  const notify = useNotify();
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [isDefault, setIsDefault] = useState(false);
  const [addressData, setAddressData] = useState({
    street: "",
    cityId: "",
    districtId: "",
    wardCode: "",
    cityName: "",
    districtName: "",
    wardName: "",
  });

  const handleAddressChange = (value) => {
    setAddressData(value);
  };

  const validateForm = () => {
    if (!addressData.cityId) {
      notify("Vui lòng chọn tỉnh/thành phố", "", "error");
      return false;
    }
    if (!addressData.districtId) {
      notify("Vui lòng chọn quận/huyện", "", "error");
      return false;
    }
    if (!addressData.wardCode) {
      notify("Vui lòng chọn phường/xã", "", "error");
      return false;
    }
    if (!addressData.street.trim()) {
      notify("Vui lòng nhập tên đường/số nhà", "", "error");
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    if (!validateForm()) return;

    const formattedAddress = `${addressData.street}, ${addressData.wardName}, ${addressData.districtName}, ${addressData.cityName}`;

    const formData = {
      isDefault,
      address: formattedAddress,
      wardCode: addressData.wardCode,
      districtId: addressData.districtId,
      cityId: addressData.cityId,
    };

    onSubmit(formData);
  };

  const resetForm = () => {
    setAddressData({
      street: "",
      cityId: "",
      districtId: "",
      wardCode: "",
      cityName: "",
      districtName: "",
      wardName: "",
    });
    setIsDefault(false);
    setButtonDisabled(true);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Modal
      visible={isOpen}
      animationType="slide"
      transparent={true}
      onRequestClose={handleClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Thêm địa chỉ mới</Text>
            {!isLoading && (
              <TouchableOpacity
                onPress={handleClose}
                style={styles.closeButton}
              >
                <MaterialIcons name="close" size={24} color="#000" />
              </TouchableOpacity>
            )}
          </View>

          <ScrollView style={styles.modalBody}>
            <View style={styles.formContainer}>
              <AddressInput
                value={addressData}
                onChange={handleAddressChange}
              />

              <View style={styles.checkboxContainer}>
                <TouchableOpacity
                  style={styles.checkbox}
                  onPress={() => setIsDefault(!isDefault)}
                >
                  <View
                    style={[
                      styles.checkboxIcon,
                      isDefault && styles.checkboxIconChecked,
                    ]}
                  >
                    {isDefault && (
                      <MaterialIcons name="check" size={16} color="white" />
                    )}
                  </View>
                  <Text style={styles.checkboxLabel}>
                    Đặt làm địa chỉ mặc định
                  </Text>
                </TouchableOpacity>
              </View>

              <CheckboxList
                items={[
                  {
                    isOptional: false,
                    description:
                      "Tôi đã kiểm tra thông tin và xác nhận thao tác",
                  },
                ]}
                setButtonDisabled={setButtonDisabled}
              />

              <TouchableOpacity
                style={[
                  styles.submitButton,
                  (buttonDisabled || isLoading) && styles.disabledButton,
                ]}
                onPress={handleSubmit}
                disabled={buttonDisabled || isLoading}
              >
                <MaterialIcons name="add" size={20} color="white" />
                <Text style={styles.submitButtonText}>Thêm mới</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "95%",
    maxHeight: "90%",
    backgroundColor: "white",
    borderRadius: 10,
    overflow: "hidden",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  closeButton: {
    padding: 5,
  },
  modalBody: {
    padding: 16,
  },
  formContainer: {
    gap: 20,
  },
  checkboxContainer: {
    marginBottom: 20,
    marginTop: 10,
  },
  checkbox: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkboxIcon: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#38A169",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  checkboxIconChecked: {
    backgroundColor: "#38A169",
  },
  checkboxLabel: {
    fontSize: 16,
  },
  submitButton: {
    flexDirection: "row",
    backgroundColor: "#38A169",
    padding: 15,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  disabledButton: {
    backgroundColor: "#A0AEC0",
    opacity: 0.7,
  },
  submitButtonText: {
    color: "white",
    fontWeight: "bold",
    marginLeft: 8,
  },
});
