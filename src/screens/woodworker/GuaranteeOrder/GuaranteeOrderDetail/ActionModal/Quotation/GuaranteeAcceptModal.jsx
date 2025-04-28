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
import { useAcceptFreeGuaranteeOrderMutation } from "../../../../../../services/guaranteeOrderApi";
import { createAndUpdateShipmentForGuaranteeGetProductFromCustomer } from "../../../../../../utils/shippingUtils.js";

export default function GuaranteeAcceptModal({
  refetch,
  order,
  guaranteeOrderId,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [acceptFreeGuaranteeOrder, { isLoading: isAccepting }] =
    useAcceptFreeGuaranteeOrderMutation();
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

  // Process shipment creation for the guarantee order
  const processShipment = async () => {
    try {
      setProcessingShipment(true);

      const product = order?.serviceOrderDetail?.requestedProduct.find(
        (item) =>
          item.requestedProductId == order?.requestedProduct?.requestedProductId
      );

      // Use the utility function
      const result =
        await createAndUpdateShipmentForGuaranteeGetProductFromCustomer({
          order,
          product,
          shipmentData,
          guaranteeOrderId,
          createShipment,
          updateShipmentOrderCode,
          notify,
        });

      return result.success;
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
      const shipmentCreated = await processShipment();
      if (!shipmentCreated) return;

      await acceptFreeGuaranteeOrder(guaranteeOrderId).unwrap();

      notify(
        "Chấp nhận bảo hành",
        "Yêu cầu bảo hành đã được chấp nhận",
        "success"
      );

      setIsOpen(false);
      refetch && refetch();
    } catch (error) {
      notify(
        "Lỗi",
        error.data?.message || "Không thể chấp nhận yêu cầu bảo hành",
        "error"
      );
    }
  };

  const handleClose = () => {
    setIsButtonDisabled(true);
    setIsOpen(false);
  };

  const isProcessing =
    isAccepting ||
    loadingShipment ||
    creatingShipment ||
    updatingShipment ||
    processingShipment;

  const confirmationItems = [
    {
      description: "Tôi đã kiểm tra thông tin và xác nhận thao tác",
      isOptional: false,
    },
  ];

  return (
    <>
      <TouchableOpacity style={styles.button} onPress={() => setIsOpen(true)}>
        <Icon
          name="check-circle"
          size={20}
          color={appColorTheme.green_1}
          style={styles.icon}
        />
        <Text style={styles.buttonText}>Chấp nhận bảo hành miễn phí</Text>
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
                Xác nhận chấp nhận bảo hành miễn phí
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
                      ? "Đang tạo vận đơn nhận hàng..."
                      : "Đang xử lý..."}
                  </Text>
                </View>
              ) : (
                <View>
                  <Text style={styles.confirmText}>
                    Bạn đang xác nhận chấp nhận bảo hành miễn phí cho sản phẩm
                    này.
                  </Text>

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
                    <Text style={styles.buttonTextLight}>Xác nhận</Text>
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
    borderColor: appColorTheme.green_1,
    backgroundColor: "transparent",
    marginVertical: 8,
  },
  buttonText: {
    color: appColorTheme.green_1,
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
    marginBottom: 24,
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
    backgroundColor: appColorTheme.green_1,
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
