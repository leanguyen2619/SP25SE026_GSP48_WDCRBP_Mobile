import { useRef, useState } from "react";
import { useSubmitFeedbackMutation } from "../../../../../../services/guaranteeOrderApi";
import { useNotify } from "../../../../../../components/Utility/Notify";
import { FiEdit, FiSend, FiXCircle } from "react-icons/fi";
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

export default function FeedbackModal({ serviceOrderId, refetch }) {
  const [isModalVisible, setModalVisible] = useState(false);
  const notify = useNotify();
  const [sendFeedback, { isLoading }] = useSubmitFeedbackMutation();
  const [feedback, setFeedback] = useState("");
  const [isCheckboxDisabled, setIsCheckboxDisabled] = useState(true);

  const checkboxItems = [
    {
      description: "Tôi đã kiểm tra thông tin và xác nhận thao tác",
      isOptional: false,
    },
  ];

  const handleFeedbackChange = (text) => {
    setFeedback(text);
  };

  const handleSubmit = async () => {
    try {
      const data = {
        feedback: feedback,
      };

      const errors = validateFeedback(data);
      if (errors.length > 0) {
        notify("Lỗi xác thực", errors[0], "error");
        return;
      }

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
      setFeedback("");
      refetch();
    } catch (err) {
      notify(
        "Gửi phản hồi thất bại",
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
        <FiEdit style={styles.buttonIcon} />
        <Text style={styles.buttonText}>Gửi phản hồi</Text>
      </TouchableOpacity>

      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => !isLoading && setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Gửi phản hồi</Text>
            {!isLoading && (
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <FiXCircle style={styles.closeIcon} />
              </TouchableOpacity>
            )}

            <View style={styles.modalBody}>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Nội dung phản hồi</Text>
                <TextInput
                  style={styles.input}
                  value={feedback}
                  onChangeText={handleFeedbackChange}
                  placeholder="Nhập phản hồi của bạn"
                  multiline
                  numberOfLines={4}
                />
              </View>

              {feedback && feedback.trim() !== "" && (
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
                disabled={!feedback || feedback.trim() === "" || isCheckboxDisabled || isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <FiSend style={styles.buttonIcon} />
                )}
                <Text style={[styles.buttonText, styles.submitButtonText]}>
                  Gửi phản hồi
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
    borderColor: '#3182CE',
    padding: 8,
    borderRadius: 4,
  },
  buttonIcon: {
    color: '#3182CE',
    marginRight: 8,
  },
  buttonText: {
    color: '#3182CE',
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
    backgroundColor: '#3182CE',
  },
  submitButtonText: {
    color: 'white',
  },
});
