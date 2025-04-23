import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSendServiceOrderFeedbackMutation } from "../../../../../../services/serviceOrderApi";
import { useNotify } from "../../../../../../components/Utility/Notify";
import { validateFeedback } from "../../../../../../validations";

// Custom Checkbox Component
const CustomCheckbox = ({ label, checked, onChange, disabled = false }) => {
  return (
    <TouchableOpacity
      style={styles.checkboxContainer}
      onPress={() => !disabled && onChange(!checked)}
      disabled={disabled}
    >
      <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
        {checked && <Ionicons name="checkmark" size={16} color="white" />}
      </View>
      <Text style={styles.checkboxLabel}>{label}</Text>
    </TouchableOpacity>
  );
};

export default function FeedbackModal({ serviceOrderId, refetch }) {
  const [modalVisible, setModalVisible] = useState(false);
  const notify = useNotify();
  const [sendFeedback, { isLoading }] = useSendServiceOrderFeedbackMutation();
  const [feedback, setFeedback] = useState("");
  const [isChecked, setIsChecked] = useState(false);

  const handleFeedbackChange = (text) => {
    setFeedback(text);
  };

  const handleSubmit = async () => {
    try {
      // Prepare data for validation
      const data = {
        feedback: feedback,
      };

      // Validate data
      const errors = validateFeedback(data);
      if (errors.length > 0) {
        notify("Lỗi xác thực", errors[0], "error");
        return;
      }

      // If validation passes, proceed with API call
      await sendFeedback({
        serviceOrderId: serviceOrderId,
        feedback: feedback,
      }).unwrap();

      notify(
        "Gửi phản hồi thành công",
        "Xưởng mộc sẽ sớm xem xét phản hồi của bạn",
        "success"
      );

      setModalVisible(false);
      setFeedback(""); // Reset form
      setIsChecked(false);
      refetch(); // Refresh data
    } catch (err) {
      notify(
        "Gửi phản hồi thất bại",
        err?.data?.message || "Có lỗi xảy ra, vui lòng thử lại sau",
        "error"
      );
    }
  };

  const closeModal = () => {
    if (!isLoading) {
      setModalVisible(false);
    }
  };

  return (
    <>
      <TouchableOpacity
        style={styles.feedbackButton}
        onPress={() => setModalVisible(true)}
      >
        <Ionicons name="create-outline" size={20} color="#3182CE" />
        <Text style={styles.feedbackButtonText}>Gửi phản hồi</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalHeaderText}>Gửi phản hồi</Text>
              {!isLoading && (
                <TouchableOpacity onPress={closeModal}>
                  <Ionicons name="close" size={24} color="#333" />
                </TouchableOpacity>
              )}
            </View>

            <ScrollView style={styles.modalBody}>
              <View style={styles.formGroup}>
                <Text style={styles.label}>Nội dung phản hồi</Text>
                <TextInput
                  style={styles.textInput}
                  value={feedback}
                  onChangeText={handleFeedbackChange}
                  placeholder="Nhập phản hồi của bạn"
                  multiline={true}
                  numberOfLines={4}
                />
              </View>

              {feedback && feedback.trim() !== "" && (
                <>
                  <View style={styles.divider} />
                  <CustomCheckbox
                    label="Tôi đã kiểm tra thông tin và xác nhận thao tác"
                    checked={isChecked}
                    onChange={setIsChecked}
                  />
                </>
              )}
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={[styles.footerButton, styles.closeButton]}
                onPress={closeModal}
                disabled={isLoading}
              >
                <Ionicons name="close-circle" size={20} color="#333" />
                <Text style={styles.closeButtonText}>Đóng</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.footerButton,
                  styles.submitButton,
                  (!feedback || feedback.trim() === "" || !isChecked) && styles.disabledButton
                ]}
                onPress={handleSubmit}
                disabled={isLoading || !feedback || feedback.trim() === "" || !isChecked}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <>
                    <Ionicons name="send" size={20} color="white" />
                    <Text style={styles.submitButtonText}>Gửi phản hồi</Text>
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
  feedbackButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#3182CE",
  },
  feedbackButtonText: {
    color: "#3182CE",
    marginLeft: 8,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 10,
    width: "90%",
    maxHeight: "80%",
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
  modalHeaderText: {
    fontSize: 18,
    fontWeight: "700",
  },
  modalBody: {
    padding: 16,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontWeight: "600",
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#CBD5E0",
    borderRadius: 6,
    padding: 10,
    minHeight: 100,
    textAlignVertical: "top",
  },
  divider: {
    height: 1,
    backgroundColor: "#E2E8F0",
    marginVertical: 16,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#3182CE",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  checkboxChecked: {
    backgroundColor: "#3182CE",
  },
  checkboxLabel: {
    flex: 1,
  },
  modalFooter: {
    flexDirection: "row",
    justifyContent: "flex-end",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
  },
  footerButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    marginLeft: 8,
  },
  closeButton: {
    backgroundColor: "#EDF2F7",
  },
  closeButtonText: {
    marginLeft: 4,
    color: "#1A202C",
  },
  submitButton: {
    backgroundColor: "#3182CE",
  },
  submitButtonText: {
    marginLeft: 4,
    color: "white",
    fontWeight: "600",
  },
  disabledButton: {
    opacity: 0.5,
  },
});
