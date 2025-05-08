import React, { useRef, useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useNotify } from "../../../../../../components/Utility/Notify";
import CheckboxList from "../../../../../../components/Utility/CheckboxList";
import { useCancelOrderMutation } from "../../../../../../services/serviceOrderApi";
import Icon from "react-native-vector-icons/Feather";

export default function CancelModal({ serviceOrderId, refetch }) {
  const [isOpen, setIsOpen] = useState(false);
  const notify = useNotify();
  const initialRef = useRef(null);
  const [isCheckboxDisabled, setIsCheckboxDisabled] = useState(true);
  const [cancelOrder, { isLoading }] = useCancelOrderMutation();

  const onOpen = () => setIsOpen(true);
  const onClose = () => {
    if (!isLoading) setIsOpen(false);
  };

  const checkboxItems = [
    {
      description: "Tôi đã kiểm tra thông tin và xác nhận thao tác",
      isOptional: false,
    },
  ];

  const handleSubmit = async () => {
    try {
      await cancelOrder({ serviceOrderId: Number(serviceOrderId) });

      notify("Hủy thành công", "", "success");

      onClose();
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
      <TouchableOpacity style={styles.cancelButton} onPress={onOpen}>
        <Icon name="x-octagon" size={20} color="#E53E3E" />
        <Text style={styles.cancelButtonText}>Không nhận đơn</Text>
      </TouchableOpacity>

      <Modal
        visible={isOpen}
        onRequestClose={isLoading ? undefined : onClose}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.overlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalHeaderText}>Xác nhận hủy đơn hàng</Text>
            </View>

            <View style={styles.modalBody}>
              <View style={styles.stack}>
                <Text style={styles.warningText}>
                  Bạn đang yêu cầu hủy đơn hàng này.
                </Text>

                <CheckboxList
                  items={checkboxItems}
                  setButtonDisabled={setIsCheckboxDisabled}
                />
              </View>
            </View>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                disabled={isLoading}
                style={styles.closeButton}
                onPress={onClose}
              >
                <Icon name="x-circle" size={20} color="#4A5568" />
                <Text style={styles.closeButtonText}>Đóng</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.submitButton,
                  (isCheckboxDisabled || isLoading) && styles.disabledButton,
                ]}
                onPress={handleSubmit}
                disabled={isCheckboxDisabled || isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <>
                    <Icon name="alert-circle" size={20} color="#FFFFFF" />
                    <Text style={styles.submitButtonText}>
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
  cancelButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E53E3E",
    borderRadius: 4,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  cancelButtonText: {
    marginLeft: 8,
    color: "#E53E3E",
    fontWeight: "500",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "white",
    borderRadius: 8,
    overflow: "hidden",
  },
  modalHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  modalHeaderText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  modalBody: {
    padding: 16,
  },
  stack: {
    gap: 16,
  },
  warningText: {
    color: "#E53E3E",
  },
  modalFooter: {
    flexDirection: "row",
    justifyContent: "flex-end",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
  },
  closeButton: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  closeButtonText: {
    marginLeft: 8,
    color: "#4A5568",
  },
  submitButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E53E3E",
    borderRadius: 4,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  disabledButton: {
    opacity: 0.6,
  },
  submitButtonText: {
    marginLeft: 8,
    color: "white",
    fontWeight: "500",
  },
});
