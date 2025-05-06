import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  ActivityIndicator,
  Linking,
} from "react-native";
import { useNotify } from "../../../../../../components/Utility/Notify";
import Icon from "react-native-vector-icons/Feather";
import CheckboxList from "../../../../../../components/Utility/CheckboxList";
import { appColorTheme } from "../../../../../../config/appconfig";
import { format } from "date-fns";
import useAuth from "../../../../../../hooks/useAuth";
import {
  useGetContractByServiceOrderIdQuery,
  useCusSignContractMutation,
} from "../../../../../../services/contractApi";
import SignatureComponent from "../../../../../../components/Common/SignatureComponent";
import { useImageUpload } from "../../../../../../hooks/useImageUpload";

export default function ContractConfirmModal({
  serviceOrderId,
  buttonText = "Xác nhận hợp đồng",
  refetch,
  refetchDeposit,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const notify = useNotify();
  const { auth } = useAuth();
  const [isCheckboxDisabled, setIsCheckboxDisabled] = useState(true);
  const { uploadImage } = useImageUpload();
  const [submitLoading, setSubmitLoading] = useState(false);

  // Signature state
  const [savedSignature, setSavedSignature] = useState(false);
  const [localSignatureBlob, setLocalSignatureBlob] = useState(null);
  const [signatureDataUrl, setSignatureDataUrl] = useState(null);

  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);

  // Get contract data
  const {
    data: contractResponse,
    isLoading: contractLoading,
    error: contractError,
  } = useGetContractByServiceOrderIdQuery(serviceOrderId, {
    skip: !isOpen, // Only fetch when modal is open
  });

  // Customer sign contract mutation
  const [confirmContract, { isLoading: confirmLoading }] =
    useCusSignContractMutation();

  const checkboxItems = [
    {
      description: "Tôi đã kiểm tra thông tin và xác nhận thao tác",
      isOptional: false,
    },
  ];

  const formatDate = (dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return format(date, "dd/MM/yyyy");
    } catch (e) {
      return "";
    }
  };

  // Handle signature save callback
  const handleSaveSignature = (base64Data, dataUrl) => {
    setLocalSignatureBlob(base64Data);
    setSignatureDataUrl(dataUrl);
    setSavedSignature(true);
    notify("Lưu chữ ký", "Chữ ký đã được lưu thành công", "success");
  };

  const handleSubmit = async () => {
    setSubmitLoading(true);
    try {
      let customerSign = null;

      // If we have a signature, upload it
      if (savedSignature && localSignatureBlob) {
        try {
          // Sử dụng chuỗi base64 trực tiếp
          const result = await uploadImage(localSignatureBlob);
          customerSign = result.url;
        } catch (error) {
          notify(
            "Lỗi tải chữ ký",
            "Không thể tải chữ ký lên hệ thống, sử dụng chữ ký điện tử mặc định",
            "warning"
          );
        }
      }

      if (!customerSign) {
        notify("Vui lòng kí tên", "", "error");
        return;
      }

      await confirmContract({
        serviceOrderId,
        customerSign: customerSign,
        cusId: auth?.userId,
      }).unwrap();

      notify(
        "Xác nhận hợp đồng thành công",
        "Hợp đồng đã được xác nhận và đơn hàng của bạn đã được cập nhật",
        "success"
      );

      onClose();
      refetch();
      refetchDeposit();
    } catch (err) {
      notify(
        "Xác nhận thất bại",
        err?.data?.message || "Có lỗi xảy ra, vui lòng thử lại sau",
        "error"
      );
    } finally {
      setSubmitLoading(false);
    }
  };

  const isLoading = contractLoading || confirmLoading;
  const contract = contractResponse?.data;

  return (
    <>
      <TouchableOpacity
        style={styles.button}
        onPress={onOpen}
        activeOpacity={0.7}
      >
        <Icon name="check-circle" size={16} color="white" />
        <Text style={styles.buttonText}>{buttonText}</Text>
      </TouchableOpacity>

      <Modal
        visible={isOpen}
        animationType="slide"
        transparent={true}
        onRequestClose={!submitLoading ? onClose : null}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalHeaderText}>{buttonText}</Text>
              {!submitLoading && (
                <TouchableOpacity onPress={onClose}>
                  <Icon name="x" size={24} color="#333" />
                </TouchableOpacity>
              )}
            </View>

            <ScrollView style={styles.modalBody}>
              <View style={styles.contentContainer}>
                {contractLoading ? (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator
                      size="large"
                      color={appColorTheme.brown_2}
                    />
                  </View>
                ) : contractError ? (
                  <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>
                      Không thể tải thông tin hợp đồng
                    </Text>
                  </View>
                ) : contract ? (
                  <View style={styles.contractInfoContainer}>
                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>Mã hợp đồng:</Text>
                      <Text style={styles.infoValue}>
                        {contract.contractId}
                      </Text>
                    </View>

                    <View style={styles.infoRow}>
                      <TouchableOpacity
                        onPress={() =>
                          Linking.openURL(`/contract/${serviceOrderId}`)
                        }
                      >
                        <Text style={styles.linkText}>Xem chi tiết</Text>
                      </TouchableOpacity>
                    </View>

                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>
                        Ngày cam kết hoàn thành sản phẩm::
                      </Text>
                      <Text style={styles.infoValue}>
                        {formatDate(contract.completeDate)}
                      </Text>
                    </View>

                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>
                        Tổng tiền thanh toán:
                      </Text>
                      <Text style={styles.infoTotal}>
                        {contract.contractTotalAmount?.toLocaleString("vi-VN")}{" "}
                        VNĐ
                      </Text>
                    </View>

                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>Thợ thực hiện:</Text>
                      <Text style={styles.infoValue}>
                        {contract.woodworker?.username}
                      </Text>
                    </View>

                    <View style={styles.signatureContainer}>
                      <Text style={styles.infoLabel}>Chữ ký thợ:</Text>
                      {contract.woodworkerSignature ? (
                        <Image
                          source={{ uri: contract.woodworkerSignature }}
                          style={styles.signatureImage}
                          resizeMode="contain"
                        />
                      ) : (
                        <Text style={styles.infoValue}>Chưa có chữ ký</Text>
                      )}
                    </View>
                  </View>
                ) : (
                  <View style={styles.warningContainer}>
                    <Text style={styles.warningText}>
                      Không tìm thấy thông tin hợp đồng
                    </Text>
                  </View>
                )}

                {/* Add customer signature section */}
                {!contractLoading && contract && (
                  <View style={styles.signSection}>
                    <Text style={styles.sectionTitle}>
                      Ký tên xác nhận hợp đồng
                    </Text>

                    <SignatureComponent
                      onSaveSignature={handleSaveSignature}
                      savedSignature={savedSignature}
                      title="Chữ ký của bạn"
                      showSizeControls={true}
                    />
                  </View>
                )}

                <View style={styles.divider} />

                <CheckboxList
                  items={checkboxItems}
                  setButtonDisabled={setIsCheckboxDisabled}
                />
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={[
                  styles.footerButton,
                  styles.closeButton,
                  isLoading && styles.disabledButton,
                ]}
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
                  (isCheckboxDisabled || !contract || contractLoading) &&
                    styles.disabledButton,
                ]}
                onPress={handleSubmit}
                disabled={
                  isCheckboxDisabled ||
                  !contract ||
                  contractLoading ||
                  submitLoading
                }
              >
                {submitLoading ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <>
                    <Icon name="check" size={16} color="white" />
                    <Text style={styles.confirmButtonText}>
                      Xác nhận hợp đồng
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
  button: {
    backgroundColor: "green",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
  },
  buttonText: {
    color: "white",
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
    gap: 16,
  },
  loadingContainer: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  errorContainer: {
    padding: 16,
    backgroundColor: "#FEE2E2",
    borderRadius: 8,
  },
  errorText: {
    color: "#DC2626",
  },
  contractInfoContainer: {
    padding: 16,
    backgroundColor: "#F9FAFB",
    borderRadius: 8,
    gap: 12,
  },
  warningContainer: {
    padding: 16,
    backgroundColor: "#FFEDD5",
    borderRadius: 8,
  },
  warningText: {
    color: "#9A3412",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  infoLabel: {
    fontWeight: "600",
    fontSize: 14,
    flex: 2,
  },
  infoValue: {
    fontSize: 14,
    flex: 3,
  },
  infoTotal: {
    fontSize: 14,
    fontWeight: "700",
    color: appColorTheme.brown_2,
    flex: 3,
  },
  linkText: {
    color: appColorTheme.brown_2,
    textDecorationLine: "underline",
  },
  signatureContainer: {
    marginTop: 8,
  },
  signatureImage: {
    width: 200,
    height: 80,
    marginTop: 8,
  },
  signSection: {
    padding: 16,
    backgroundColor: "#F9FAFB",
    borderRadius: 8,
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 12,
  },
  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 16,
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
    backgroundColor: "green",
  },
  confirmButtonText: {
    color: "white",
    fontWeight: "600",
  },
  disabledButton: {
    opacity: 0.5,
  },
});
