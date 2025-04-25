import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { appColorTheme } from "../../../../../../config/appconfig.js";
import ImageListSelector from "../../../../../../components/Utility/ImageListSelector.jsx";
import ImageUpdateUploader from "../../../../../../components/Utility/ImageUpdateUploader.jsx";
import { useAddProductImageMutation } from "../../../../../../services/serviceOrderApi";
import { useNotify } from "../../../../../../components/Utility/Notify.jsx";
import Accordion from "react-native-collapsible/Accordion";

export default function DesignUpdateModal({
  products = [],
  refetch,
  serviceOrderId,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [addProductImage, { isLoading }] = useAddProductImageMutation();
  const notify = useNotify();

  // State for accordion
  const [activeSections, setActiveSections] = useState([0]);

  // Store each product's upload status
  const [productUploads, setProductUploads] = useState({});

  // Store the complete request payload that will be sent to the API
  const [requestPayload, setRequestPayload] = useState([]);

  // Track if we're currently submitting the final request
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onOpen = () => setIsOpen(true);
  const closeModal = () => {
    setProductUploads({});
    setRequestPayload([]);
    setIsOpen(false);
  };

  // This function now just stores the uploaded media URLs in state
  const handleUploadComplete = (productId, mediaUrls) => {
    // Store the new upload in our state
    setProductUploads((prev) => ({
      ...prev,
      [productId]: { mediaUrls, isUploaded: true },
    }));

    // Update the request payload
    setRequestPayload((prev) => {
      // Remove any existing entry for this product
      const filtered = prev.filter((item) => item.productId !== productId);
      // Add the new entry
      return [
        ...filtered,
        {
          mediaUrls,
          productId,
        },
      ];
    });
  };

  // Submit all uploads at once
  const handleSubmitAllUploads = async () => {
    try {
      setIsSubmitting(true);

      // Format the request payload as an array of objects
      const formattedPayload = requestPayload.map((item) => ({
        mediaUrls: item.mediaUrls,
        productId: item.productId,
      }));

      // Call the API with the array as body and serviceId as query param
      await addProductImage({
        serviceId: serviceOrderId,
        body: formattedPayload, // This will be sent as the request body
      }).unwrap();

      notify(
        "Cập nhật thiết kế thành công",
        "Tất cả thiết kế đã được lưu",
        "success"
      );

      refetch();
      closeModal();
    } catch (error) {
      notify(
        "Lỗi cập nhật thiết kế",
        error.data?.message || "Không thể cập nhật thiết kế",
        "error"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Check if a specific product has been prepared for upload
  const isProductPrepared = (productId) => {
    return !!productUploads[productId]?.isUploaded;
  };

  // Check if all products have been prepared for upload
  const allProductsPrepared = products.every(
    (product) =>
      isProductPrepared(product.requestedProductId) ||
      product.personalProductDetail?.designUrls
  );

  // Calculate how many products are ready
  const preparedProductsCount = products.reduce((count, product) => {
    if (
      isProductPrepared(product.requestedProductId) ||
      product.personalProductDetail?.designUrls
    ) {
      return count + 1;
    }
    return count;
  }, 0);

  // Progress percentage
  const progressPercentage =
    products.length > 0 ? (preparedProductsCount / products.length) * 100 : 0;

  // Accordion section handling
  const updateActiveSections = (sections) => {
    setActiveSections(sections);
  };

  const renderHeader = (product, index, isActive) => {
    const designUrls = product.personalProductDetail?.designUrls || "";
    const alreadyHasDesign = !!designUrls;
    const isPrepared = isProductPrepared(product.requestedProductId);

    return (
      <View style={styles.accordionHeader}>
        <View style={styles.accordionHeaderContent}>
          <Text style={styles.accordionHeaderText}>
            Sản phẩm #{index + 1} - {product.category?.categoryName}
          </Text>
          {isPrepared && (
            <View style={styles.badgeSuccess}>
              <Text style={styles.badgeText}>Đã chuẩn bị</Text>
            </View>
          )}
          {alreadyHasDesign && !isPrepared && (
            <View style={styles.badgeInfo}>
              <Text style={styles.badgeText}>Thiết kế hiện tại</Text>
            </View>
          )}
        </View>
        <Icon
          name={isActive ? "chevron-up" : "chevron-down"}
          size={16}
          color="#333"
        />
      </View>
    );
  };

  const renderContent = (product) => {
    const designUrls = product.personalProductDetail?.designUrls || "";
    const alreadyHasDesign = !!designUrls;
    const isPrepared = isProductPrepared(product.requestedProductId);

    return (
      <View style={styles.accordionContent}>
        {alreadyHasDesign && !isPrepared && (
          <View style={styles.imageSection}>
            <Text style={styles.sectionTitle}>Thiết kế hiện tại:</Text>
            <ImageListSelector imgUrls={designUrls} imgH={300} />
            <View style={styles.divider} />
          </View>
        )}

        {isPrepared ? (
          <View style={styles.alertSuccess}>
            <Icon name="check-circle" size={20} color="#38A169" />
            <Text style={styles.alertText}>Đã chuẩn bị thiết kế mới</Text>
          </View>
        ) : (
          <View>
            <Text style={styles.sectionTitle}>Tải lên thiết kế mới:</Text>
            <ImageUpdateUploader
              imgUrls={designUrls}
              maxFiles={5}
              onUploadComplete={(urls) =>
                handleUploadComplete(product.requestedProductId, urls)
              }
            />
          </View>
        )}
      </View>
    );
  };

  return (
    <>
      <TouchableOpacity
        style={styles.button}
        onPress={onOpen}
        activeOpacity={0.7}
      >
        <Icon name="image" size={16} color={appColorTheme.blue_0} />
        <Text style={styles.buttonText}>Cập nhật thiết kế</Text>
      </TouchableOpacity>

      <Modal
        visible={isOpen}
        animationType="slide"
        transparent={true}
        onRequestClose={!isSubmitting ? closeModal : null}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalHeaderText}>
                Cập nhật thiết kế sản phẩm
              </Text>
              {!isSubmitting && (
                <TouchableOpacity onPress={closeModal}>
                  <Icon name="x" size={24} color="#333" />
                </TouchableOpacity>
              )}
            </View>

            <ScrollView style={styles.modalBody}>
              {isLoading || isSubmitting ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator
                    size="large"
                    color={appColorTheme.brown_2}
                  />
                  <Text style={styles.loadingText}>
                    {isSubmitting ? "Đang lưu thiết kế..." : "Đang xử lý..."}
                  </Text>
                </View>
              ) : (
                <View style={styles.contentContainer}>
                  <View style={styles.progressBarContainer}>
                    <View
                      style={[
                        styles.progressBar,
                        { width: `${progressPercentage}%` },
                      ]}
                    />
                  </View>

                  <Text style={styles.progressText}>
                    Đã chuẩn bị {preparedProductsCount}/{products.length} sản
                    phẩm
                  </Text>

                  <Accordion
                    sections={products}
                    activeSections={activeSections}
                    renderHeader={renderHeader}
                    renderContent={renderContent}
                    onChange={updateActiveSections}
                    expandMultiple
                  />
                </View>
              )}
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={[styles.footerButton, styles.closeButton]}
                onPress={closeModal}
                disabled={isSubmitting}
              >
                <Icon name="x-circle" size={16} color="#333" />
                <Text style={styles.closeButtonText}>Đóng</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.footerButton,
                  styles.confirmButton,
                  (!allProductsPrepared ||
                    products.length === 0 ||
                    requestPayload.length === 0 ||
                    isSubmitting) &&
                    styles.disabledButton,
                ]}
                onPress={handleSubmitAllUploads}
                disabled={
                  !allProductsPrepared ||
                  products.length === 0 ||
                  requestPayload.length === 0 ||
                  isSubmitting
                }
              >
                {isSubmitting ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <>
                    <Icon name="upload" size={16} color="white" />
                    <Text style={styles.confirmButtonText}>
                      Lưu tất cả thiết kế
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
  loadingContainer: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: "#E5E7EB",
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 8,
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#38A169",
  },
  progressText: {
    marginBottom: 16,
  },
  accordionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#F5F5F5",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  accordionHeaderContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },
  accordionHeaderText: {
    fontWeight: "bold",
  },
  badgeSuccess: {
    backgroundColor: "#38A169",
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 8,
  },
  badgeInfo: {
    backgroundColor: "#3182CE",
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 8,
  },
  badgeText: {
    color: "white",
    fontSize: 12,
  },
  accordionContent: {
    padding: 16,
    backgroundColor: "white",
  },
  imageSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontWeight: "bold",
    marginBottom: 8,
  },
  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 16,
  },
  alertSuccess: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0FFF4",
    padding: 16,
    borderRadius: 4,
    gap: 8,
  },
  alertText: {
    color: "#38A169",
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
    backgroundColor: appColorTheme.blue_0,
  },
  confirmButtonText: {
    color: "white",
    fontWeight: "600",
  },
  disabledButton: {
    opacity: 0.5,
  },
});
