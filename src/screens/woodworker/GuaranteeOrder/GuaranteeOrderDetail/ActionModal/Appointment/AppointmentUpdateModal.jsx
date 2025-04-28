import React, { useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  TextInput,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Icon from "react-native-vector-icons/Feather";
import { appColorTheme } from "../../../../../../config/appconfig.js";
import { useAcceptGuaranteeOrderMutation } from "../../../../../../services/guaranteeOrderApi.js";
import CheckboxList from "../../../../../../components/Utility/CheckboxList.jsx";
import { useNotify } from "../../../../../../components/Utility/Notify.jsx";
import { validateAppointment } from "../../../../../../validations";

export default function AppointmentUpdateModal({ order, refetch }) {
  // Modal
  const [isOpen, setIsOpen] = useState(false);
  const initialRef = useRef(null);
  const notify = useNotify();

  // Form state
  const [form, setForm] = useState(order?.consultantAppointment?.form || "");
  const [meetAddress, setMeetAddress] = useState(
    order?.consultantAppointment?.meetAddress || ""
  );
  const [dateTime, setDateTime] = useState(
    order?.consultantAppointment?.dateTime
      ? new Date(order?.consultantAppointment?.dateTime)
      : new Date()
  );
  const [description, setDescription] = useState(
    order?.consultantAppointment?.content || ""
  );
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  // API mutation
  const [acceptServiceOrder, { isLoading }] = useAcceptGuaranteeOrderMutation();

  // Button disable state for checkboxes
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  const handleSubmit = async () => {
    try {
      // Prepare data for validation and API
      const formDataObj = {
        form,
        meetAddress,
        timeMeeting: new Date(
          dateTime.getTime() - dateTime.getTimezoneOffset() * 60000
        ).toISOString(),
        desc: description,
      };

      const apiData = {
        serviceOrderId: order.guaranteeOrderId,
        ...formDataObj,
      };

      // Validate form data
      const errors = validateAppointment(formDataObj);
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
      setIsOpen(false);
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

  const formatDate = (date) => {
    if (!date) return "";
    return `${date.getDate()}/${
      date.getMonth() + 1
    }/${date.getFullYear()} ${date.getHours()}:${date
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (selectedDate) => {
    setDateTime(selectedDate);
    hideDatePicker();
  };

  return (
    <>
      <TouchableOpacity style={styles.button} onPress={() => setIsOpen(true)}>
        <Icon
          name="calendar"
          size={20}
          color={appColorTheme.blue_0}
          style={styles.icon}
        />
        <Text style={styles.buttonText}>
          {order?.isGuarantee
            ? "Cập nhật lịch hẹn tư vấn để xem xét lại chuyển sang sửa chữa"
            : "Cập nhật lịch hẹn tư vấn về báo giá sửa chữa"}
        </Text>
      </TouchableOpacity>

      <Modal
        visible={isOpen}
        transparent={true}
        animationType="slide"
        onRequestClose={() => !isLoading && setIsOpen(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Cập nhật lịch hẹn</Text>
              {!isLoading && (
                <TouchableOpacity
                  onPress={() => setIsOpen(false)}
                  style={styles.closeButton}
                >
                  <Icon name="x" size={20} color="#000" />
                </TouchableOpacity>
              )}
            </View>

            <ScrollView style={styles.modalBody}>
              <View style={styles.formContent}>
                <Text style={styles.sectionTitle}>Thông tin lịch hẹn</Text>

                <View style={styles.formBox}>
                  <View style={styles.formRow}>
                    <Text style={styles.formLabel}>Hình thức:</Text>
                    <View style={styles.formInput}>
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

                  <View style={styles.formRow}>
                    <Text style={styles.formLabel}>Địa điểm:</Text>
                    <View style={styles.formInput}>
                      <TextInput
                        style={styles.textInput}
                        placeholder="Địa điểm"
                        value={meetAddress}
                        onChangeText={setMeetAddress}
                      />
                    </View>
                  </View>

                  <View style={styles.formRow}>
                    <Text style={styles.formLabel}>Ngày hẹn:</Text>
                    <View style={styles.formInput}>
                      <TouchableOpacity
                        style={styles.dateButton}
                        onPress={showDatePicker}
                      >
                        <Text>{formatDate(dateTime)}</Text>
                        <Icon
                          name="calendar"
                          size={16}
                          color={appColorTheme.blue_0}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View style={styles.formRow}>
                    <Text style={styles.formLabel}>Mô tả:</Text>
                    <View style={styles.formInput}>
                      <TextInput
                        style={[styles.textInput, styles.textArea]}
                        placeholder="Mô tả"
                        value={description}
                        onChangeText={setDescription}
                        multiline={true}
                        numberOfLines={4}
                      />
                    </View>
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
                style={[
                  styles.footerButton,
                  styles.updateBtn,
                  isButtonDisabled && styles.disabledButton,
                ]}
                onPress={handleSubmit}
                disabled={isButtonDisabled || isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <>
                    <Icon
                      name="check"
                      size={18}
                      color="white"
                      style={styles.buttonIcon}
                    />
                    <Text style={styles.buttonTextLight}>Cập nhật</Text>
                  </>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.footerButton, styles.closeBtn]}
                onPress={() => setIsOpen(false)}
                disabled={isLoading}
              >
                <Icon
                  name="x"
                  size={18}
                  color="#000"
                  style={styles.buttonIcon}
                />
                <Text style={styles.buttonTextDark}>Đóng</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="datetime"
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
          date={dateTime}
          locale="vi"
          confirmTextIOS="Xác nhận"
          cancelTextIOS="Hủy"
        />
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: appColorTheme.blue_0,
    backgroundColor: "transparent",
    marginVertical: 8,
  },
  buttonText: {
    color: appColorTheme.blue_0,
    fontWeight: "600",
    flexShrink: 1,
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
    width: "95%",
    maxHeight: "90%",
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
    backgroundColor: "#F7FAFC",
  },
  formContent: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 24,
  },
  formBox: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  formRow: {
    flexDirection: "row",
    marginBottom: 16,
    alignItems: "center",
  },
  formLabel: {
    width: 100,
    fontWeight: "bold",
  },
  formInput: {
    flex: 1,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 4,
    padding: 10,
  },
  textArea: {
    textAlignVertical: "top",
    minHeight: 100,
  },
  picker: {
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 4,
  },
  dateButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 4,
    padding: 10,
  },
  checkboxContainer: {
    marginTop: 24,
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
  updateBtn: {
    backgroundColor: appColorTheme.blue_0,
  },
  closeBtn: {
    backgroundColor: "#E2E8F0",
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
