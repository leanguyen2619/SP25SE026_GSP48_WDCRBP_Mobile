import { useState } from "react";
import { useNotify } from "../../../../../../components/Utility/Notify";
import { Feather } from "@expo/vector-icons";
import CheckboxList from "../../../../../../components/Utility/CheckboxList";
import {
  appColorTheme,
  guaranteeOrderStatusConstants,
  transactionTypeConstants,
} from "../../../../../../config/appconfig";
import { formatPrice } from "../../../../../../utils/utils";
import useAuth from "../../../../../../hooks/useAuth";
import { useOrderPaymentMutation } from "../../../../../../services/walletApi";
import { useCreatePaymentMutation } from "../../../../../../services/paymentApi";
import { useNavigation } from "@react-navigation/native";
import {
  useGetShipmentsByGuaranteeOrderIdQuery,
  useUpdateGuaranteeOrderShipmentOrderCodeMutation,
} from "../../../../../../services/shipmentApi";
import { useCreateShipmentForServiceOrderMutation } from "../../../../../../services/ghnApi";
import { createAndUpdateShipmentForGuaranteeGetProductFromCustomer } from "../../../../../../utils/shippingUtils";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  ScrollView,
  Linking,
} from "react-native";

export default function PaymentModal({ deposit, order, refetch, buttonText }) {
  const [isModalVisible, setModalVisible] = useState(false);
  const notify = useNotify();
  const { auth } = useAuth();
  const navigation = useNavigation();
  const [orderPayment, { isLoading: isWalletLoading }] =
    useOrderPaymentMutation();
  const [createPayment, { isLoading: isGatewayLoading }] =
    useCreatePaymentMutation();
  const [isCheckboxDisabled, setIsCheckboxDisabled] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState("wallet");
  const [processingShipment, setProcessingShipment] = useState(false);

  const { data: shipmentData, isLoading: loadingShipment } =
    useGetShipmentsByGuaranteeOrderIdQuery(order?.guaranteeOrderId, {
      skip: !isModalVisible,
    });
  const [createShipment, { isLoading: creatingShipment }] =
    useCreateShipmentForServiceOrderMutation();
  const [updateShipmentOrderCode, { isLoading: updatingShipment }] =
    useUpdateGuaranteeOrderShipmentOrderCodeMutation();

  const isLoading =
    isWalletLoading ||
    isGatewayLoading ||
    loadingShipment ||
    creatingShipment ||
    updatingShipment ||
    processingShipment;

  const checkboxItems = [
    {
      description: "Tôi đã kiểm tra thông tin và xác nhận thao tác",
      isOptional: false,
    },
  ];

  const processShipment = async () => {
    if (
      order?.status !== guaranteeOrderStatusConstants.DA_DUYET_BAO_GIA ||
      !shipmentData?.data?.length
    ) {
      return true;
    }

    try {
      setProcessingShipment(true);

      const product = order?.serviceOrderDetail?.requestedProduct.find(
        (item) =>
          item.requestedProductId == order?.requestedProduct?.requestedProductId
      );

      const result =
        await createAndUpdateShipmentForGuaranteeGetProductFromCustomer({
          order,
          product,
          shipmentData,
          guaranteeOrderId: order.guaranteeOrderId,
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
      if (order?.status === "Đã duyệt báo giá") {
        const shipmentCreated = await processShipment();
        if (!shipmentCreated) return;
      }

      const postData = {
        userId: auth.userId,
        orderDepositId: deposit?.orderDepositId,
        transactionType: "",
        email: auth.sub,
        returnUrl: `payment-success`,
      };

      if (paymentMethod === "wallet") {
        postData.transactionType = transactionTypeConstants.THANH_TOAN_BANG_VI;
        await orderPayment(postData).unwrap();

        navigation.navigate("Success", {
          title: "Thanh toán thành công",
          desc: "Bạn đã thanh toán cho đơn hàng thành công",
          path: `/cus/guarantee-order/${order.guaranteeOrderId}`,
          buttonText: "Xem đơn hàng",
        });

        setModalVisible(false);
        refetch();
      } else {
        postData.transactionType = transactionTypeConstants.THANH_TOAN_QUA_CONG;
        const response = await createPayment(postData).unwrap();

        setModalVisible(false);
        if (response.url || response.data?.url) {
          Linking.openURL(response.url || response.data.url);
        }
      }
    } catch (err) {
      notify(
        "Thanh toán thất bại",
        err?.data?.message || "Có lỗi xảy ra, vui lòng thử lại sau",
        "error"
      );
    }
  };

  return (
    <>
      <TouchableOpacity
        style={styles.button}
        onPress={() => setModalVisible(true)}
      >
        <Feather name="credit-card" size={18} style={styles.buttonIcon} />
        <Text style={styles.buttonText}>
          {buttonText ? buttonText : `Thanh toán lần #${deposit.depositNumber}`}
        </Text>
      </TouchableOpacity>

      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => !isLoading && setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Thanh toán đặt cọc</Text>
            {!isLoading && (
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Feather name="x-circle" size={20} style={styles.closeIcon} />
              </TouchableOpacity>
            )}

            <ScrollView style={styles.modalBody}>
              {processingShipment ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator
                    size="large"
                    color={appColorTheme.brown_2}
                  />
                  <Text style={styles.loadingText}>Đang xử lý vận đơn...</Text>
                </View>
              ) : (
                <View style={styles.contentContainer}>
                  <Text style={styles.sectionTitle}>Chi tiết đặt cọc</Text>

                  <View style={styles.detailsCard}>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Mã đơn dịch vụ:</Text>
                      <Text style={styles.detailValue}>
                        #{order.guaranteeOrderId}
                      </Text>
                    </View>

                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Đặt cọc lần:</Text>
                      <Text style={styles.detailValue}>
                        {deposit.depositNumber}
                      </Text>
                    </View>

                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Phần trăm:</Text>
                      <Text style={styles.detailValue}>{deposit.percent}%</Text>
                    </View>

                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Số tiền:</Text>
                      <Text style={[styles.detailValue, styles.amountText]}>
                        {formatPrice(deposit.amount)}
                      </Text>
                    </View>

                    {order?.status ==
                      guaranteeOrderStatusConstants.DA_DUYET_BAO_GIA && (
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Lưu ý:</Text>
                        <Text style={[styles.detailValue, styles.noteText]}>
                          Vận đơn GHN sẽ được tạo khi bạn thanh toán
                        </Text>
                      </View>
                    )}
                  </View>

                  <View style={styles.paymentMethodContainer}>
                    <Text style={styles.sectionTitle}>
                      Chọn phương thức thanh toán:
                    </Text>
                    <View style={styles.radioGroup}>
                      <TouchableOpacity
                        style={[
                          styles.radioButton,
                          paymentMethod === "wallet" &&
                            styles.radioButtonSelected,
                        ]}
                        onPress={() => setPaymentMethod("wallet")}
                      >
                        <View style={styles.radioCircle}>
                          {paymentMethod === "wallet" && (
                            <View style={styles.radioInner} />
                          )}
                        </View>
                        <Text style={styles.radioLabel}>
                          Thanh toán bằng ví
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[
                          styles.radioButton,
                          paymentMethod === "gateway" &&
                            styles.radioButtonSelected,
                        ]}
                        onPress={() => setPaymentMethod("gateway")}
                      >
                        <View style={styles.radioCircle}>
                          {paymentMethod === "gateway" && (
                            <View style={styles.radioInner} />
                          )}
                        </View>
                        <Text style={styles.radioLabel}>
                          Thanh toán qua cổng thanh toán
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View style={styles.divider} />
                  <CheckboxList
                    items={checkboxItems}
                    setButtonDisabled={setIsCheckboxDisabled}
                  />
                </View>
              )}
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={[styles.footerButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
                disabled={isLoading}
              >
                <Feather name="x-circle" size={18} style={styles.buttonIcon} />
                <Text style={styles.buttonText}>Đóng</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.footerButton, styles.confirmButton]}
                onPress={handleSubmit}
                disabled={isLoading || isCheckboxDisabled}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Feather name="check" size={18} style={styles.buttonIcon} />
                )}
                <Text style={[styles.buttonText, styles.confirmButtonText]}>
                  Thanh toán
                </Text>
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
    backgroundColor: "#3182CE",
    padding: 8,
    borderRadius: 4,
  },
  buttonIcon: {
    color: "white",
    marginRight: 8,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 10,
    width: "90%",
    maxWidth: 500,
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    padding: 16,
    textAlign: "center",
  },
  closeButton: {
    position: "absolute",
    top: 16,
    right: 16,
  },
  closeIcon: {
    fontSize: 20,
    color: "#666",
  },
  modalBody: {
    flex: 1,
  },
  loadingContainer: {
    padding: 20,
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  contentContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 16,
  },
  detailsCard: {
    backgroundColor: "#F7FAFC",
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: "row",
    marginBottom: 8,
  },
  detailLabel: {
    fontWeight: "600",
    width: 120,
  },
  detailValue: {
    flex: 1,
  },
  amountText: {
    fontWeight: "bold",
    color: appColorTheme.brown_2,
  },
  noteText: {
    color: "#3182CE",
  },
  paymentMethodContainer: {
    padding: 16,
  },
  radioGroup: {
    marginTop: 8,
  },
  radioButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  radioButtonSelected: {
    backgroundColor: "#EBF8FF",
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#3182CE",
    marginRight: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#3182CE",
  },
  radioLabel: {
    fontSize: 16,
  },
  divider: {
    height: 1,
    backgroundColor: "#E2E8F0",
    marginVertical: 16,
  },
  modalFooter: {
    flexDirection: "row",
    justifyContent: "flex-end",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
  },
  footerButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    borderRadius: 4,
    marginLeft: 8,
  },
  cancelButton: {
    backgroundColor: "#EDF2F7",
  },
  confirmButton: {
    backgroundColor: "#3182CE",
  },
  confirmButtonText: {
    color: "white",
  },
});
