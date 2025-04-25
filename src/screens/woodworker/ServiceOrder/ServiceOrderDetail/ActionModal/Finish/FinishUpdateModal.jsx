import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { appColorTheme } from "../../../../../../config/appconfig.js";
import ImageListSelector from "../../../../../../components/Utility/ImageListSelector.jsx";
import ImageUpdateUploader from "../../../../../../components/Utility/ImageUpdateUploader.jsx";
import { useAddFinishProductImageMutation } from "../../../../../../services/serviceOrderApi";
import {
  useGetShipmentsByServiceOrderIdQuery,
  useUpdateShipmentOrderCodeMutation,
} from "../../../../../../services/shipmentApi";
import { useCreateShipmentForServiceOrderMutation } from "../../../../../../services/ghnApi";
import { useNotify } from "../../../../../../components/Utility/Notify.jsx";
import { createAndUpdateShipment } from "../../../../../../utils/shippingUtils.js";
import Accordion from "react-native-collapsible/Accordion";

export default function FinishUpdateModal({
  products = [],
  refetch,
  order,
  serviceOrderId,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [addFinishProductImage, { isLoading }] =
    useAddFinishProductImageMutation();
  const { data: shipmentData, isLoading: loadingShipment } =
    useGetShipmentsByServiceOrderIdQuery(serviceOrderId, { skip: !isOpen });
  const [createShipment, { isLoading: creatingShipment }] =
    useCreateShipmentForServiceOrderMutation();
  const [updateShipmentOrderCode, { isLoading: updatingShipment }] =
    useUpdateShipmentOrderCodeMutation();
  const notify = useNotify();

  // State for accordion
  const [activeSections, setActiveSections] = useState([0]);

  // Store each product's upload status
  const [productUploads, setProductUploads] = useState({});

  // Store the complete request payload that will be sent to the API
  const [requestPayload, setRequestPayload] = useState([]);

  // Track if we're currently submitting the final request
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Shipment processing state
  const [processingShipment, setProcessingShipment] = useState(false);

  const onOpen = () => setIsOpen(true);
  const closeModal = () => {
    setProductUploads({});
    setRequestPayload([]);
    setIsOpen(false);
  };

  // Handle uploaded media URLs
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

  // Process shipment creation using the utility function
  const processShipment = async () => {
    try {
      setProcessingShipment(true);

      const shipment = shipmentData.data[0];

      const result = await createAndUpdateShipment({
        order,
        products,
        shipment,
        serviceOrderId,
        createShipment,
        updateShipmentOrderCode,
      });

      notify(
        "Thành công",
        "Đã tạo vận đơn thành công với mã: " + result.orderCode,
        "success"
      );
    } catch (error) {
      throw error;
    } finally {
      setProcessingShipment(false);
    }
  };

  // Submit all uploads at once
  const handleSubmitAllUploads = async () => {
    try {
      setIsSubmitting(true);

      // Create shipment if needed (non-installation order)
      if (!order?.install) {
        await processShipment();
      }

      // Format the request payload for the API
      const formattedPayload = requestPayload.map((item) => ({
        mediaUrls: item.mediaUrls,
        productId: item.productId,
      }));

      // Call the API to add finish product images
      await addFinishProductImage({
        serviceId: serviceOrderId,
        body: formattedPayload,
      }).unwrap();

      notify(
        "Cập nhật ảnh thành công",
        "Tất cả ảnh sản phẩm hoàn thiện đã được lưu",
        "success"
      );

      refetch();
      closeModal();
    } catch (error) {
      notify(
        "Lỗi cập nhật ảnh",
        error.data?.message || "Không thể cập nhật ảnh",
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
      product.personalProductDetail?.finishImgUrls
  );

  // Calculate how many products are ready
  const preparedProductsCount = products.reduce((count, product) => {
    if (
      isProductPrepared(product.requestedProductId) ||
      product.personalProductDetail?.finishImgUrls
    ) {
      return count + 1;
    }
    return count;
  }, 0);

  // Progress percentage
  const progressPercentage =
    products.length > 0 ? (preparedProductsCount / products.length) * 100 : 0;

  const isProcessing =
    isLoading ||
    isSubmitting ||
    loadingShipment ||
    creatingShipment ||
    updatingShipment ||
    processingShipment;

  // Prepare accordion sections
  const updateActiveSections = (sections) => {
    setActiveSections(sections);
  };

  const renderHeader = (product, _, isActive) => {
    const finishImgUrls = product.personalProductDetail?.finishImgUrls || "";
    const alreadyHasImages = finishImgUrls && finishImgUrls.trim() !== "";
    const isPrepared = isProductPrepared(product.requestedProductId);

    return (
      <View style={styles.accordionHeader}>
        <View style={styles.accordionHeaderContent}>
          <Text style={styles.accordionHeaderText}>
            Sản phẩm #{product.requestedProductId} -{" "}
            {product.category?.categoryName ||
              product?.designIdeaVariantDetail?.name}
          </Text>
          {isPrepared && (
            <View style={styles.badgeSuccess}>
              <Text style={styles.badgeText}>Đã chuẩn bị</Text>
            </View>
          )}
          {alreadyHasImages && !isPrepared && (
            <View style={styles.badgeInfo}>
              <Text style={styles.badgeText}>Ảnh hiện tại</Text>
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
    const finishImgUrls = product.personalProductDetail?.finishImgUrls || "";
    const alreadyHasImages = finishImgUrls && finishImgUrls.trim() !== "";
    const isPrepared = isProductPrepared(product.requestedProductId);

    return (
      <View style={styles.accordionContent}>
        {alreadyHasImages && !isPrepared && (
          <View style={styles.imageSection}>
            <Text style={styles.sectionTitle}>Ảnh hoàn thiện hiện tại:</Text>
            <ImageListSelector imgUrls={finishImgUrls} imgH={300} />
            <View style={styles.divider} />
          </View>
        )}

        {isPrepared ? (
          <View style={styles.alertSuccess}>
            <Icon name="check-circle" size={20} color="#38A169" />
            <Text style={styles.alertText}>Đã chuẩn bị ảnh hoàn thiện mới</Text>
          </View>
        ) : (
          <View>
            <Text style={styles.sectionTitle}>Tải lên ảnh hoàn thiện mới:</Text>
            <ImageUpdateUploader
              imgUrls={finishImgUrls}
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
        <Text style={styles.buttonText}>
          Cập nhật ảnh hoàn thiện và giao hàng
        </Text>
      </TouchableOpacity>

      <Modal
        visible={isOpen}
        animationType="slide"
        transparent={true}
        onRequestClose={!isProcessing ? closeModal : null}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalHeaderText}>
                Cập nhật ảnh hoàn thiện sản phẩm và giao hàng
              </Text>
              {!isProcessing && (
                <TouchableOpacity onPress={closeModal}>
                  <Icon name="x" size={24} color="#333" />
                </TouchableOpacity>
              )}
            </View>

            <ScrollView style={styles.modalBody}>
              {isProcessing ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator
                    size="large"
                    color={appColorTheme.brown_2}
                  />
                  <Text style={styles.loadingText}>
                    {isSubmitting
                      ? "Đang lưu ảnh..."
                      : processingShipment
                      ? "Đang tạo vận đơn..."
                      : "Đang xử lý..."}
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
                style={[
                  styles.footerButton,
                  styles.closeButton,
                  isProcessing && styles.disabledButton,
                ]}
                onPress={closeModal}
                disabled={isProcessing}
              >
                <Icon name="x-circle" size={16} color="#333" />
                <Text style={styles.closeButtonText}>Đóng</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.footerButton,
                  styles.confirmButton,
                  (isProcessing ||
                    !allProductsPrepared ||
                    products.length === 0 ||
                    requestPayload.length === 0) &&
                    styles.disabledButton,
                ]}
                onPress={handleSubmitAllUploads}
                disabled={
                  isProcessing ||
                  !allProductsPrepared ||
                  products.length === 0 ||
                  requestPayload.length === 0
                }
              >
                {isSubmitting ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <>
                    <Icon name="upload" size={16} color="white" />
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
