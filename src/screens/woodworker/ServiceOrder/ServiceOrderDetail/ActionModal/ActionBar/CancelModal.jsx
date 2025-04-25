import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { useNotify } from "../../../../../../components/Utility/Notify";
import CheckboxList from "../../../../../../components/Utility/CheckboxList";

export default function CancelModal({ serviceOrderId, refetch }) {
  const [isOpen, setIsOpen] = useState(false);
  const notify = useNotify();
  const [reason, setReason] = useState("");
  const [isCheckboxDisabled, setIsCheckboxDisabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

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
      setIsLoading(true);
      // Giả lập một API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      notify(
        "Đã gửi yêu cầu hủy",
        "Yêu cầu hủy đơn hàng đã được gửi tới xưởng mộc",
        "success"
      );

      closeModal();
      refetch();
    } catch (err) {
      notify(
        "Gửi yêu cầu thất bại",
        err?.data?.message || "Có lỗi xảy ra, vui lòng thử lại sau",
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const openModal = () => setIsOpen(true);
  const closeModal = () => {
    setIsOpen(false);
    setReason(""); // Reset form
  };

  return (
    <>
      <TouchableOpacity
        style={styles.button}
        onPress={openModal}
        activeOpacity={0.7}
      >
        <Icon name="x-octagon" size={16} color="red" />
        <Text style={styles.buttonText}>Yêu cầu hủy đơn</Text>
      </TouchableOpacity>

      <Modal
        visible={isOpen}
        animationType="slide"
        transparent={true}
        onRequestClose={!isLoading ? closeModal : null}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalHeaderText}>Yêu cầu hủy đơn</Text>
              {!isLoading && (
                <TouchableOpacity onPress={closeModal}>
                  <Icon name="x" size={24} color="#333" />
                </TouchableOpacity>
              )}
            </View>

            <ScrollView style={styles.modalBody}>
              <View style={styles.contentContainer}>
                <Text style={styles.warningText}>
                  Bạn đang yêu cầu hủy đơn hàng này. Vui lòng cung cấp lý do rõ
                  ràng.
                </Text>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>Lý do hủy đơn</Text>
                  <TextInput
                    style={styles.textarea}
                    value={reason}
                    onChangeText={handleReasonChange}
                    placeholder="Nhập lý do hủy đơn của bạn"
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
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={[styles.footerButton, styles.closeButton]}
                onPress={closeModal}
                disabled={isLoading}
              >
                <Icon name="x-circle" size={16} color="#333" />
                <Text style={styles.closeButtonText}>Đóng</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.footerButton,
                  styles.cancelButton,
                  (!reason ||
                    reason.trim() === "" ||
                    isCheckboxDisabled ||
                    isLoading) &&
                    styles.disabledButton,
                ]}
                onPress={handleSubmit}
                disabled={
                  !reason ||
                  reason.trim() === "" ||
                  isCheckboxDisabled ||
                  isLoading
                }
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <>
                    <Icon name="alert-circle" size={16} color="white" />
                    <Text style={styles.cancelButtonText}>
                      Không nhận đơn hàng
                    </Text>
                  </>
                )}
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
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "red",
    backgroundColor: "transparent",
    gap: 8,
  },
  buttonText: {
    color: "red",
    fontWeight: "600",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: "70%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  modalHeaderText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  modalBody: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  warningText: {
    color: "red",
    marginBottom: 16,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontWeight: "bold",
    marginBottom: 8,
  },
  textarea: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
    padding: 10,
    height: 100,
    textAlignVertical: "top",
  },
  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 16,
  },
  modalFooter: {
    flexDirection: "row",
    justifyContent: "flex-end",
    padding: 16,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  footerButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
  },
  closeButton: {
    backgroundColor: "#F3F4F6",
  },
  closeButtonText: {
    color: "#333",
    fontWeight: "500",
  },
  cancelButton: {
    backgroundColor: "red",
  },
  cancelButtonText: {
    color: "white",
    fontWeight: "600",
  },
  disabledButton: {
    opacity: 0.5,
  },
});
