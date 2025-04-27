import { useRef, useState } from "react";
import { useSendServiceOrderFeedbackMutation } from "../../../../../../services/serviceOrderApi";
import { useNotify } from "../../../../../../components/Utility/Notify";
import { FiAlertCircle, FiXCircle, FiXOctagon } from "react-icons/fi";
import CheckboxList from "../../../../../../components/Utility/CheckboxList";
import { validateFeedback } from "../../../../../../validations";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  ActivityIndicator,
} from "react-native";

export default function CancelModal({ serviceOrderId, refetch }) {
  const [isModalVisible, setModalVisible] = useState(false);
  const notify = useNotify();
  const [sendFeedback, { isLoading }] = useSendServiceOrderFeedbackMutation();
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
      // Prepare data for validation
      const data = {
        feedback: reason, // Using the same validation as feedback
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
        feedback: `[HỦY ĐƠN] ${reason}`,
      }).unwrap();

      notify(
        "Đã gửi yêu cầu hủy",
        "Yêu cầu hủy đơn hàng đã được gửi tới xưởng mộc",
        "success"
      );

      setModalVisible(false);
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
      <TouchableOpacity
        style={styles.button}
        onPress={() => setModalVisible(true)}
      >
        <FiXOctagon style={styles.buttonIcon} />
        <Text style={styles.buttonText}>Yêu cầu hủy đơn</Text>
      </TouchableOpacity>

      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => !isLoading && setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Yêu cầu hủy đơn</Text>
            {!isLoading && (
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <FiXCircle style={styles.closeIcon} />
              </TouchableOpacity>
            )}

            <View style={styles.modalBody}>
              <Text style={styles.warningText}>
                Bạn đang yêu cầu hủy đơn hàng này. Vui lòng cung cấp lý do rõ ràng.
              </Text>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Lý do hủy đơn</Text>
                <TextInput
                  style={styles.input}
                  value={reason}
                  onChangeText={handleReasonChange}
                  placeholder="Nhập lý do hủy đơn của bạn"
                  multiline
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
                style={[styles.footerButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
                disabled={isLoading}
              >
                <FiXCircle style={styles.buttonIcon} />
                <Text style={styles.buttonText}>Đóng</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.footerButton, styles.submitButton]}
                onPress={handleSubmit}
                disabled={!reason || reason.trim() === "" || isCheckboxDisabled || isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <FiAlertCircle style={styles.buttonIcon} />
                )}
                <Text style={[styles.buttonText, styles.submitButtonText]}>
                  Gửi yêu cầu hủy
                </Text>
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
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#E53E3E',
    padding: 8,
    borderRadius: 4,
  },
  buttonIcon: {
    color: '#E53E3E',
    marginRight: 8,
  },
  buttonText: {
    color: '#E53E3E',
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    width: '90%',
    maxWidth: 500,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    padding: 16,
    textAlign: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  closeIcon: {
    fontSize: 20,
    color: '#666',
  },
  modalBody: {
    padding: 16,
  },
  warningText: {
    color: '#E53E3E',
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 4,
    padding: 8,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  divider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 16,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  footerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 4,
    marginLeft: 8,
  },
  cancelButton: {
    backgroundColor: '#EDF2F7',
  },
  submitButton: {
    backgroundColor: '#E53E3E',
  },
  submitButtonText: {
    color: 'white',
  },
});
