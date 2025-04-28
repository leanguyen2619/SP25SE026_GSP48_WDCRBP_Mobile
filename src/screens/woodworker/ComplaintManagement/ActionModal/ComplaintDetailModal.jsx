import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRef, useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import {
  appColorTheme,
  complaintStatusConstants,
} from "../../../../config/appconfig";
import { useNotify } from "../../../../components/Utility/Notify";
import {
  useUpdateComplaintWoodworkerMutation,
  useGetServiceOrderComplaintsQuery,
} from "../../../../services/complaintApi";
import ServiceInfoSection from "../../../customer/ComplaintManagement/ActionModal/ServiceInfoSection";
import ProductInfoSection from "../../../customer/ComplaintManagement/ActionModal/ProductInfoSection";
import Transaction from "../../../customer/ComplaintManagement/ActionModal/Transaction";
import ComplaintAccordion from "../../../customer/ComplaintManagement/ActionModal/ComplaintAccordion";

const { width, height } = Dimensions.get("window");

export default function ComplaintDetailModal({ complaint, refetch }) {
  const [modalVisible, setModalVisible] = useState(false);
  const notify = useNotify();
  const [response, setResponse] = useState(complaint?.woodworkerResponse || "");
  const [updateComplaintWoodworker, { isLoading }] =
    useUpdateComplaintWoodworkerMutation();

  // Extract service name and order details
  const serviceName =
    complaint?.serviceOrderDetail?.service?.service?.serviceName;
  const orderDetail = complaint?.serviceOrderDetail;
  const orderId = orderDetail?.orderId;

  // Fetch all complaints for this service order
  const { data: serviceOrderComplaints, isLoading: isLoadingComplaints } =
    useGetServiceOrderComplaintsQuery(orderId, {
      skip: !modalVisible || !orderId,
      refetchOnMountOrArgChange: true,
      refetchOnFocus: true,
      refetchOnReconnect: true,
    });

  // State to store all complaints for this order
  const [allOrderComplaints, setAllOrderComplaints] = useState([]);

  useEffect(() => {
    if (serviceOrderComplaints?.data) {
      setAllOrderComplaints(serviceOrderComplaints.data);
    }
  }, [serviceOrderComplaints?.data]);

  const handleSubmit = async () => {
    if (!response.trim()) {
      notify("Lỗi", "Vui lòng nhập nội dung phản hồi", "error");
      return;
    }

    try {
      const requestBody = {
        complaintId: complaint.complaintId,
        woodworkerResponse: response,
      };

      await updateComplaintWoodworker(requestBody).unwrap();

      notify("Thành công", "Đã gửi phản hồi khiếu nại thành công", "success");

      setModalVisible(false);
      refetch && refetch();
    } catch (error) {
      notify(
        "Lỗi",
        error.data?.message || "Không thể gửi phản hồi khiếu nại",
        "error"
      );
    }
  };

  return (
    <>
      <TouchableOpacity
        style={styles.viewButton}
        onPress={() => setModalVisible(true)}
      >
        <Ionicons name="eye" size={20} color={appColorTheme.brown_2} />
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalContainer}
        >
          <View style={styles.modalContent}>
            {/* Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                Chi tiết khiếu nại #{complaint?.complaintId}
              </Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color="#4A5568" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.scrollView}>
              {/* Service and Product Information */}
              <View style={styles.infoContainer}>
                <ServiceInfoSection
                  orderDetail={orderDetail}
                  serviceName={serviceName}
                />
              </View>

              <View style={styles.infoContainer}>
                <ProductInfoSection
                  orderDetail={orderDetail}
                  serviceName={serviceName}
                />
              </View>

              {/* Transaction Information */}
              <View style={styles.transactionContainer}>
                <Transaction order={complaint?.serviceOrderDetail} />
              </View>

              {/* All Complaints for this Order */}
              <View style={styles.complaintsContainer}>
                <ComplaintAccordion
                  orderDetail={orderDetail}
                  allOrderComplaints={allOrderComplaints}
                  currentComplaint={complaint}
                  isLoadingComplaints={isLoadingComplaints}
                />
              </View>

              {/* Response Section */}
              {complaint?.status == complaintStatusConstants.PENDING && (
                <View style={styles.responseContainer}>
                  <Text style={styles.responseTitle}>Phản hồi của bạn</Text>
                  <TextInput
                    style={styles.responseInput}
                    value={response}
                    onChangeText={setResponse}
                    placeholder="Nhập nội dung phản hồi của bạn đối với khiếu nại này..."
                    multiline
                    numberOfLines={6}
                    editable={
                      complaint?.status == complaintStatusConstants.PENDING &&
                      !isLoading
                    }
                  />
                  {complaint?.status == complaintStatusConstants.PENDING && (
                    <TouchableOpacity
                      style={[
                        styles.submitButton,
                        (!response.trim() || response.length > 1000) &&
                          styles.submitButtonDisabled,
                      ]}
                      onPress={handleSubmit}
                      disabled={!response.trim() || response.length > 1000}
                    >
                      {isLoading ? (
                        <ActivityIndicator color="white" />
                      ) : (
                        <>
                          <Ionicons
                            name="send"
                            size={20}
                            color="white"
                            style={styles.buttonIcon}
                          />
                          <Text style={styles.submitButtonText}>
                            Gửi phản hồi
                          </Text>
                        </>
                      )}
                    </TouchableOpacity>
                  )}
                </View>
              )}
            </ScrollView>

            {/* Footer */}
            <View style={styles.footer}>
              <TouchableOpacity
                style={styles.closeFooterButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.closeFooterButtonText}>Đóng</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  viewButton: {
    padding: 10,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: appColorTheme.brown_2,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "95%",
    maxHeight: "95%",
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
  scrollView: {
    backgroundColor: "#F7FAFC",
    paddingBottom: 15,
  },
  infoContainer: {
    flexDirection: "column",
    marginBottom: 15,
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  transactionContainer: {
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  complaintsContainer: {
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  responseContainer: {
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  responseTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
  },
  responseInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    minHeight: 120,
    textAlignVertical: "top",
    backgroundColor: "white",
  },
  submitButton: {
    flexDirection: "row",
    backgroundColor: appColorTheme.brown_2,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  submitButtonDisabled: {
    backgroundColor: "#ccc",
  },
  submitButtonText: {
    color: "white",
    fontWeight: "600",
  },
  buttonIcon: {
    marginRight: 8,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 20,
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
  },
  closeFooterButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 4,
    backgroundColor: "#E2E8F0",
  },
  closeFooterButtonText: {
    fontWeight: "bold",
  },
});
