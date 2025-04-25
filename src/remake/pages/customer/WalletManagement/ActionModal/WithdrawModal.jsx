import React, { useState } from "react";
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
import { appColorTheme } from "../../../../config/appconfig";
import { formatPrice } from "../../../../utils/utils";
import Icon from "react-native-vector-icons/Feather";
import { useNotify } from "../../../../components/Utility/Notify";

export default function WithdrawModal({ wallet, onSuccess }) {
  const [isOpen, setIsOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const notify = useNotify();

  const onOpen = () => setIsOpen(true);
  const onClose = () => {
    if (!isLoading) {
      setIsOpen(false);
    }
  };

  const handleAmountChange = (value) => {
    // Remove non-numeric characters
    const numericValue = value.replace(/[^0-9]/g, "");
    setAmount(numericValue);
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      // TODO: Implement withdraw logic
      setTimeout(() => {
        setIsLoading(false);
        onClose();
        notify("Thông báo", "Chức năng rút tiền đang được phát triển", "info");
        if (onSuccess) {
          onSuccess();
        }
      }, 1000);
    } catch (err) {
      setIsLoading(false);
      notify(
        "Rút tiền thất bại",
        err?.data?.message || "Có lỗi xảy ra, vui lòng thử lại sau",
        "error"
      );
    }
  };

  const balance = wallet?.balance || 0;

  return (
    <>
      <TouchableOpacity
        style={styles.withdrawButton}
        onPress={onOpen}
        activeOpacity={0.7}
      >
        <Icon name="minus" size={16} color="white" />
        <Text style={styles.buttonText}>Rút tiền</Text>
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
              <Text style={styles.modalHeaderText}>Rút tiền</Text>
              {!isLoading && (
                <TouchableOpacity onPress={onClose}>
                  <Icon name="x" size={24} color="#333" />
                </TouchableOpacity>
              )}
            </View>

            <ScrollView style={styles.modalBody}>
              <View style={styles.contentContainer}>
                <Text style={styles.balanceText}>
                  Số dư hiện tại: {formatPrice(balance)}
                </Text>

                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>Số tiền rút</Text>
                  <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    placeholder="Nhập số tiền cần rút"
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
                  (!amount ||
                    parseInt(amount) <= 0 ||
                    parseInt(amount) > balance) &&
                    styles.disabledButton,
                ]}
                onPress={handleSubmit}
                disabled={
                  !amount ||
                  parseInt(amount) <= 0 ||
                  parseInt(amount) > balance ||
                  isLoading
                }
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <>
                    <Icon name="minus-square" size={16} color="white" />
                    <Text style={styles.confirmButtonText}>Rút tiền</Text>
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
  withdrawButton: {
    backgroundColor: "#805AD5",
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
  balanceText: {
    fontSize: 16,
    marginBottom: 16,
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
    backgroundColor: "#805AD5",
  },
  confirmButtonText: {
    color: "white",
    fontWeight: "600",
  },
  disabledButton: {
    opacity: 0.5,
  },
});
