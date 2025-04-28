import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  TextInput,
} from "react-native";
import { useNotify } from "../../../../../../components/Utility/Notify";
import CheckboxList from "../../../../../../components/Utility/CheckboxList";
import Icon from "react-native-vector-icons/Feather";
import { appColorTheme } from "../../../../../../config/appconfig";

export default function CancelModal({ serviceOrderId, refetch }) {
  const [isOpen, setIsOpen] = useState(false);
  const notify = useNotify();
  const initialRef = useRef(null);
  const [reason, setReason] = useState("");
  const [isCheckboxDisabled, setIsCheckboxDisabled] = useState(true);

  const checkboxItems = [
    {
      description: "Tôi đã kiểm tra thông tin và xác nhận thao tác",
      isOptional: false,
    },
  ];

  const handleReasonChange = (text) => {
    setReason(text);
  };

  const handleSubmit = async () => {
    try {
      notify(
        "Đã gửi yêu cầu hủy",
        "Yêu cầu hủy đơn hàng đã được gửi tới xưởng mộc",
        "success"
      );

      setIsOpen(false);
      setReason(""); // Reset form
      refetch(); // Refresh data
    } catch (err) {
      notify(
        "Gửi yêu cầu thất bại",
        err?.data?.message || "Có lỗi xảy ra, vui lòng thử lại sau",
        "error"
      );
    }
  };

  return (
    <>
      <TouchableOpacity style={styles.button} onPress={() => setIsOpen(true)}>
        <Icon
          name="x-octagon"
          size={20}
          color={appColorTheme.red_1}
          style={styles.icon}
        />
        <Text style={styles.buttonText}>Yêu cầu hủy đơn</Text>
      </TouchableOpacity>

      <Modal
        visible={isOpen}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsOpen(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Yêu cầu hủy đơn</Text>
              <TouchableOpacity
                onPress={() => setIsOpen(false)}
                style={styles.closeButton}
              >
                <Icon name="x" size={20} color="#000" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <Text style={styles.warningText}>
                Bạn đang yêu cầu hủy đơn hàng này. Vui lòng cung cấp lý do rõ
                ràng.
              </Text>

              <View style={styles.formControl}>
                <Text style={styles.label}>Lý do hủy đơn</Text>
                <TextInput
                  ref={initialRef}
                  value={reason}
                  onChangeText={handleReasonChange}
                  placeholder="Nhập lý do hủy đơn của bạn"
                  style={styles.textInput}
                  multiline={true}
                  numberOfLines={4}
                />
              </View>

              {reason && reason.trim() !== "" && (
                <>
                  <View style={styles.divider} />
                  <CheckboxList
                    items={checkboxItems}
                    setButtonDisabled={setIsCheckboxDisabled}
                  />
                </>
              )}
            </View>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={[styles.footerButton, styles.closeBtn]}
                onPress={() => setIsOpen(false)}
              >
                <Icon
                  name="x-circle"
                  size={18}
                  color="#000"
                  style={styles.buttonIcon}
                />
                <Text style={styles.buttonTextDark}>Đóng</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.footerButton,
                  styles.cancelBtn,
                  (!reason || reason.trim() === "" || isCheckboxDisabled) &&
                    styles.disabledButton,
                ]}
                onPress={handleSubmit}
                disabled={!reason || reason.trim() === "" || isCheckboxDisabled}
              >
                <Icon
                  name="alert-circle"
                  size={18}
                  color="white"
                  style={styles.buttonIcon}
                />
                <Text style={styles.buttonTextLight}>Không nhận đơn hàng</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: appColorTheme.red_1 || "#E53E3E",
    marginVertical: 8,
  },
  buttonText: {
    color: appColorTheme.red_1 || "#E53E3E",
    fontWeight: "600",
  },
  icon: {
    marginRight: 8,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalView: {
    width: "90%",
    backgroundColor: "white",
    borderRadius: 10,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
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
    padding: 4,
  },
  modalBody: {
    padding: 16,
  },
  warningText: {
    color: appColorTheme.red_1 || "#E53E3E",
    marginBottom: 16,
  },
  formControl: {
    marginBottom: 16,
  },
  label: {
    fontWeight: "600",
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 4,
    padding: 12,
    textAlignVertical: "top",
    minHeight: 100,
  },
  divider: {
    height: 1,
    backgroundColor: "#E2E8F0",
    marginVertical: 16,
  },
  modalFooter: {
    flexDirection: "row",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
    justifyContent: "flex-end",
  },
  footerButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    marginLeft: 8,
  },
  closeBtn: {
    backgroundColor: "#E2E8F0",
  },
  cancelBtn: {
    backgroundColor: appColorTheme.red_1 || "#E53E3E",
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonTextLight: {
    color: "white",
    fontWeight: "600",
  },
  buttonTextDark: {
    color: "#1A202C",
    fontWeight: "600",
  },
});
