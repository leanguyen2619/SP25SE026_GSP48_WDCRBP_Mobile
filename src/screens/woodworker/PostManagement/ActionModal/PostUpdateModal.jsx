import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useState, useEffect } from "react";
import Icon from "react-native-vector-icons/Feather";
import { appColorTheme } from "../../../../config/appconfig";
import ImageUpdateUploader from "../../../../components/Utility/ImageUpdateUploader";
import { useUpdatePostMutation } from "../../../../services/postApi";
import { useNotify } from "../../../../components/Utility/Notify";
import useAuth from "../../../../hooks/useAuth";
import CheckboxList from "../../../../components/Utility/CheckboxList";
import { validatePostData } from "../../../../validations";

export default function PostUpdateModal({ post, refetch }) {
  const [isVisible, setIsVisible] = useState(false);
  const [imgUrls, setImgUrls] = useState(post?.imgUrls || "");
  const [title, setTitle] = useState(post?.title || "");
  const [description, setDescription] = useState(post?.description || "");
  const [buttonDisabled, setButtonDisabled] = useState(true);

  const notify = useNotify();
  const { auth } = useAuth();

  const [updatePost, { isLoading }] = useUpdatePostMutation();

  useEffect(() => {
    if (post) {
      setTitle(post.title || "");
      setDescription(post.description || "");
      setImgUrls(post.imgUrls || "");
    }
  }, [post]);

  const openModal = () => setIsVisible(true);
  const closeModal = () => {
    if (!isLoading) {
      setIsVisible(false);
    }
  };

  const handleSubmit = async () => {
    const data = {
      id: post.postId,
      title: title,
      description: description,
      imgUrls: imgUrls,
      woodworkerId: post.woodworkerId || auth?.wwId || 0,
    };

    // Validate post data
    const errors = validatePostData(data);
    if (errors.length > 0) {
      notify("Lỗi khi cập nhật bài viết", errors.join("\n"), "error", 3000);
      return;
    }

    try {
      await updatePost(data).unwrap();

      notify("Bài viết đã được cập nhật thành công", "", "success", 3000);

      closeModal();
      refetch?.();
    } catch (error) {
      notify(
        "Lỗi khi cập nhật bài viết",
        error.data?.message || "Vui lòng thử lại sau",
        "error",
        3000
      );
    }
  };

  return (
    <>
      <TouchableOpacity style={styles.actionButton} onPress={openModal}>
        <Icon name="edit-2" size={18} color={appColorTheme.blue_0} />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isVisible}
        onRequestClose={closeModal}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.centeredView}
        >
          <View style={styles.modalView}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Chỉnh sửa bài viết</Text>
              {!isLoading && (
                <TouchableOpacity
                  onPress={closeModal}
                  style={styles.closeButton}
                >
                  <Icon name="x" size={24} color="#000" />
                </TouchableOpacity>
              )}
            </View>

            <ScrollView style={styles.modalBody}>
              <View style={styles.formContainer}>
                <View style={styles.formGroup}>
                  <Text style={styles.label}>Mã bài viết</Text>
                  <TextInput
                    style={[styles.input, styles.readonlyInput]}
                    value={post?.postId?.toString()}
                    editable={false}
                  />
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>
                    Tiêu đề <Text style={styles.required}>*</Text>
                  </Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Nhập tiêu đề bài viết"
                    value={title}
                    onChangeText={setTitle}
                  />
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>
                    Mô tả <Text style={styles.required}>*</Text>
                  </Text>
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    placeholder="Nhập mô tả bài viết"
                    value={description}
                    onChangeText={setDescription}
                    multiline
                    numberOfLines={10}
                  />
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>
                    Hình ảnh <Text style={styles.required}>*</Text>
                  </Text>
                  <ImageUpdateUploader
                    maxFiles={4}
                    onUploadComplete={(result) => {
                      setImgUrls(result);
                    }}
                    imgUrls={imgUrls}
                  />
                </View>

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

                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={[styles.button, styles.closeBtn]}
                    onPress={closeModal}
                    disabled={isLoading}
                  >
                    <Icon name="x" size={16} color="#000" />
                    <Text style={styles.buttonText}>Đóng</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.button,
                      styles.updateBtn,
                      (buttonDisabled || isLoading) && styles.disabledButton,
                    ]}
                    onPress={handleSubmit}
                    disabled={buttonDisabled || isLoading}
                  >
                    <Icon name="save" size={16} color="#fff" />
                    <Text style={[styles.buttonText, styles.updateButtonText]}>
                      {isLoading ? "Đang cập nhật..." : "Cập nhật"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  actionButton: {
    padding: 8,
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: appColorTheme.blue_0,
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
    width: "95%",
    maxHeight: "90%",
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
    backgroundColor: "#f5f5f5",
  },
  formContainer: {
    padding: 15,
  },
  formGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: "500",
  },
  required: {
    color: "red",
  },
  input: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
  readonlyInput: {
    backgroundColor: "#f0f0f0",
    color: "#666",
  },
  textArea: {
    minHeight: 150,
    textAlignVertical: "top",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 15,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 5,
    marginLeft: 10,
  },
  closeBtn: {
    backgroundColor: "#f0f0f0",
  },
  updateBtn: {
    backgroundColor: appColorTheme.blue_0,
  },
  disabledButton: {
    backgroundColor: "#cccccc",
    opacity: 0.7,
  },
  buttonText: {
    marginLeft: 5,
    fontSize: 16,
  },
  updateButtonText: {
    color: "#fff",
  },
});
