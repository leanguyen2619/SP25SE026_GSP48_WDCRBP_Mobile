import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Alert,
  Modal,
} from "react-native";
import { useRef, useState } from "react";
import {
  appColorTheme,
  getServiceTypeLabel,
} from "../../../../config/appconfig";
import ImageUpload from "../../../../components/Utility/ImageUpload";
import { useCreateComplaintMutation } from "../../../../services/complaintApi";
import { useNotify } from "../../../../components/Utility/Notify";
import CheckboxList from "../../../../components/Utility/CheckboxList";
import { formatDateTimeString } from "../../../../utils/utils";
import { Picker } from "@react-native-picker/picker";
import { AntDesign } from "@expo/vector-icons";

export default function ComplaintCreateModal({ refetch, serviceOrders = [] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [proofImgUrls, setProofImgUrls] = useState("");
  const notify = useNotify();
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [serviceOrderId, setServiceOrderId] = useState("");
  const [complaintType, setComplaintType] = useState("");
  const [description, setDescription] = useState("");

  const [createComplaint, { isLoading }] = useCreateComplaintMutation();

  const validateComplaintData = (data) => {
    const errors = [];
    if (!data.description || data.description.trim() === "") {
      errors.push("Vui lòng nhập nội dung khiếu nại");
    }
    if (!data.serviceOrderId) {
      errors.push("Vui lòng chọn đơn hàng");
    }
    if (!data.complaintType || data.complaintType.trim() === "") {
      errors.push("Vui lòng chọn loại khiếu nại");
    }
    if (!data.proofImgUrls || data.proofImgUrls.trim() === "") {
      errors.push("Vui lòng tải lên ít nhất một ảnh minh chứng");
    }
    return errors;
  };

  const handleSubmit = async () => {
    const data = {
      description: description,
      serviceOrderId: parseInt(serviceOrderId),
      complaintType: complaintType,
      proofImgUrls: proofImgUrls,
    };

    // Validate complaint data
    const errors = validateComplaintData(data);
    if (errors.length > 0) {
      notify("Lỗi khi tạo khiếu nại", errors.join(" [---] "), "error", 3000);
      return;
    }

    try {
      await createComplaint(data).unwrap();

      notify("Khiếu nại đã được gửi thành công", "", "success", 3000);

      setProofImgUrls("");
      setServiceOrderId("");
      setComplaintType("");
      setDescription("");
      setIsOpen(false);
      refetch?.();
    } catch (error) {
      notify(
        "Lỗi khi tạo khiếu nại",
        error.data?.message || "Vui lòng thử lại sau",
        "error",
        3000
      );
    }
  };

  // Hiển thị thông báo khi không có đơn hàng
  const showServiceOrdersInfo = () => {
    if (serviceOrders.length === 0) {
      return (
        <View style={styles.infoAlert}>
          <AntDesign
            name="infocirlce"
            size={16}
            color="#3182CE"
            style={{ marginRight: 8 }}
          />
          <Text style={styles.infoText}>
            Không tìm thấy đơn hàng nào. Bạn cần có đơn hàng để tạo khiếu nại.
          </Text>
        </View>
      );
    }
    return null;
  };

  return (
    <>
      <TouchableOpacity
        style={styles.createButton}
        onPress={() => setIsOpen(true)}
      >
        <AntDesign name="plus" size={16} color={appColorTheme.green_0} />
        <Text style={styles.createButtonText}>Tạo khiếu nại mới</Text>
      </TouchableOpacity>

      <Modal
        visible={isOpen}
        animationType="slide"
        transparent={true}
        onRequestClose={() => !isLoading && setIsOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Tạo khiếu nại mới</Text>
              {!isLoading && (
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setIsOpen(false)}
                >
                  <AntDesign name="close" size={20} color="#666" />
                </TouchableOpacity>
              )}
            </View>

            <ScrollView style={styles.modalBody}>
              <View style={styles.formContainer}>
                <View style={styles.formControl}>
                  <Text style={styles.formLabel}>Đơn hàng</Text>
                  {serviceOrders.length === 0 ? (
                    showServiceOrdersInfo()
                  ) : (
                    <>
                      <View style={styles.pickerContainer}>
                        <Picker
                          selectedValue={serviceOrderId}
                          onValueChange={(itemValue) =>
                            setServiceOrderId(itemValue)
                          }
                          style={styles.picker}
                        >
                          <Picker.Item label="Chọn đơn hàng" value="" />
                          {serviceOrders.map((order) => (
                            <Picker.Item
                              key={order.orderId}
                              label={`#${order.orderId} - ${getServiceTypeLabel(
                                order.service?.service?.serviceName
                              )} - ${formatDateTimeString(order.createdAt)}`}
                              value={String(order.orderId)}
                            />
                          ))}
                        </Picker>
                      </View>
                      <Text style={styles.helperText}>
                        Chọn đơn hàng bạn muốn khiếu nại
                      </Text>
                    </>
                  )}
                </View>

                <View style={styles.formControl}>
                  <Text style={styles.formLabel}>Loại khiếu nại</Text>
                  <View style={styles.pickerContainer}>
                    <Picker
                      selectedValue={complaintType}
                      onValueChange={(itemValue) => setComplaintType(itemValue)}
                      style={styles.picker}
                    >
                      <Picker.Item label="Chọn loại khiếu nại" value="" />
                      <Picker.Item
                        label="Chất lượng sản phẩm"
                        value="Chất lượng sản phẩm"
                      />
                      <Picker.Item
                        label="Tiến độ gia công"
                        value="Tiến độ gia công"
                      />
                      <Picker.Item label="Khác" value="Khác" />
                    </Picker>
                  </View>
                </View>

                <View style={styles.formControl}>
                  <Text style={styles.formLabel}>Nội dung khiếu nại</Text>
                  <TextInput
                    style={styles.textArea}
                    multiline
                    numberOfLines={8}
                    value={description}
                    onChangeText={setDescription}
                    placeholder="Nhập nội dung khiếu nại chi tiết"
                  />
                </View>

                <View style={styles.formControl}>
                  <Text style={styles.formLabel}>Hình ảnh minh chứng</Text>
                  <ImageUpload
                    maxFiles={4}
                    onUploadComplete={(result) => {
                      setProofImgUrls(result);
                    }}
                  />
                  <Text style={styles.helperText}>
                    Tải lên tối đa 4 hình ảnh minh chứng (hình ảnh sản phẩm, hóa
                    đơn,...)
                  </Text>
                </View>

                <CheckboxList
                  items={[
                    {
                      isOptional: false,
                      description:
                        "Tôi đã kiểm tra thông tin và xác nhận thao tác",
                    },
                  ]}
                  setButtonDisabled={setButtonDisabled}
                />

                <View style={styles.actionButtons}>
                  <TouchableOpacity
                    style={styles.closeBtn}
                    onPress={() => setIsOpen(false)}
                    disabled={isLoading}
                  >
                    <AntDesign name="close" size={16} color="#333" />
                    <Text style={styles.closeBtnText}>Đóng</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.submitBtn,
                      (buttonDisabled || isLoading) && styles.disabledBtn,
                    ]}
                    onPress={handleSubmit}
                    disabled={buttonDisabled || isLoading}
                  >
                    {isLoading ? (
                      <ActivityIndicator color="white" size="small" />
                    ) : (
                      <>
                        <AntDesign name="save" size={16} color="white" />
                        <Text style={styles.submitBtnText}>Gửi khiếu nại</Text>
                      </>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  createButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: appColorTheme.green_0,
    borderRadius: 4,
    backgroundColor: "transparent",
  },
  createButtonText: {
    color: appColorTheme.green_0,
    marginLeft: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "95%",
    maxHeight: "90%",
    backgroundColor: "white",
    borderRadius: 8,
    overflow: "hidden",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  closeButton: {
    padding: 5,
  },
  modalBody: {
    backgroundColor: "#F7FAFC",
  },
  formContainer: {
    padding: 15,
  },
  formControl: {
    marginBottom: 20,
  },
  formLabel: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  pickerContainer: {
    backgroundColor: "white",
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 5,
  },
  picker: {
    height: 50,
  },
  textArea: {
    height: 120,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 4,
    padding: 10,
    textAlignVertical: "top",
  },
  helperText: {
    fontSize: 12,
    color: "#718096",
  },
  infoAlert: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EBF8FF",
    borderRadius: 4,
    padding: 10,
    marginBottom: 10,
  },
  infoText: {
    color: "#2C5282",
    flex: 1,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 20,
  },
  closeBtn: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    marginRight: 10,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    backgroundColor: "white",
  },
  closeBtnText: {
    marginLeft: 5,
  },
  submitBtn: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 4,
    backgroundColor: appColorTheme.green_0,
  },
  submitBtnText: {
    color: "white",
    marginLeft: 5,
  },
  disabledBtn: {
    opacity: 0.5,
  },
});
