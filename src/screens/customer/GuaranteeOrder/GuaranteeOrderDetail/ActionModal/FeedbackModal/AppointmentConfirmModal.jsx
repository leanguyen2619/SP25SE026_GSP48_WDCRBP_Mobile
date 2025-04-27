import { useState } from "react";
import { useAcceptGuaranteeOrderMutation } from "../../../../../../services/guaranteeOrderApi";
import { useNotify } from "../../../../../../components/Utility/Notify";
import { Feather } from "@expo/vector-icons";
import CheckboxList from "../../../../../../components/Utility/CheckboxList";
import { formatDateTimeToVietnamese } from "../../../../../../utils/utils";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
} from "react-native";

export default function AppointmentConfirmModal({
  serviceOrderId,
  appointment,
  buttonText = "Xác nhận",
  refetch,
}) {
  const [isModalVisible, setModalVisible] = useState(false);
  const notify = useNotify();
  const [acceptOrder, { isLoading }] = useAcceptGuaranteeOrderMutation();
  const [isCheckboxDisabled, setIsCheckboxDisabled] = useState(true);

  const checkboxItems = [
    {
      description: "Tôi đã kiểm tra thông tin và xác nhận thao tác",
      isOptional: false,
    },
  ];

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

  return (
    <>
      <TouchableOpacity
        style={styles.button}
        onPress={() => setModalVisible(true)}
      >
        <Feather name="check-circle" size={18} style={styles.buttonIcon} />
        <Text style={styles.buttonText}>{buttonText}</Text>
      </TouchableOpacity>

      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => !isLoading && setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{buttonText}</Text>
            {!isLoading && (
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Feather name="x-circle" size={20} style={styles.closeIcon} />
              </TouchableOpacity>
            )}

            <View style={styles.modalBody}>
              <Text style={styles.sectionTitle}>Chi tiết lịch hẹn</Text>

              {appointment && (
                <View style={styles.appointmentDetails}>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Ngày hẹn:</Text>
                    <Text style={styles.detailValue}>
                      {formatDateTimeToVietnamese(appointment.dateTime)}
                    </Text>
                  </View>

                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Hình thức:</Text>
                    <Text style={styles.detailValue}>
                      {appointment.form || "Không có"}
                    </Text>
                  </View>

                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Địa điểm:</Text>
                    <Text style={styles.detailValue}>
                      {appointment.meetAddress || "Không có"}
                    </Text>
                  </View>

                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Mô tả:</Text>
                    <Text style={styles.detailValue}>
                      {appointment.content || "Không có"}
                    </Text>
                  </View>
                </View>
              )}

              <View style={styles.divider} />

              <CheckboxList
                items={checkboxItems}
                setButtonDisabled={setIsCheckboxDisabled}
              />
            </View>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={[styles.footerButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
                disabled={isLoading}
              >
                <Feather name="x-circle" size={18} style={styles.buttonIcon} />
                <Text style={styles.buttonText}>Đóng</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.footerButton, styles.confirmButton]}
                onPress={handleSubmit}
                disabled={isLoading || isCheckboxDisabled}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Feather name="check" size={18} style={styles.buttonIcon} />
                )}
                <Text style={[styles.buttonText, styles.confirmButtonText]}>
                  Xác nhận
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
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#38A169",
    padding: 8,
    borderRadius: 4,
  },
  buttonIcon: {
    color: "white",
    marginRight: 8,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
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
    maxWidth: 500,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    padding: 16,
    textAlign: "center",
  },
  closeButton: {
    position: "absolute",
    top: 16,
    right: 16,
  },
  closeIcon: {
    fontSize: 20,
    color: "#666",
  },
  modalBody: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 16,
  },
  appointmentDetails: {
    backgroundColor: "#F7FAFC",
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: "row",
    marginBottom: 8,
  },
  detailLabel: {
    fontWeight: "600",
    width: 100,
  },
  detailValue: {
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: "#E2E8F0",
    marginVertical: 16,
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
    padding: 8,
    borderRadius: 4,
    marginLeft: 8,
  },
  cancelButton: {
    backgroundColor: "#EDF2F7",
  },
  confirmButton: {
    backgroundColor: "#38A169",
  },
  confirmButtonText: {
    color: "white",
  },
});
