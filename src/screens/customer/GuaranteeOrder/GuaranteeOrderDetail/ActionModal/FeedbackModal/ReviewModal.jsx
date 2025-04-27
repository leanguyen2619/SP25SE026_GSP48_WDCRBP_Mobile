import { useState } from "react";
import { FiStar, FiCheck, FiXCircle } from "react-icons/fi";
import { useCreateGuaranteeOrderReviewMutation } from "../../../../../../services/reviewApi";
import { useNotify } from "../../../../../../components/Utility/Notify";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  ActivityIndicator,
  ScrollView,
} from "react-native";

export default function ReviewModal({ guaranteeOrderId, userId, refetch }) {
  const [isModalVisible, setModalVisible] = useState(false);
  const [rating, setRating] = useState(5);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");
  const [createReview, { isLoading }] = useCreateGuaranteeOrderReviewMutation();
  const notify = useNotify();

  const handleStarClick = (selectedRating) => {
    setRating(selectedRating);
  };

  const handleStarHover = (hoveredRating) => {
    setHoveredRating(hoveredRating);
  };

  const handleSubmitReview = async () => {
    if (!comment.trim()) {
      notify("Thiếu thông tin", "Vui lòng nhập nội dung đánh giá", "error");
      return;
    }

    try {
      const reviewData = {
        userId: userId,
        guaranteeOrderId: guaranteeOrderId,
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

  return (
    <>
      <TouchableOpacity
        style={styles.button}
        onPress={() => setModalVisible(true)}
      >
        <FiStar style={styles.buttonIcon} />
        <Text style={styles.buttonText}>Đánh giá</Text>
      </TouchableOpacity>

      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => !isLoading && setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Đánh giá đơn hàng</Text>
            {!isLoading && (
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <FiXCircle style={styles.closeIcon} />
              </TouchableOpacity>
            )}

            <ScrollView style={styles.modalBody}>
              <View style={styles.ratingContainer}>
                <Text style={styles.ratingLabel}>Đánh giá:</Text>
                <View style={styles.starsContainer}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <TouchableOpacity
                      key={star}
                      onPress={() => handleStarClick(star)}
                      onPressIn={() => handleStarHover(star)}
                      onPressOut={() => setHoveredRating(0)}
                    >
                      <FiStar
                        style={[
                          styles.starIcon,
                          {
                            color: star <= (hoveredRating || rating) ? "#ECC94B" : "#CBD5E0",
                          },
                        ]}
                      />
                    </TouchableOpacity>
                  ))}
                </View>
                <Text style={styles.ratingText}>
                  {rating === 1 && "Rất không hài lòng"}
                  {rating === 2 && "Không hài lòng"}
                  {rating === 3 && "Bình thường"}
                  {rating === 4 && "Hài lòng"}
                  {rating === 5 && "Rất hài lòng"}
                </Text>
              </View>

              <View style={styles.commentContainer}>
                <Text style={styles.commentLabel}>Nội dung đánh giá:</Text>
                <TextInput
                  style={styles.commentInput}
                  placeholder="Chia sẻ trải nghiệm của bạn với đơn hàng này..."
                  value={comment}
                  onChangeText={setComment}
                  multiline
                  numberOfLines={5}
                />
              </View>

              <View style={styles.infoContainer}>
                <Text style={styles.infoText}>
                  Đánh giá của bạn sẽ giúp cải thiện chất lượng dịch vụ.
                </Text>
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={[styles.footerButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
                disabled={isLoading}
              >
                <FiXCircle style={styles.buttonIcon} />
                <Text style={styles.buttonText}>Đóng</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.footerButton, styles.submitButton]}
                onPress={handleSubmitReview}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <FiCheck style={styles.buttonIcon} />
                )}
                <Text style={[styles.buttonText, styles.submitButtonText]}>
                  Gửi đánh giá
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
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#38A169',
    padding: 8,
    borderRadius: 4,
  },
  buttonIcon: {
    color: 'white',
    marginRight: 8,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    width: '90%',
    maxWidth: 500,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    padding: 16,
    textAlign: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  closeIcon: {
    fontSize: 20,
    color: '#666',
  },
  modalBody: {
    flex: 1,
    padding: 16,
  },
  ratingContainer: {
    marginBottom: 20,
  },
  ratingLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 8,
  },
  starIcon: {
    fontSize: 32,
    marginHorizontal: 4,
  },
  ratingText: {
    textAlign: 'center',
    color: '#4A5568',
    fontSize: 14,
  },
  commentContainer: {
    marginBottom: 20,
  },
  commentLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  commentInput: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 4,
    padding: 8,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  infoContainer: {
    backgroundColor: '#EBF8FF',
    padding: 12,
    borderRadius: 4,
    marginBottom: 16,
  },
  infoText: {
    color: '#2B6CB0',
    fontSize: 14,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  footerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 4,
    marginLeft: 8,
  },
  cancelButton: {
    backgroundColor: '#EDF2F7',
  },
  submitButton: {
    backgroundColor: '#3182CE',
  },
  submitButtonText: {
    color: 'white',
  },
});
