import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  ActivityIndicator,
  Linking,
} from "react-native";
import { useNotify } from "../../../../../../components/Utility/Notify";
import Icon from "react-native-vector-icons/Feather";
import CheckboxList from "../../../../../../components/Utility/CheckboxList";
import {
  appColorTheme,
  transactionTypeConstants,
} from "../../../../../../config/appconfig";
import { formatPrice } from "../../../../../../utils/utils";
import useAuth from "../../../../../../hooks/useAuth";
import { useOrderPaymentMutation } from "../../../../../../services/walletApi";
import { useCreatePaymentMutation } from "../../../../../../services/paymentApi";
import { useNavigation } from "@react-navigation/native";

export default function PaymentModal({ deposit, order, refetch, buttonText }) {
  const [isOpen, setIsOpen] = useState(false);
  const notify = useNotify();
  const { auth } = useAuth();
  const navigation = useNavigation();
  const [orderPayment, { isLoading: isWalletLoading }] =
    useOrderPaymentMutation();
  const [createPayment, { isLoading: isGatewayLoading }] =
    useCreatePaymentMutation();
  const [isCheckboxDisabled, setIsCheckboxDisabled] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState("wallet"); // wallet or gateway

  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);

  const isLoading = isWalletLoading || isGatewayLoading;

  const checkboxItems = [
    {
      description: "Tôi đã kiểm tra thông tin và xác nhận thao tác",
      isOptional: false,
    },
  ];

  const handleSubmit = async () => {
    try {
      const postData = {
        userId: auth.userId,
        orderDepositId: deposit?.orderDepositId,
        transactionType: "",
        email: auth.sub,
        returnUrl: "woodworkcrafts://payment-success",
      };

      if (paymentMethod === "wallet") {
        // Using wallet for payment
        postData.transactionType = transactionTypeConstants.THANH_TOAN_BANG_VI;
        await orderPayment(postData).unwrap();

        navigation.navigate("Success", {
          title: "Thanh toán thành công",
          desc: "Bạn đã thanh toán cho đơn hàng thành công",
          path: `/cus/service-order/${order.orderId}`,
          buttonText: "Xem đơn hàng",
        });

        onClose();
        refetch(); // Refresh data
      } else {
        postData.transactionType = transactionTypeConstants.THANH_TOAN_QUA_CONG;
        const response = await createPayment(postData).unwrap();
        const paymentUrl = response.url || response.data.url;

        onClose();

        if (paymentUrl) {
          await Linking.openURL(paymentUrl);
        } else {
          notify(
            "Thanh toán thất bại",
            "Không nhận được URL thanh toán",
            "error"
          );
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
        onPress={onOpen}
        activeOpacity={0.7}
      >
        <Icon name="credit-card" size={16} color="white" />
        <Text style={styles.buttonText}>
          {buttonText ? buttonText : `Thanh toán lần #${deposit.depositNumber}`}
        </Text>
      </TouchableOpacity>

      <Modal
        visible={isOpen}
        animationType="slide"
        transparent={true}
        onRequestClose={isLoading ? null : onClose}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalHeaderText}>Thanh toán đặt cọc</Text>
              {!isLoading && (
                <TouchableOpacity onPress={onClose}>
                  <Icon name="x" size={24} color="#333" />
                </TouchableOpacity>
              )}
            </View>

            <ScrollView style={styles.modalBody}>
              <View style={styles.contentContainer}>
                <Text style={styles.sectionTitle}>Chi tiết đặt cọc</Text>

                <View style={styles.infoContainer}>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Mã đơn dịch vụ:</Text>
                    <Text style={styles.infoValue}>#{order.orderId}</Text>
                  </View>

                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Đặt cọc lần:</Text>
                    <Text style={styles.infoValue}>
                      {deposit.depositNumber}
                    </Text>
                  </View>

                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Phần trăm:</Text>
                    <Text style={styles.infoValue}>{deposit.percent}%</Text>
                  </View>

                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Số tiền:</Text>
                    <Text style={styles.infoTotal}>
                      {formatPrice(deposit.amount)}
                    </Text>
                  </View>
                </View>

                <View style={styles.paymentMethodSection}>
                  <Text style={styles.sectionTitle}>
                    Chọn phương thức thanh toán:
                  </Text>
                  <View style={styles.radioGroup}>
                    <TouchableOpacity
                      style={styles.radioOption}
                      onPress={() => setPaymentMethod("wallet")}
                    >
                      <View style={styles.radioButton}>
                        {paymentMethod === "wallet" && (
                          <View style={styles.radioButtonSelected} />
                        )}
                      </View>
                      <Text style={styles.radioLabel}>Thanh toán bằng ví</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.radioOption}
                      onPress={() => setPaymentMethod("gateway")}
                    >
                      <View style={styles.radioButton}>
                        {paymentMethod === "gateway" && (
                          <View style={styles.radioButtonSelected} />
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
                  isCheckboxDisabled && styles.disabledButton,
                ]}
                onPress={handleSubmit}
                disabled={isCheckboxDisabled || isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <>
                    <Icon name="check" size={16} color="white" />
                    <Text style={styles.confirmButtonText}>Thanh toán</Text>
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
    backgroundColor: "#3182CE",
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
    height: "80%",
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 8,
  },
  infoContainer: {
    padding: 16,
    backgroundColor: "#F9FAFB",
    borderRadius: 8,
    gap: 12,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  infoLabel: {
    fontWeight: "600",
    fontSize: 14,
    flex: 1,
  },
  infoValue: {
    fontSize: 14,
    flex: 1,
    textAlign: "right",
  },
  infoTotal: {
    fontSize: 14,
    fontWeight: "700",
    color: appColorTheme.brown_2,
    flex: 1,
    textAlign: "right",
  },
  paymentMethodSection: {
    marginTop: 8,
    padding: 8,
  },
  radioGroup: {
    marginTop: 8,
    gap: 12,
  },
  radioOption: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 8,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#3182CE",
    alignItems: "center",
    justifyContent: "center",
  },
  radioButtonSelected: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#3182CE",
  },
  radioLabel: {
    fontSize: 14,
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
    backgroundColor: "#3182CE",
  },
  confirmButtonText: {
    color: "white",
    fontWeight: "600",
  },
  disabledButton: {
    opacity: 0.5,
  },
});
