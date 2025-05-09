import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAcceptServiceOrderMutation } from "../../../../../../services/serviceOrderApi";
import { useNotify } from "../../../../../../components/Utility/Notify";
import { formatDateTimeToVietnamese } from "../../../../../../utils/utils";

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

export default function AppointmentConfirmModal({
  serviceOrderId,
  appointment,
  buttonText = "Xác nhận",
  refetch,
}) {
  const [modalVisible, setModalVisible] = useState(false);
  const notify = useNotify();
  const [acceptOrder, { isLoading }] = useAcceptServiceOrderMutation();
  const [isChecked, setIsChecked] = useState(false);

  const handleSubmit = async () => {
    try {
      await acceptOrder({
        serviceOrderId: serviceOrderId,
      }).unwrap();

      notify(
        "Xác nhận thành công",
        "Đơn hàng của bạn đã được cập nhật",
        "success"
      );

      setModalVisible(false);
      refetch(); // Refresh data
    } catch (err) {
      notify(
        "Xác nhận thất bại",
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
        style={styles.confirmButton}
        onPress={() => setModalVisible(true)}
      >
        <Ionicons name="checkmark-circle" size={20} color="white" />
        <Text style={styles.confirmButtonText}>{buttonText}</Text>
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
              <Text style={styles.modalHeaderText}>{buttonText}</Text>
              {!isLoading && (
                <TouchableOpacity onPress={closeModal}>
                  <Ionicons name="close" size={24} color="#333" />
                </TouchableOpacity>
              )}
            </View>

            <ScrollView style={styles.modalBody}>
              <Text style={styles.sectionTitle}>Chi tiết lịch hẹn</Text>

              {appointment && (
                <View style={styles.appointmentContainer}>
                  <View style={styles.appointmentRow}>
                    <Text style={styles.appointmentLabel}>Ngày hẹn:</Text>
                    <Text style={styles.appointmentValue}>
                      {formatDateTimeToVietnamese(appointment.dateTime)}
                    </Text>
                  </View>

                  <View style={styles.appointmentRow}>
                    <Text style={styles.appointmentLabel}>Hình thức:</Text>
                    <Text style={styles.appointmentValue}>
                      {appointment.form || "Không có"}
                    </Text>
                  </View>

                  <View style={styles.appointmentColumn}>
                    <Text style={styles.appointmentLabel}>Địa điểm:</Text>
                    <Text style={styles.appointmentFullValue}>
                      {appointment.meetAddress || "Không có"}
                    </Text>
                  </View>

                  <View style={styles.appointmentColumn}>
                    <Text style={styles.appointmentLabel}>Mô tả:</Text>
                    <Text style={styles.appointmentFullValue}>
                      {appointment.content || "Không có"}
                    </Text>
                  </View>
                </View>
              )}

              <View style={styles.divider} />

              <View style={styles.checkboxContainer}>
                <CustomCheckbox
                  label="Tôi đã kiểm tra thông tin và xác nhận thao tác"
                  checked={isChecked}
                  onChange={setIsChecked}
                />
              </View>
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
                  !isChecked && styles.disabledButton,
                ]}
                onPress={handleSubmit}
                disabled={isLoading || !isChecked}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <>
                    <Ionicons name="checkmark" size={20} color="white" />
                    <Text style={styles.submitButtonText}>Xác nhận</Text>
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
  confirmButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#48BB78",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    justifyContent: "center",
  },
  confirmButtonText: {
    color: "white",
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 12,
  },
  appointmentContainer: {
    backgroundColor: "#F7FAFC",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  appointmentRow: {
    flexDirection: "row",
    marginBottom: 10,
    flexWrap: "wrap",
  },
  appointmentColumn: {
    flexDirection: "column",
    marginBottom: 10,
  },
  appointmentLabel: {
    fontWeight: "600",
    width: 100,
    marginBottom: 4,
  },
  appointmentValue: {
    flex: 1,
    flexWrap: "wrap",
  },
  appointmentFullValue: {
    marginTop: 4,
    flexWrap: "wrap",
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
    borderColor: "#48BB78",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  checkboxChecked: {
    backgroundColor: "#48BB78",
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
    backgroundColor: "#48BB78",
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
