import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useCreateReviewMutation } from "../../../../../../services/reviewApi";
import { useNotify } from "../../../../../../components/Utility/Notify";

// Rating Stars Component
const RatingStars = ({ rating, setRating, size = 28 }) => {
  const [hoveredRating, setHoveredRating] = useState(0);
  
  const renderStars = () => {
    return [1, 2, 3, 4, 5].map((star) => (
      <TouchableOpacity
        key={star}
        onPress={() => setRating(star)}
        style={styles.starContainer}
      >
        <Ionicons
          name={star <= rating ? "star" : "star-outline"}
          size={size}
          color={star <= rating ? "#F6E05E" : "#CBD5E0"}
        />
      </TouchableOpacity>
    ));
  };
  
  const getRatingText = () => {
    switch(rating) {
      case 1: return "Rất không hài lòng";
      case 2: return "Không hài lòng";
      case 3: return "Bình thường";
      case 4: return "Hài lòng";
      case 5: return "Rất hài lòng";
      default: return "";
    }
  };
  
  return (
    <View style={styles.ratingContainer}>
      <View style={styles.starsContainer}>
        {renderStars()}
      </View>
      <Text style={styles.ratingText}>{getRatingText()}</Text>
    </View>
  );
};

// Info Alert Component
const InfoAlert = ({ message }) => (
  <View style={styles.infoAlert}>
    <Ionicons name="information-circle" size={24} color="#3182CE" />
    <Text style={styles.infoAlertText}>{message}</Text>
  </View>
);

export default function ReviewModal({ serviceOrderId, userId, refetch }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [createReview, { isLoading }] = useCreateReviewMutation();
  const notify = useNotify();

  const handleSubmitReview = async () => {
    if (!comment.trim()) {
      notify("Thiếu thông tin", "Vui lòng nhập nội dung đánh giá", "error");
      return;
    }

    try {
      const reviewData = {
        userId: userId,
        serviceOrderId: serviceOrderId,
        rating: rating,
        comment: comment.trim(),
      };

      await createReview(reviewData).unwrap();
      notify("Thành công", "Đánh giá của bạn đã được gửi", "success");
      setModalVisible(false);
      if (refetch) refetch();
    } catch (error) {
      notify(
        "Đánh giá thất bại",
        error.data?.message || "Không thể gửi đánh giá. Vui lòng thử lại sau.",
        "error"
      );
    }
  };

  const closeModal = () => {
    if (!isLoading) {
      setModalVisible(false);
    }
  };

  return (
    <>
      <TouchableOpacity
        style={styles.reviewButton}
        onPress={() => setModalVisible(true)}
      >
        <Ionicons name="star" size={20} color="white" />
        <Text style={styles.reviewButtonText}>Đánh giá</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalHeaderText}>Đánh giá đơn hàng</Text>
              {!isLoading && (
                <TouchableOpacity onPress={closeModal}>
                  <Ionicons name="close" size={24} color="#333" />
                </TouchableOpacity>
              )}
            </View>

            <ScrollView style={styles.modalBody}>
              <View style={styles.formGroup}>
                <Text style={styles.label}>Đánh giá:</Text>
                <RatingStars rating={rating} setRating={setRating} />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Nội dung đánh giá:</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Chia sẻ trải nghiệm của bạn với đơn hàng này..."
                  value={comment}
                  onChangeText={setComment}
                  multiline={true}
                  numberOfLines={5}
                />
              </View>

              <InfoAlert message="Đánh giá của bạn sẽ giúp cải thiện chất lượng dịch vụ." />
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={[styles.footerButton, styles.closeButton]}
                onPress={closeModal}
                disabled={isLoading}
              >
                <Ionicons name="close-circle" size={20} color="#333" />
                <Text style={styles.closeButtonText}>Đóng</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.footerButton,
                  styles.submitButton,
                  !comment.trim() && styles.disabledButton
                ]}
                onPress={handleSubmitReview}
                disabled={isLoading || !comment.trim()}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <>
                    <Ionicons name="checkmark" size={20} color="white" />
                    <Text style={styles.submitButtonText}>Gửi đánh giá</Text>
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
  reviewButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#48BB78",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    justifyContent: "center",
  },
  reviewButtonText: {
    color: "white",
    marginLeft: 8,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 10,
    width: "90%",
    maxHeight: "80%",
    overflow: "hidden",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  modalHeaderText: {
    fontSize: 18,
    fontWeight: "700",
  },
  modalBody: {
    padding: 16,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontWeight: "600",
    marginBottom: 8,
  },
  ratingContainer: {
    marginVertical: 10,
  },
  starsContainer: {
    flexDirection: "row",
    marginBottom: 4,
  },
  starContainer: {
    marginRight: 8,
  },
  ratingText: {
    fontSize: 14,
    color: "#718096",
    marginTop: 4,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#CBD5E0",
    borderRadius: 6,
    padding: 10,
    minHeight: 100,
    textAlignVertical: "top",
  },
  infoAlert: {
    flexDirection: "row",
    backgroundColor: "#EBF8FF",
    padding: 12,
    borderRadius: 6,
    alignItems: "center",
    marginVertical: 12,
  },
  infoAlertText: {
    marginLeft: 8,
    color: "#2C5282",
    flex: 1,
  },
  modalFooter: {
    flexDirection: "row",
    justifyContent: "flex-end",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
  },
  footerButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    marginLeft: 8,
  },
  closeButton: {
    backgroundColor: "#EDF2F7",
  },
  closeButtonText: {
    marginLeft: 4,
    color: "#1A202C",
  },
  submitButton: {
    backgroundColor: "#4299E1",
  },
  submitButtonText: {
    marginLeft: 4,
    color: "white",
    fontWeight: "600",
  },
  disabledButton: {
    opacity: 0.5,
  },
});
