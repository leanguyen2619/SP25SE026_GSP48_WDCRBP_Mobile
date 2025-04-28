import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useNotify } from "../../../../../../components/Utility/Notify";
import CheckboxList from "../../../../../../components/Utility/CheckboxList";
import { useConfirmReceiveProductMutation } from "../../../../../../services/guaranteeOrderApi";
import Icon from "react-native-vector-icons/Feather";
import { appColorTheme } from "../../../../../../config/appconfig";

export default function ReceiveConfirmationModal({
  guaranteeOrderId,
  refetch,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const notify = useNotify();
  const [confirmReceiveProduct, { isLoading }] =
    useConfirmReceiveProductMutation();
  const [isCheckboxDisabled, setIsCheckboxDisabled] = useState(true);

  const checkboxItems = [
    {
      description: "Tôi đã kiểm tra thông tin và xác nhận thao tác",
      isOptional: false,
    },
  ];

  const handleSubmit = async () => {
    try {
      await confirmReceiveProduct({
        guaranteeOrderId: parseInt(guaranteeOrderId),
      }).unwrap();

      notify(
        "Xác nhận thành công",
        "Đã xác nhận nhận sản phẩm thành công",
        "success"
      );

      setIsOpen(false);
      refetch(); // Refresh data
    } catch (err) {
      notify(
        "Xác nhận thất bại",
        err?.data?.message || "Có lỗi xảy ra, vui lòng thử lại sau",
        "error"
      );
    }
  };

  return (
    <>
      <TouchableOpacity style={styles.button} onPress={() => setIsOpen(true)}>
        <Icon name="box" size={20} color="white" style={styles.icon} />
        <Text style={styles.buttonText}>Xác nhận nhận sản phẩm</Text>
      </TouchableOpacity>

      <Modal
        visible={isOpen}
        transparent={true}
        animationType="slide"
        onRequestClose={() => !isLoading && setIsOpen(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Xác nhận nhận sản phẩm</Text>
              {!isLoading && (
                <TouchableOpacity
                  onPress={() => setIsOpen(false)}
                  style={styles.closeButton}
                >
                  <Icon name="x" size={20} color="#000" />
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.modalBody}>
              <CheckboxList
                items={checkboxItems}
                setButtonDisabled={setIsCheckboxDisabled}
              />
            </View>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={[styles.footerButton, styles.closeBtn]}
                onPress={() => setIsOpen(false)}
                disabled={isLoading}
              >
                <Icon
                  name="x-circle"
                  size={18}
                  color="#000"
                  style={styles.buttonIcon}
                />
                <Text style={styles.buttonTextDark}>Đóng</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.footerButton,
                  styles.confirmBtn,
                  (isCheckboxDisabled || isLoading) && styles.disabledButton,
                ]}
                onPress={handleSubmit}
                disabled={isCheckboxDisabled || isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <>
                    <Icon
                      name="check"
                      size={18}
                      color="white"
                      style={styles.buttonIcon}
                    />
                    <Text style={styles.buttonTextLight}>
                      Xác nhận nhận sản phẩm
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
    backgroundColor: appColorTheme.green_1 || "#48BB78",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    marginVertical: 8,
  },
  buttonText: {
    color: "white",
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
  closeBtn: {
    backgroundColor: "#E2E8F0",
  },
  confirmBtn: {
    backgroundColor: appColorTheme.green_1 || "#48BB78",
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
