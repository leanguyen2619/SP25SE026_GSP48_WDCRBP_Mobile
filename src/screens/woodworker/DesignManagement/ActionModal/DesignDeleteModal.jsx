import React, { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { appColorTheme } from "../../../../config/appconfig";
import { useDeleteDesignIdeaMutation } from "../../../../services/designIdeaApi";
import { useNotify } from "../../../../components/Utility/Notify";

export default function DesignDeleteModal({ design, refetch }) {
  const [isOpen, setIsOpen] = useState(false);
  const [deleteDesignIdea, { isLoading }] = useDeleteDesignIdeaMutation();
  const [error, setError] = useState(null);
  const notify = useNotify();

  const handleDelete = async () => {
    try {
      setError(null);
      await deleteDesignIdea(design?.designIdeaId).unwrap();
      notify("Xóa thiết kế thành công");
      setIsOpen(false);
      refetch?.();
    } catch (error) {
      console.error("Lỗi khi xóa thiết kế:", error);
      setError(
        error.data?.message || "Không thể xóa thiết kế. Vui lòng thử lại sau."
      );
      notify(
        "Xóa thiết kế thất bại",
        error.data?.message || "Vui lòng thử lại sau",
        "error"
      );
    }
  };

  const openModal = () => setIsOpen(true);
  const closeModal = () => {
    if (!isLoading) {
      setIsOpen(false);
    }
  };

  return (
    <>
      <TouchableOpacity style={styles.iconButton} onPress={openModal}>
        <Ionicons name="trash-outline" size={18} color={appColorTheme.red_0} />
      </TouchableOpacity>

      <Modal
        visible={isOpen}
        transparent={true}
        animationType="fade"
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Xác nhận xóa</Text>
              {!isLoading && (
                <TouchableOpacity
                  onPress={closeModal}
                  style={styles.closeButton}
                >
                  <Ionicons name="close" size={24} color="#000" />
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.modalBody}>
              <Text style={styles.confirmText}>
                Bạn có chắc chắn muốn xóa thiết kế "{design?.name}" không? Hành
                động này không thể hoàn tác.
              </Text>

              {error && (
                <View style={styles.errorContainer}>
                  <Ionicons name="alert-circle" size={20} color="#f44336" />
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              )}

              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={closeModal}
                  disabled={isLoading}
                >
                  <Text style={styles.buttonText}>Hủy</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.button, styles.deleteButton]}
                  onPress={handleDelete}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <ActivityIndicator size="small" color="white" />
                  ) : (
                    <Text style={styles.deleteButtonText}>Xóa</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  iconButton: {
    padding: 8,
    borderWidth: 1,
    borderColor: appColorTheme.red_0,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 8,
    width: "100%",
    maxWidth: 500,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    padding: 15,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  closeButton: {
    padding: 5,
  },
  modalBody: {
    backgroundColor: "#f5f5f5",
    padding: 15,
  },
  confirmText: {
    marginBottom: 15,
    fontSize: 16,
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffebee",
    padding: 10,
    borderRadius: 4,
    marginBottom: 15,
  },
  errorText: {
    color: "#f44336",
    marginLeft: 10,
    flex: 1,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 4,
    minWidth: 80,
    justifyContent: "center",
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#e0e0e0",
    marginRight: 10,
  },
  deleteButton: {
    backgroundColor: appColorTheme.red_0,
  },
  buttonText: {
    fontWeight: "500",
  },
  deleteButtonText: {
    color: "white",
    fontWeight: "500",
  },
});
