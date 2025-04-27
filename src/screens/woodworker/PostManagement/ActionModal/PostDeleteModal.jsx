import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useState } from "react";
import Icon from "react-native-vector-icons/Feather";
import { appColorTheme } from "../../../../config/appconfig";
import { useDeletePostMutation } from "../../../../services/postApi";
import { useNotify } from "../../../../components/Utility/Notify";
import CheckboxList from "../../../../components/Utility/CheckboxList";

export default function PostDeleteModal({ post, refetch }) {
  const [isVisible, setIsVisible] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const notify = useNotify();

  const [deletePost, { isLoading }] = useDeletePostMutation();

  const openModal = () => setIsVisible(true);
  const closeModal = () => {
    if (!isLoading) {
      setIsVisible(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deletePost(post.postId).unwrap();

      notify("Bài viết đã được xóa thành công", "", "success", 3000);

      closeModal();
      refetch?.();
    } catch (error) {
      notify(
        "Lỗi khi xóa bài viết",
        error.data?.message || "Vui lòng thử lại sau",
        "error",
        3000
      );
    }
  };

  return (
    <>
      <TouchableOpacity style={styles.actionButton} onPress={openModal}>
        <Icon name="trash-2" size={18} color={appColorTheme.red_0} />
      </TouchableOpacity>

      <Modal
        animationType="fade"
        transparent={true}
        visible={isVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Xác nhận xóa bài viết</Text>
              {!isLoading && (
                <TouchableOpacity
                  onPress={closeModal}
                  style={styles.closeButton}
                >
                  <Icon name="x" size={24} color="#000" />
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.modalBody}>
              <Text style={styles.modalText}>
                Bạn có chắc chắn muốn xóa bài viết "{post?.title}"?
              </Text>
              <Text style={styles.modalSubText}>
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

            <View style={styles.footer}>
              <TouchableOpacity
                style={[styles.button, styles.buttonClose]}
                onPress={closeModal}
                disabled={isLoading}
              >
                <Icon name="x" size={16} color="#000" />
                <Text style={styles.buttonText}>Đóng</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.button,
                  styles.buttonDelete,
                  (buttonDisabled || isLoading) && styles.disabledButton,
                ]}
                onPress={handleDelete}
                disabled={buttonDisabled || isLoading}
              >
                <Icon name="trash-2" size={16} color="#fff" />
                <Text style={[styles.buttonText, styles.deleteButtonText]}>
                  {isLoading ? "Đang xóa..." : "Xóa"}
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
  actionButton: {
    padding: 8,
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: appColorTheme.red_0,
    borderRadius: 4,
    marginHorizontal: 4,
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
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  closeButton: {
    padding: 5,
  },
  modalBody: {
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  modalText: {
    fontSize: 16,
    marginBottom: 8,
  },
  modalSubText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 15,
  },
  checkboxContainer: {
    marginTop: 15,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    padding: 15,
    backgroundColor: "#f5f5f5",
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 5,
    marginLeft: 10,
    minWidth: 100,
    justifyContent: "center",
  },
  buttonClose: {
    backgroundColor: "#f0f0f0",
  },
  buttonDelete: {
    backgroundColor: appColorTheme.red_0,
  },
  disabledButton: {
    backgroundColor: "#cccccc",
    opacity: 0.7,
  },
  buttonText: {
    marginLeft: 5,
    fontSize: 16,
  },
  deleteButtonText: {
    color: "#fff",
  },
});
