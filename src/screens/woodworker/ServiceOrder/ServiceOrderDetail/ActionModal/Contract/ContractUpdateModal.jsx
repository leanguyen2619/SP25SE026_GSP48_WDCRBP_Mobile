import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import ContractEditSection from "./ContractEditSection.jsx";
import PriceDetailSection from "./PriceDetailSection.jsx";
import { appColorTheme } from "../../../../../../config/appconfig.js";
import {
  useGetContractByServiceOrderIdQuery,
  useCreateContractCustomizeMutation,
} from "../../../../../../services/contractApi";
import { useNotify } from "../../../../../../components/Utility/Notify.jsx";
import CheckboxList from "../../../../../../components/Utility/CheckboxList.jsx";
import { useImageUpload } from "../../../../../../hooks/useImageUpload.js";

export default function ContractUpdateModal({ order, refetch }) {
  const [isOpen, setIsOpen] = useState(false);
  const serviceName = order?.service?.service?.serviceName;
  const isPersonalizationService = serviceName === "Personalization";
  const notify = useNotify();
  const [isCheckboxDisabled, setIsCheckboxDisabled] = useState(true);
  const { uploadImage } = useImageUpload();
  const [areAllProductsQuoted, setAreAllProductsQuoted] = useState(false);

  // Set quotation status to true automatically for non-Personalization services
  useEffect(() => {
    if (!isPersonalizationService) {
      setAreAllProductsQuoted(true);
    }
  }, [isPersonalizationService]);

  // Handle modal opening/closing
  const handleOpenModal = () => setIsOpen(true);
  const handleCloseModal = () => setIsOpen(false);

  // Fetch contract data if it exists
  const {
    data: contractResponse,
    isLoading: isLoadingContract,
    refetch: refetchContract,
  } = useGetContractByServiceOrderIdQuery(order?.orderId, {
    skip: !isOpen || !order?.orderId,
  });

  // Create/update contract mutation
  const [createContractCustomize, { isLoading: isSubmitting }] =
    useCreateContractCustomizeMutation();

  // Track form data
  const [contractData, setContractData] = useState(null);
  const [isUploadingSignature, setIsUploadingSignature] = useState(false);
  const [localSignatureBlob, setLocalSignatureBlob] = useState(null);

  // Handle contract data updates from the edit section
  const handleContractDataChange = (data) => {
    setContractData(data);
  };

  // Handle quotation completion status
  const handleQuotationComplete = (isComplete) => {
    setAreAllProductsQuoted(isComplete);
  };

  // Handle saved signature from ContractEditSection
  const handleSaveSignature = (blob, dataUrl) => {
    setLocalSignatureBlob(blob);
    // Also update contract data with the dataUrl for preview
    setContractData((prev) => ({
      ...prev,
      signatureData: dataUrl,
    }));
    notify("Lưu chữ ký", "Chữ ký đã được lưu thành công", "success");
  };

  const handleSubmit = async () => {
    const isExistingContract = !!contractResponse?.data;

    // Ensure all products have been quoted only for Personalization service
    if (isPersonalizationService && !areAllProductsQuoted) {
      notify(
        "Thiếu thông tin",
        "Vui lòng báo giá đầy đủ cho tất cả sản phẩm trước khi tạo hợp đồng",
        "error"
      );
      return;
    }

    // For updates - no signature check needed
    // For new contracts - validate signature
    if (
      !isExistingContract &&
      !localSignatureBlob &&
      !contractData?.signatureData
    ) {
      notify(
        "Thiếu thông tin",
        "Vui lòng ký tên và lưu chữ ký trước khi tạo hợp đồng",
        "error"
      );
      return;
    }

    try {
      setIsUploadingSignature(true);

      let signatureUrl = contractData.woodworkerSignature;

      // Upload signature if we have one for new contracts
      if (
        !isExistingContract &&
        (localSignatureBlob || contractData.signatureData)
      ) {
        // Use blob directly for upload
        const result = await uploadImage(localSignatureBlob);
        signatureUrl = result.url;
      }

      // Format the completeDate to ensure it's a proper ISO string with time
      const completeDate = new Date(contractData.completeDate);
      completeDate.setHours(23, 59, 59, 999); // Set to end of day

      // Prepare API data with the new format that includes per-product warranty durations
      const postData = {
        woodworkerSignature: signatureUrl,
        woodworkerTerms: contractData.woodworkerTerms,
        completeDate: completeDate.toISOString(),
        serviceOrderId: parseInt(order.orderId),
        requestedProductIds: contractData.requestedProductIds,
        warrantyDurations: contractData.warrantyDurations,
      };

      await createContractCustomize(postData).unwrap();

      notify(
        isExistingContract
          ? "Cập nhật hợp đồng thành công"
          : "Tạo hợp đồng thành công",
        "",
        "success"
      );

      refetch();
      refetchContract();
      handleCloseModal();
    } catch (error) {
      notify(
        "Thao tác hợp đồng thất bại",
        error.data?.message || "Vui lòng thử lại sau",
        "error"
      );
    } finally {
      setIsUploadingSignature(false);
    }
  };

  const checkboxItems = [
    {
      description: "Tôi đã kiểm tra thông tin và xác nhận thao tác",
      isOptional: false,
    },
  ];

  return (
    <>
      <TouchableOpacity
        style={styles.button}
        onPress={handleOpenModal}
        activeOpacity={0.7}
      >
        <Icon name="edit-2" size={16} color={appColorTheme.blue_0} />
        <Text style={styles.buttonText}>Soạn hợp đồng</Text>
      </TouchableOpacity>

      <Modal
        visible={isOpen}
        animationType="slide"
        transparent={true}
        onRequestClose={
          !isSubmitting && !isUploadingSignature ? handleCloseModal : null
        }
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalHeaderText}>Cập nhật hợp đồng</Text>
              {!isSubmitting && !isUploadingSignature && (
                <TouchableOpacity onPress={handleCloseModal}>
                  <Icon name="x" size={24} color="#333" />
                </TouchableOpacity>
              )}
            </View>

            <ScrollView style={styles.modalBody}>
              <View style={styles.contentContainer}>
                {isLoadingContract ? (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator
                      size="large"
                      color={appColorTheme.brown_2}
                    />
                  </View>
                ) : (
                  <>
                    {/* Show PriceDetailSection only for Personalization service */}
                    {isPersonalizationService && (
                      <>
                        <View style={styles.sectionContainer}>
                          <PriceDetailSection
                            orderId={order?.orderId}
                            onQuotationComplete={handleQuotationComplete}
                          />
                        </View>
                        <View style={styles.divider} />
                      </>
                    )}

                    {/* Show ContractEditSection based on conditions */}
                    {!isPersonalizationService ||
                    areAllProductsQuoted ||
                    contractResponse?.data ? (
                      <View style={styles.sectionContainer}>
                        <ContractEditSection
                          initialContract={contractResponse?.data || null}
                          onChange={handleContractDataChange}
                          onSaveSignature={handleSaveSignature}
                          savedSignature={localSignatureBlob ? true : false}
                          order={order}
                          isExistingContract={!!contractResponse?.data}
                        />
                      </View>
                    ) : (
                      <View style={styles.warningContainer}>
                        <Text style={styles.warningText}>
                          Vui lòng báo giá tất cả sản phẩm trước khi tiếp tục
                          soạn hợp đồng.
                        </Text>
                      </View>
                    )}

                    {(!isPersonalizationService ||
                      areAllProductsQuoted ||
                      contractResponse?.data) && (
                      <>
                        <View style={styles.checkboxContainer}>
                          <CheckboxList
                            items={checkboxItems}
                            setButtonDisabled={setIsCheckboxDisabled}
                          />
                        </View>
                      </>
                    )}
                  </>
                )}
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={[
                  styles.footerButton,
                  styles.closeButton,
                  (isSubmitting || isUploadingSignature) &&
                    styles.disabledButton,
                ]}
                onPress={handleCloseModal}
                disabled={isSubmitting || isUploadingSignature}
              >
                <Icon name="x-circle" size={16} color="#333" />
                <Text style={styles.closeButtonText}>Đóng</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.footerButton,
                  styles.confirmButton,
                  (isCheckboxDisabled ||
                    isSubmitting ||
                    isUploadingSignature) &&
                    styles.disabledButton,
                ]}
                onPress={handleSubmit}
                disabled={
                  isCheckboxDisabled || isSubmitting || isUploadingSignature
                }
              >
                {isSubmitting || isUploadingSignature ? (
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
    padding: 16,
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
    gap: 16,
  },
  sectionContainer: {
    backgroundColor: "white",
  },
  loadingContainer: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  warningContainer: {
    padding: 16,
    backgroundColor: "#FFEDD5",
    borderRadius: 8,
  },
  warningText: {
    color: "#9A3412",
  },
  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 16,
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
