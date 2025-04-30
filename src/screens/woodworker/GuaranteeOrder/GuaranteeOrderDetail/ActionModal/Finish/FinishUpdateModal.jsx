import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { appColorTheme } from "../../../../../../config/appconfig.js";
import CheckboxList from "../../../../../../components/Utility/CheckboxList.jsx";
import {
  useGetShipmentsByGuaranteeOrderIdQuery,
  useUpdateGuaranteeOrderShipmentOrderCodeMutation,
} from "../../../../../../services/shipmentApi";
import { useCreateShipmentForServiceOrderMutation } from "../../../../../../services/ghnApi";
import { useNotify } from "../../../../../../components/Utility/Notify.jsx";
import { useFinishConfirmationMutation } from "../../../../../../services/guaranteeOrderApi";

export default function FinishUpdateModal({
  refetch,
  order,
  guaranteeOrderId,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [finishConfirmation, { isLoading: isFinishing }] =
    useFinishConfirmationMutation();
  const { data: shipmentData, isLoading: loadingShipment } =
    useGetShipmentsByGuaranteeOrderIdQuery(guaranteeOrderId, { skip: !isOpen });
  const [createShipment, { isLoading: creatingShipment }] =
    useCreateShipmentForServiceOrderMutation();
  const [updateShipmentOrderCode, { isLoading: updatingShipment }] =
    useUpdateGuaranteeOrderShipmentOrderCodeMutation();
  const notify = useNotify();
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  // Shipment processing state
  const [processingShipment, setProcessingShipment] = useState(false);

  // Helper function to extract dimensions
  const extractDimensions = (product) => {
    try {
      if (product.designIdeaVariantDetail?.designIdeaVariantConfig) {
        const config = product.designIdeaVariantDetail.designIdeaVariantConfig;
        const dimensionStr = config[0]?.designVariantValues[0]?.value;

        if (dimensionStr) {
          const dimensions = dimensionStr
            .split("x")
            .map((dim) => parseFloat(dim.trim()));

          if (dimensions.length === 3) {
            return {
              length: dimensions[0] || 20,
              width: dimensions[1] || 20,
              height: dimensions[2] || 20,
            };
          }
        }
      } else if (product.personalProductDetail) {
        const techSpecs = product.personalProductDetail.techSpecList || [];
        return {
          length:
            parseFloat(
              techSpecs.find((item) => item.name === "Chiều dài")?.value
            ) || 20,
          width:
            parseFloat(
              techSpecs.find((item) => item.name === "Chiều rộng")?.value
            ) || 20,
          height:
            parseFloat(
              techSpecs.find((item) => item.name === "Chiều cao")?.value
            ) || 20,
        };
      }
      return { length: 20, width: 20, height: 20 };
    } catch (error) {
      console.error("Error extracting dimensions:", error);
      return { length: 20, width: 20, height: 20 };
    }
  };

  // Process shipment creation for the guarantee order
  const processShipment = async () => {
    if (order?.install) {
      return true; // No need to create a shipment for install orders
    }

    try {
      setProcessingShipment(true);

      if (!shipmentData?.data || shipmentData.data.length < 2) {
        notify("Lỗi", "Không tìm thấy thông tin vận chuyển", "error");
        return false;
      }

      // Using shipment[1] as specified
      const shipment = shipmentData.data[1];
      if (!shipment) {
        notify("Lỗi", "Không tìm thấy thông tin vận chuyển trả hàng", "error");
        return false;
      }

      const product = order?.serviceOrderDetail?.requestedProduct.find(
        (item) =>
          item.requestedProductId == order?.requestedProduct?.requestedProductId
      );

      // Prepare items for GHN API
      const dimensions = extractDimensions(product);
      const items = [
        {
          name:
            product.designIdeaVariantDetail?.name ||
            product.category?.categoryName ||
            "Sản phẩm sửa chữa",
          quantity: 1,
          length: dimensions.length,
          width: dimensions.width,
          height: dimensions.height,
          weight: 0,
        },
      ];

      // Create GHN shipment request
      const requestData = {
        payment_type_id: 1,
        required_note: "WAIT",
        from_name: order?.woodworkerUser?.username || "Xưởng mộc",
        from_phone: order?.woodworkerUser?.phone || "0123456789",
        from_address: shipment.fromAddress,
        from_ward_name: shipment.fromAddress?.split(",")[1]?.trim() || "N/A",
        from_district_name:
          shipment.fromAddress?.split(",")[2]?.trim() || "N/A",
        from_province_name:
          shipment.fromAddress?.split(",")[3]?.trim() || "N/A",
        to_phone: order?.user?.phone || "0123456789",
        to_name: order?.user?.username || "Khách hàng",
        to_address: shipment.toAddress,
        to_ward_code: shipment.toWardCode,
        to_district_id: shipment.toDistrictId,
        weight: 0,
        length: 0,
        width: 0,
        height: 0,
        service_type_id: shipment.ghnServiceTypeId || 5,
        items: items,
      };

      // Call GHN API to create shipment
      const response = await createShipment({
        serviceOrderId: guaranteeOrderId,
        data: requestData,
      }).unwrap();

      // Get order code from response
      const orderCode = response.data.data.order_code;

      // Update shipment with order code
      await updateShipmentOrderCode({
        guaranteeOrderId: guaranteeOrderId,
        orderCode: orderCode,
        type: "Giao",
      }).unwrap();

      notify(
        "Thành công",
        "Đã tạo vận đơn trả hàng thành công với mã: " + orderCode,
        "success"
      );

      return true;
    } catch (error) {
      notify(
        "Lỗi vận chuyển",
        error.data?.message || error.message || "Không thể tạo vận đơn",
        "error"
      );
      return false;
    } finally {
      setProcessingShipment(false);
    }
  };

  const handleSubmit = async () => {
    try {
      if (!order?.install) {
        const shipmentCreated = await processShipment();
        if (!shipmentCreated) return;
      }

      await finishConfirmation({
        guaranteeOrderId: parseInt(guaranteeOrderId),
      }).unwrap();

      notify(
        "Xác nhận hoàn thành",
        "Đơn hàng đã được đánh dấu là hoàn thành",
        "success"
      );

      setIsOpen(false);
      refetch && refetch();
    } catch (error) {
      notify(
        "Lỗi",
        error.data?.message || "Không thể hoàn thành đơn hàng",
        "error"
      );
    }
  };

  const handleClose = () => {
    setIsButtonDisabled(true);
    setIsOpen(false);
  };

  const isProcessing =
    isFinishing ||
    loadingShipment ||
    creatingShipment ||
    updatingShipment ||
    processingShipment;

  const confirmationItems = [
    {
      description:
        "Tôi đã hoàn thành sửa chữa sản phẩm và xác nhận giao lại cho khách hàng",
      isOptional: false,
    },
  ];

  return (
    <>
      <TouchableOpacity style={styles.button} onPress={() => setIsOpen(true)}>
        <Icon
          name="check-circle"
          size={20}
          color={appColorTheme.blue_0}
          style={styles.icon}
        />
        <Text style={styles.buttonText}>Xác nhận hoàn thành và trả hàng</Text>
      </TouchableOpacity>

      <Modal
        visible={isOpen}
        transparent={true}
        animationType="slide"
        onRequestClose={() => !isProcessing && handleClose()}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                Xác nhận hoàn thành sửa chữa
              </Text>
              {!isProcessing && (
                <TouchableOpacity
                  onPress={handleClose}
                  style={styles.closeButton}
                >
                  <Icon name="x" size={20} color="#000" />
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.modalBody}>
              {isProcessing ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator
                    size="large"
                    color={appColorTheme.brown_2}
                    style={styles.spinner}
                  />
                  <Text style={styles.loadingText}>
                    {processingShipment
                      ? "Đang tạo vận đơn trả hàng..."
                      : "Đang xử lý..."}
                  </Text>
                </View>
              ) : (
                <View>
                  <Text style={styles.confirmText}>
                    Bạn đang xác nhận đã hoàn thành sửa chữa sản phẩm này và sẽ
                    gửi lại cho khách hàng.
                  </Text>
                  {!order?.install && (
                    <Text style={styles.shipmentNote}>
                      Hệ thống sẽ tự động tạo vận đơn giao hàng cho khách sau
                      khi bạn xác nhận.
                    </Text>
                  )}
                  <View style={styles.checkboxContainer}>
                    <CheckboxList
                      items={confirmationItems}
                      setButtonDisabled={setIsButtonDisabled}
                    />
                  </View>
                </View>
              )}
            </View>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={[
                  styles.footerButton,
                  styles.confirmBtn,
                  (isButtonDisabled || isProcessing) && styles.disabledButton,
                ]}
                onPress={handleSubmit}
                disabled={isButtonDisabled || isProcessing}
              >
                {isProcessing ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <>
                    <Icon
                      name="check-circle"
                      size={18}
                      color="white"
                      style={styles.buttonIcon}
                    />
                    <Text style={styles.buttonTextLight}>
                      Xác nhận hoàn thành
                    </Text>
                  </>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.footerButton, styles.closeBtn]}
                onPress={handleClose}
                disabled={isProcessing}
              >
                <Icon
                  name="x-circle"
                  size={18}
                  color="#000"
                  style={styles.buttonIcon}
                />
                <Text style={styles.buttonTextDark}>Đóng</Text>
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
    width: "90%",
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
    padding: 16,
  },
  loadingContainer: {
    alignItems: "center",
    paddingVertical: 32,
  },
  spinner: {
    marginBottom: 16,
  },
  loadingText: {
    fontSize: 16,
  },
  confirmText: {
    marginBottom: 16,
  },
  shipmentNote: {
    fontStyle: "italic",
    marginBottom: 16,
    color: "#718096",
  },
  checkboxContainer: {
    marginTop: 16,
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
  confirmBtn: {
    backgroundColor: appColorTheme.green_1 || "#48BB78",
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
