import React, { useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ScrollView,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { appColorTheme } from "../../../../config/appconfig";
import { formatDateTimeString } from "../../../../utils/utils";
import { useUpdateReviewResponseMutation } from "../../../../services/reviewApi";
import { useNotify } from "../../../../components/Utility/Notify";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function ReviewDetailModal({ review, refetch }) {
  const [isOpen, setIsOpen] = useState(false);
  const initialRef = useRef(null);
  const notify = useNotify();
  const [response, setResponse] = useState(review?.woodworkerResponse || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigation = useNavigation();

  const [updateReviewResponse] = useUpdateReviewResponseMutation();

  const handleSubmit = async () => {
    if (!response.trim()) {
      notify("Nội dung phản hồi không được để trống", "", "error", 3000);
      return;
    }

    if (response.length > 500) {
      notify(
        "Nội dung phản hồi không được vượt quá 500 ký tự",
        "",
        "error",
        3000
      );
      return;
    }

    try {
      setIsSubmitting(true);
      await updateReviewResponse({
        reviewId: review.reviewId,
        woodworkerResponse: response.trim(),
      }).unwrap();

      notify(
        "Phản hồi thành công",
        "Đã gửi phản hồi đánh giá",
        "success",
        3000
      );

      refetch();
      setIsOpen(false);
    } catch (error) {
      notify(
        "Lỗi khi gửi phản hồi",
        error.data?.message || "Đã có lỗi xảy ra",
        "error",
        5000
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleViewOrderDetail = () => {
    if (review?.serviceOrderId) {
      navigation.navigate("WWServiceOrderDetail", {
        orderId: review.serviceOrderId,
      });
    } else if (review?.guaranteeOrderId) {
      navigation.navigate("WWGuaranteeOrderDetail", {
        id: review.guaranteeOrderId,
      });
    }
  };

  const renderStars = (rating) => {
    return (
      <View style={styles.starsContainer}>
        {[...Array(5)].map((_, index) => (
          <AntDesign
            key={index}
            name="star"
            size={20}
            color={index < rating ? appColorTheme.brown_2 : "#CBD5E0"}
          />
        ))}
        <Text style={styles.ratingText}>{rating}/5</Text>
      </View>
    );
  };

  return (
    <>
      <TouchableOpacity
        style={styles.viewButton}
        onPress={() => setIsOpen(true)}
      >
        <Text style={styles.viewButtonText}>Chi tiết</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isOpen}
        onRequestClose={() => !isSubmitting && setIsOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Chi tiết đánh giá</Text>
              {!isSubmitting && (
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setIsOpen(false)}
                >
                  <Text style={styles.closeButtonText}>×</Text>
                </TouchableOpacity>
              )}
            </View>

            <ScrollView style={styles.modalBody}>
              {/* Thông tin cơ bản */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Thông tin đánh giá</Text>
                <View style={styles.card}>
                  <View style={styles.infoRow}>
                    <View style={styles.infoItem}>
                      <Text style={styles.infoLabel}>Mã đánh giá:</Text>
                      <Text style={styles.infoValue}>{review?.reviewId}</Text>
                    </View>
                    <View style={styles.infoItem}>
                      <Text style={styles.infoLabel}>Loại đơn:</Text>
                      <Text style={styles.infoValue}>
                        {review?.serviceOrderId
                          ? "Đơn dịch vụ"
                          : review?.guaranteeOrderId
                          ? "Đơn BH / sửa"
                          : "Không xác định"}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.infoRow}>
                    <View style={styles.infoItem}>
                      <Text style={styles.infoLabel}>Ngày tạo:</Text>
                      <Text style={styles.infoValue}>
                        {formatDateTimeString(review?.createdAt)}
                      </Text>
                    </View>
                    <View style={styles.infoItem}>
                      <Text style={styles.infoLabel}>Khách hàng:</Text>
                      <Text style={styles.infoValue}>
                        {review?.username || "Không có thông tin"}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.infoRow}>
                    <View style={styles.infoItem}>
                      <Text style={styles.infoLabel}>Mã đơn hàng:</Text>
                      <View style={styles.orderIdContainer}>
                        <Text style={styles.infoValue}>
                          {review?.serviceOrderId ||
                            review?.guaranteeOrderId ||
                            "N/A"}
                        </Text>
                        {(review?.serviceOrderId ||
                          review?.guaranteeOrderId) && (
                          <TouchableOpacity
                            style={styles.viewDetailButton}
                            onPress={handleViewOrderDetail}
                          >
                            <Text style={styles.viewDetailText}>
                              Xem chi tiết
                            </Text>
                          </TouchableOpacity>
                        )}
                      </View>
                    </View>
                  </View>
                </View>
              </View>

              {/* Đánh giá và nội dung */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Đánh giá và nội dung</Text>
                <View style={styles.card}>
                  {renderStars(review?.rating)}
                  <Text style={styles.commentText}>{review?.comment}</Text>
                </View>
              </View>

              {/* Phản hồi */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Phản hồi</Text>
                <View style={styles.card}>
                  <TextInput
                    ref={initialRef}
                    value={response}
                    onChangeText={setResponse}
                    placeholder="Nhập nội dung phản hồi..."
                    multiline
                    numberOfLines={4}
                    style={styles.textarea}
                    editable={
                      !review?.woodworkerResponseStatus && !isSubmitting
                    }
                  />
                </View>
              </View>

              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.closeModalButton}
                  onPress={() => setIsOpen(false)}
                  disabled={isSubmitting}
                >
                  <Text style={styles.closeModalButtonText}>Đóng</Text>
                </TouchableOpacity>

                {!review?.woodworkerResponseStatus && (
                  <TouchableOpacity
                    style={[
                      styles.submitButton,
                      (!response.trim() || response.length > 500) &&
                        styles.disabledButton,
                    ]}
                    onPress={handleSubmit}
                    disabled={
                      !response.trim() || response.length > 500 || isSubmitting
                    }
                  >
                    {isSubmitting ? (
                      <ActivityIndicator color="white" size="small" />
                    ) : (
                      <Text style={styles.submitButtonText}>Gửi phản hồi</Text>
                    )}
                  </TouchableOpacity>
                )}
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  viewButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: appColorTheme.brown_2,
  },
  viewButtonText: {
    color: appColorTheme.brown_2,
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    maxHeight: "90%",
    backgroundColor: "white",
    borderRadius: 8,
    overflow: "hidden",
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
  closeButtonText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#666",
  },
  modalBody: {
    backgroundColor: "#f5f5f5",
    padding: 15,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  card: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  infoRow: {
    flexDirection: "row",
    marginBottom: 10,
  },
  infoItem: {
    flex: 1,
  },
  infoLabel: {
    fontWeight: "bold",
    fontSize: 14,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
  },
  starsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  ratingText: {
    fontWeight: "bold",
    marginLeft: 5,
  },
  commentText: {
    fontSize: 14,
    lineHeight: 20,
  },
  textarea: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
    padding: 10,
    fontSize: 14,
    minHeight: 100,
    textAlignVertical: "top",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 20,
    marginBottom: 10,
  },
  closeModalButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 4,
    backgroundColor: "#eee",
    marginRight: 10,
  },
  closeModalButtonText: {
    color: "#333",
    fontSize: 14,
  },
  submitButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 4,
    backgroundColor: "#3182ce",
    flexDirection: "row",
    alignItems: "center",
  },
  submitButtonText: {
    color: "white",
    fontSize: 14,
  },
  disabledButton: {
    opacity: 0.5,
  },
  orderIdContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  viewDetailButton: {
    marginLeft: 10,
    padding: 4,
    backgroundColor: appColorTheme.brown_2,
    borderRadius: 4,
  },
  viewDetailText: {
    color: "white",
    fontSize: 12,
  },
});
