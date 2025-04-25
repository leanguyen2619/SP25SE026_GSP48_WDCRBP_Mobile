import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  TextInput,
  ActivityIndicator,
} from "react-native";
import * as Linking from "expo-linking";
import { appColorTheme } from "../../../../config/appconfig";
import { useTopUpWalletMutation } from "../../../../services/paymentApi";
import { useNotify } from "../../../../components/Utility/Notify";
import useAuth from "../../../../hooks/useAuth";
import { formatPrice } from "../../../../utils/utils";
import Icon from "react-native-vector-icons/Feather";
import CheckboxList from "../../../../components/Utility/CheckboxList";

export default function DepositModal({ wallet, onSuccess }) {
  const [isOpen, setIsOpen] = useState(false);
  const notify = useNotify();
  const { auth } = useAuth();
  const [topUpWallet, { isLoading }] = useTopUpWalletMutation();
  const [amount, setAmount] = useState("");
  const [isCheckboxDisabled, setIsCheckboxDisabled] = useState(true);

  const onOpen = () => setIsOpen(true);
  const onClose = () => {
    if (!isLoading) {
      setIsOpen(false);
    }
  };

  const checkboxItems = [
    {
      description: "Tôi đã kiểm tra thông tin và xác nhận thao tác",
      isOptional: false,
    },
  ];

  const handleAmountChange = (value) => {
    // Remove non-numeric characters
    const numericValue = value.replace(/[^0-9]/g, "");
    setAmount(numericValue);
  };

  const handleSubmit = async () => {
    try {
      const returnUrl = Linking.createURL("payment-success");

      const postData = {
        userId: wallet.userId,
        walletId: wallet.walletId,
        transactionType: "Nạp ví",
        amount: parseInt(amount),
        email: auth.sub,
        returnUrl: returnUrl,
      };

      const res = await topUpWallet(postData).unwrap();

      onClose();

      if (res.data?.url) {
        await Linking.openURL(res.data.url);
      } else {
        notify("Nạp tiền thất bại", "Không nhận được URL thanh toán", "error");
      }

      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      notify(
        "Nạp tiền thất bại",
        err?.data?.message || "Có lỗi xảy ra, vui lòng thử lại sau",
        "error"
      );
    }
  };

  return (
    <>
      <TouchableOpacity
        style={styles.depositButton}
        onPress={onOpen}
        activeOpacity={0.7}
      >
        <Icon name="plus" size={16} color="white" />
        <Text style={styles.buttonText}>Nạp tiền</Text>
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
              <Text style={styles.modalHeaderText}>Nạp tiền</Text>
              {!isLoading && (
                <TouchableOpacity onPress={onClose}>
                  <Icon name="x" size={24} color="#333" />
                </TouchableOpacity>
              )}
            </View>

            <ScrollView style={styles.modalBody}>
              <View style={styles.contentContainer}>
                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>Số tiền nạp</Text>
                  <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    placeholder="Nhập số tiền cần nạp"
                    value={amount}
                    onChangeText={handleAmountChange}
                  />
                </View>

                {amount && (
                  <View style={styles.amountDisplay}>
                    <Text style={styles.amountText}>
                      {formatPrice(parseInt(amount) || 0)}
                    </Text>
                  </View>
                )}

                {amount && parseInt(amount) > 0 && (
                  <>
                    <View style={styles.divider} />
                    <CheckboxList
                      items={checkboxItems}
                      setButtonDisabled={setIsCheckboxDisabled}
                    />
                  </>
                )}
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
                  (!amount || parseInt(amount) <= 0 || isCheckboxDisabled) &&
                    styles.disabledButton,
                ]}
                onPress={handleSubmit}
                disabled={
                  !amount ||
                  parseInt(amount) <= 0 ||
                  isCheckboxDisabled ||
                  isLoading
                }
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <>
                    <Icon name="plus-square" size={16} color="white" />
                    <Text style={styles.confirmButtonText}>Nạp tiền</Text>
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
  depositButton: {
    backgroundColor: "#38A169",
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
    height: "70%",
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
  formGroup: {
    marginBottom: 16,
  },
  formLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  amountDisplay: {
    alignItems: "flex-end",
    marginTop: 8,
  },
  amountText: {
    fontSize: 20,
    fontWeight: "bold",
    color: appColorTheme.brown_2,
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
    backgroundColor: "#38A169",
  },
  confirmButtonText: {
    color: "white",
    fontWeight: "600",
  },
  disabledButton: {
    opacity: 0.5,
  },
});
