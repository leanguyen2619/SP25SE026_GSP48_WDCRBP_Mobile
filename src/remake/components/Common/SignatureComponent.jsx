import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
  Dimensions,
  SafeAreaView,
} from "react-native";
import SignatureScreen from "react-native-signature-canvas";
import { Feather } from "@expo/vector-icons";

export default function SignatureComponent({
  initialSignature,
  onSaveSignature,
  savedSignature,
  isEditable = true,
  title = "Chữ ký",
}) {
  const screenWidth = Dimensions.get("window").width;
  const canvasWidth = screenWidth - 40;
  const canvasHeight = 250;

  const [modalVisible, setModalVisible] = useState(false);
  const signatureRef = useRef(null);

  // Xử lý sự kiện lưu chữ ký
  const handleSaveSignature = (signature) => {
    if (signature) {
      try {
        const base64Data = signature.replace(/^data:image\/\w+;base64,/, "");
        onSaveSignature(base64Data, signature);
        setModalVisible(false); // Đóng modal sau khi lưu
      } catch (err) {
        console.error("Lỗi khi xử lý chữ ký:", err);
      }
    }
  };

  // Xử lý sự kiện xóa chữ ký
  const clearSignature = () => {
    if (signatureRef.current) {
      signatureRef.current.clearSignature();
    }
  };

  // Mở modal để ký
  const openSignatureModal = () => {
    setModalVisible(true);
  };

  // Đóng modal và hủy
  const cancelSignature = () => {
    setModalVisible(false);
  };

  // Web style cho thư viện signature canvas
  const style = `.m-signature-pad {
    box-shadow: none; 
    border: 2px solid black;
    border-radius: 8px;
  }
  .m-signature-pad--body { border: none; }
  .m-signature-pad--footer { display: none; }
  body,html { height: ${canvasHeight}px; width: ${canvasWidth}px; }`;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {title} {savedSignature && <Text style={styles.badge}>Đã lưu</Text>}
        </Text>
      </View>

      {/* Hiển thị nút hoặc hình ảnh chữ ký đã lưu */}
      {isEditable ? (
        <View style={styles.signButtonContainer}>
          {savedSignature ? (
            <View style={styles.savedSignatureContainer}>
              <TouchableOpacity
                style={styles.reSignButton}
                onPress={openSignatureModal}
              >
                <Text style={styles.reSignButtonText}>Ký lại</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.signButton}
              onPress={openSignatureModal}
            >
              <Feather name="edit-2" size={20} color="#3182CE" />
              <Text style={styles.signButtonText}>Nhấn để ký tên</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : initialSignature ? (
        <Image
          source={{ uri: initialSignature }}
          style={styles.signatureImage}
          resizeMode="contain"
        />
      ) : (
        <Text style={styles.placeholderText}>Chưa có chữ ký</Text>
      )}

      {/* Modal chứa canvas ký tên */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={cancelSignature}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Ký tên</Text>
              <TouchableOpacity onPress={cancelSignature}>
                <Feather name="x" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <Text style={styles.instruction}>
                Vui lòng ký tên vào khu vực bên dưới
              </Text>

              <View
                style={[
                  styles.signatureContainer,
                  { width: canvasWidth, height: canvasHeight },
                ]}
              >
                <SignatureScreen
                  ref={signatureRef}
                  onOK={handleSaveSignature}
                  onEmpty={() => console.log("Chữ ký trống")}
                  webStyle={style}
                />
              </View>

              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={[styles.actionButton, styles.clearButton]}
                  onPress={clearSignature}
                >
                  <Feather name="trash-2" size={16} color="white" />
                  <Text style={styles.buttonText}>Xóa</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.actionButton, styles.cancelButton]}
                  onPress={cancelSignature}
                >
                  <Feather name="x-circle" size={16} color="white" />
                  <Text style={styles.buttonText}>Hủy</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.actionButton, styles.saveButton]}
                  onPress={() => signatureRef.current?.readSignature()}
                >
                  <Feather name="save" size={16} color="white" />
                  <Text style={styles.buttonText}>Lưu</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </SafeAreaView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  header: {
    marginBottom: 12,
  },
  title: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 8,
  },
  badge: {
    backgroundColor: "green",
    color: "white",
    fontSize: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginLeft: 8,
  },
  signButtonContainer: {
    marginVertical: 10,
  },
  signButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#3182CE",
    borderRadius: 8,
    paddingVertical: 15,
    backgroundColor: "#EBF8FF",
    gap: 8,
  },
  signButtonText: {
    color: "#3182CE",
    fontWeight: "600",
    fontSize: 16,
  },
  savedSignatureContainer: {
    alignItems: "center",
  },
  previewImage: {
    width: "100%",
    height: 150,
    marginBottom: 10,
  },
  reSignButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#3182CE",
    borderRadius: 8,
  },
  reSignButtonText: {
    color: "white",
    fontWeight: "600",
  },
  instruction: {
    fontSize: 14,
    color: "#666",
    marginBottom: 12,
  },
  signatureContainer: {
    borderWidth: 2,
    borderColor: "black",
    borderRadius: 8,
    marginBottom: 16,
    alignSelf: "center",
  },
  signatureImage: {
    width: "100%",
    height: 250,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
  },
  placeholderText: {
    textAlign: "center",
    padding: 16,
    color: "#666",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 12,
    margin: 20,
    overflow: "hidden",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  modalBody: {
    padding: 20,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
  },
  saveButton: {
    backgroundColor: "green",
  },
  clearButton: {
    backgroundColor: "red",
  },
  cancelButton: {
    backgroundColor: "#718096",
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
  },
});
