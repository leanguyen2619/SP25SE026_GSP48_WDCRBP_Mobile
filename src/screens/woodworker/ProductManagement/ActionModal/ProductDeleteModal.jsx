import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { appColorTheme } from "../../../../config/appconfig";
import { useDeleteProductMutation } from "../../../../services/productApi";
import { useNotify } from "../../../../components/Utility/Notify";
import CheckboxList from "../../../../components/Utility/CheckboxList";

export default function ProductDeleteModal({ product, refetch }) {
  const [isOpen, setIsOpen] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const notify = useNotify();

  // Mutation hook for deleting products
  const [deleteProduct, { isLoading }] = useDeleteProductMutation();

  const handleDelete = async () => {
    try {
      await deleteProduct(product.productId).unwrap();

      notify("Thành công", "Sản phẩm đã được xóa thành công", "success");
      setIsOpen(false);
      refetch?.();
    } catch (error) {
      console.error("Error deleting product:", error);
      notify(
        "Lỗi",
        error.data?.message || "Không thể xóa sản phẩm. Vui lòng thử lại sau.",
        "error"
      );
    }
  };

  return (
    <>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => setIsOpen(true)}
      >
        <Feather name="trash-2" size={16} color={appColorTheme.red_0} />
      </TouchableOpacity>

      <Modal
        visible={isOpen}
        transparent={true}
        animationType="fade"
        onRequestClose={() => !isLoading && setIsOpen(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalHeaderText}>Xác nhận xóa sản phẩm</Text>
              {!isLoading && (
                <TouchableOpacity onPress={() => setIsOpen(false)}>
                  <Text style={styles.closeButton}>X</Text>
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.modalBody}>
              <Text style={styles.warningText}>
                Bạn có chắc chắn muốn xóa sản phẩm "{product?.productName}"?
              </Text>
              <Text style={styles.subWarningText}>
                Hành động này không thể hoàn tác.
              </Text>

              <View style={styles.checkboxContainer}>
                <CheckboxList
                  items={[
                    {
                      isOptional: false,
                      description:
                        "Tôi đã kiểm tra thông tin và xác nhận thao tác",
                    },
                  ]}
                  setButtonDisabled={setButtonDisabled}
                />
              </View>
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setIsOpen(false)}
                disabled={isLoading}
              >
                <Feather name="x" size={16} color="#333" />
                <Text style={styles.cancelButtonText}>Đóng</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.deleteActionButton,
                  (buttonDisabled || isLoading) && styles.disabledButton,
                ]}
                onPress={handleDelete}
                disabled={buttonDisabled || isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <>
                    <Feather name="trash-2" size={16} color="white" />
                    <Text style={styles.deleteButtonText}>Xóa</Text>
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
  deleteButton: {
    padding: 8,
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: appColorTheme.red_0,
    borderRadius: 4,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    width: "90%",
    backgroundColor: "white",
    borderRadius: 10,
    overflow: "hidden",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
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
  closeButton: {
    fontSize: 18,
    fontWeight: "bold",
  },
  modalBody: {
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  warningText: {
    fontSize: 16,
    marginBottom: 8,
  },
  subWarningText: {
    fontSize: 14,
    marginBottom: 16,
    color: "#555",
  },
  checkboxContainer: {
    marginTop: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    padding: 16,
    backgroundColor: "#f5f5f5",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    gap: 12,
  },
  cancelButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "white",
    gap: 8,
  },
  cancelButtonText: {
    color: "#333",
  },
  deleteActionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    backgroundColor: appColorTheme.red_0,
    gap: 8,
  },
  deleteButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  disabledButton: {
    opacity: 0.6,
  },
});
