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
  Platform,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Picker } from "@react-native-picker/picker";
import Icon from "react-native-vector-icons/Feather";
import { appColorTheme } from "../../../../../../config/appconfig.js";
import { useAcceptServiceOrderMutation } from "../../../../../../services/serviceOrderApi.js";
import CheckboxList from "../../../../../../components/Utility/CheckboxList.jsx";
import { useNotify } from "../../../../../../components/Utility/Notify.jsx";
import { validateAppointment } from "../../../../../../validations";

export default function AppointmentUpdateModal({ order, refetch }) {
  // Modal state
  const [isOpen, setIsOpen] = useState(false);
  const notify = useNotify();

  // API mutation
  const [acceptServiceOrder, { isLoading }] = useAcceptServiceOrderMutation();

  // Button disable state for checkboxes
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  // Form fields
  const [form, setForm] = useState(order?.consultantAppointment?.form || "");
  const [meetAddress, setMeetAddress] = useState(
    order?.consultantAppointment?.meetAddress || ""
  );
  const [desc, setDesc] = useState(order?.consultantAppointment?.content || "");

  // Date picker
  const [date, setDate] = useState(
    order?.consultantAppointment?.dateTime
      ? new Date(order?.consultantAppointment?.dateTime)
      : new Date()
  );
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);

  const handleSubmit = async () => {
    try {
      // Prepare data for validation and API
      const formData = {
        form,
        meetAddress,
        timeMeeting: new Date(
          date.getTime() - date.getTimezoneOffset() * 60000
        ).toISOString(),
        desc,
      };

      const apiData = {
        serviceOrderId: order.orderId,
        ...formData,
      };

      // Validate form data
      const errors = validateAppointment(formData);
      if (errors.length > 0) {
        notify("Lỗi xác thực", errors[0], "error");
        return;
      }

      // If validation passes, proceed with API call
      await acceptServiceOrder(apiData).unwrap();

      notify(
        "Lịch hẹn đã được cập nhật",
        "Thông tin lịch hẹn đã được lưu thành công",
        "success"
      );
      refetch();
      onClose();
    } catch (error) {
      notify(
        "Đã xảy ra lỗi",
        error.message || "Không thể cập nhật lịch hẹn, vui lòng thử lại sau",
        "error"
      );
    }
  };

  const confirmationItems = [
    {
      description: "Tôi đã kiểm tra thông tin và xác nhận thao tác",
      isOptional: false,
    },
  ];

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (selectedDate) => {
    setDate(selectedDate);
    hideDatePicker();
  };

  // Format date for display
  const formatDate = (date) => {
    if (!date) return "";
    return `${date.getDate()}/${
      date.getMonth() + 1
    }/${date.getFullYear()} ${date.getHours()}:${date
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <>
      <TouchableOpacity
        style={styles.button}
        onPress={onOpen}
        activeOpacity={0.7}
      >
        <Icon name="calendar" size={16} color={appColorTheme.blue_0} />
        <Text style={styles.buttonText}>
          Cập nhật lịch hẹn tư vấn về hợp đồng
        </Text>
      </TouchableOpacity>

      <Modal
        visible={isOpen}
        animationType="slide"
        transparent={true}
        onRequestClose={!isLoading ? onClose : null}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalHeaderText}>Cập nhật lịch hẹn</Text>
              {!isLoading && (
                <TouchableOpacity onPress={onClose}>
                  <Icon name="x" size={24} color="#333" />
                </TouchableOpacity>
              )}
            </View>

            <ScrollView style={styles.modalBody}>
              <View style={styles.contentContainer}>
                <Text style={styles.heading}>Thông tin lịch hẹn</Text>

                <View style={styles.formContainer}>
                  <View style={styles.formGroup}>
                    <Text style={styles.label}>Hình thức:</Text>
                    <View style={styles.pickerContainer}>
                      <Picker
                        selectedValue={form}
                        onValueChange={(itemValue) => setForm(itemValue)}
                        style={styles.picker}
                      >
                        <Picker.Item label="Chọn hình thức" value="" />
                        <Picker.Item label="Online" value="Online" />
                        <Picker.Item label="Offline" value="Offline" />
                      </Picker>
                    </View>
                  </View>

                  <View style={styles.formGroup}>
                    <Text style={styles.label}>Địa điểm:</Text>
                    <TextInput
                      style={styles.input}
                      value={meetAddress}
                      onChangeText={setMeetAddress}
                      placeholder="Địa điểm"
                    />
                  </View>

                  <View style={styles.formGroup}>
                    <Text style={styles.label}>Ngày hẹn:</Text>
                    <TouchableOpacity
                      style={styles.dateInput}
                      onPress={showDatePicker}
                    >
                      <Text>{formatDate(date)}</Text>
                    </TouchableOpacity>

                    <DateTimePickerModal
                      isVisible={isDatePickerVisible}
                      mode="datetime"
                      onConfirm={handleConfirm}
                      onCancel={hideDatePicker}
                      date={date}
                      locale="vi"
                      confirmTextIOS="Xác nhận"
                      cancelTextIOS="Hủy"
                    />
                  </View>

                  <View style={styles.formGroup}>
                    <Text style={styles.label}>Mô tả:</Text>
                    <TextInput
                      style={styles.textarea}
                      multiline={true}
                      numberOfLines={4}
                      value={desc}
                      onChangeText={setDesc}
                      placeholder="Mô tả"
                    />
                  </View>
                </View>

                <View style={styles.checkboxContainer}>
                  <CheckboxList
                    items={confirmationItems}
                    setButtonDisabled={setIsButtonDisabled}
                  />
                </View>
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={[styles.footerButton, styles.closeButton]}
                onPress={onClose}
                disabled={isLoading}
              >
                <Icon name="x-circle" size={16} color="#333" />
                <Text style={styles.closeButtonText}>Đóng</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.footerButton,
                  styles.confirmButton,
                  (isButtonDisabled || isLoading) && styles.disabledButton,
                ]}
                onPress={handleSubmit}
                disabled={isButtonDisabled || isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <>
                    <Icon name="check" size={16} color="white" />
                    <Text style={styles.confirmButtonText}>Cập nhật</Text>
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
    borderColor: appColorTheme.blue_0,
    backgroundColor: "transparent",
    gap: 8,
  },
  buttonText: {
    color: appColorTheme.blue_0,
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
    height: "90%",
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
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 24,
  },
  formContainer: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
    marginBottom: 16,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontWeight: "bold",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
    padding: 10,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
  },
  picker: {
    height: 50,
  },
  dateInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
    padding: 10,
  },
  textarea: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
    padding: 10,
    height: 100,
    textAlignVertical: "top",
  },
  checkboxContainer: {
    marginTop: 16,
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
  confirmButton: {
    backgroundColor: "blue",
  },
  confirmButtonText: {
    color: "white",
    fontWeight: "600",
  },
  disabledButton: {
    opacity: 0.5,
  },
});
