import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import StarRating from "../../../../components/Utility/StarRating.jsx";
import Pagination from "../../../../components/Utility/Pagination.jsx";
import { Ionicons } from "@expo/vector-icons";
import { useGetDesignReviewsQuery } from "../../../../services/reviewApi.js";
import { useRoute } from "@react-navigation/native";
import { appColorTheme } from "../../../../config/appconfig.js";
import { formatDateTimeString } from "../../../../utils/utils.js";

// Component to render review items (will be passed to Pagination)
const ReviewList = ({ data }) => {
  return (
    <View>
      {data.length > 0 ? (
        data.map((review) => (
          <View key={review.reviewId} style={styles.reviewItem}>
            <View style={styles.reviewHeader}>
              <Text style={styles.username}>{review.username}</Text>
              <View style={styles.timeContainer}>
                <Ionicons name="time-outline" size={12} color="#718096" />
                <Text style={styles.timeText}>
                  {formatDateTimeString(review.createdAt)}
                </Text>
              </View>
            </View>

            {/* Số sao */}
            <View style={styles.starContainer}>
              <StarRating rating={review.rating} />
            </View>

            {/* Nội dung đánh giá */}
            <Text style={styles.commentText}>{review.comment}</Text>

            {/* Phản hồi của woodworker nếu có */}
            {review.woodworkerResponseStatus && (
              <View style={styles.responseContainer}>
                <Text style={styles.responseTitle}>
                  Phản hồi của xưởng mộc:
                </Text>
                <Text style={styles.responseText}>
                  {review.woodworkerResponse}
                </Text>
                <Text style={styles.responseTime}>
                  {formatDateTimeString(review?.responseAt)}
                </Text>
              </View>
            )}
          </View>
        ))
      ) : (
        <Text style={styles.emptyText}>Không có đánh giá phù hợp</Text>
      )}
    </View>
  );
};

export default function ReviewSection() {
  const [filterStar, setFilterStar] = useState(null);
  const route = useRoute();
  const designId = route.params?.id;
  const { data, isLoading, isError } = useGetDesignReviewsQuery(designId);
  const reviews = data?.data || [];

  // Lọc review theo số sao (nếu filterStar=null => hiển thị tất cả)
  const filteredReviews = filterStar
    ? reviews.filter((r) => r.rating === filterStar)
    : reviews;

  const handleFilterAll = () => {
    setFilterStar(null);
  };

  const handleStarFilter = (star) => {
    setFilterStar(star);
  };

  if (isLoading)
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={appColorTheme.brown_2} />
        <Text>Đang tải đánh giá...</Text>
      </View>
    );

  if (isError)
    return (
      <View style={styles.errorContainer}>
        <Text>Có lỗi khi tải đánh giá</Text>
      </View>
    );

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Đánh giá thiết kế</Text>

      {/* Thanh lọc ở trên: Tất cả, rồi 5 sao -> 1 sao */}
      <View style={styles.filterContainer}>
        <Text style={styles.filterLabel}>Lọc theo</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterScrollView}
        >
          {/* Tất cả */}
          <TouchableOpacity
            style={[styles.filterPill, !filterStar && styles.activePill]}
            onPress={handleFilterAll}
          >
            <Text
              style={[styles.pillText, !filterStar && styles.activePillText]}
            >
              Tất cả
            </Text>
          </TouchableOpacity>

          {[5, 4, 3, 2, 1].map((star) => (
            <TouchableOpacity
              key={star}
              style={[
                styles.filterPill,
                filterStar === star && styles.activePill,
              ]}
              onPress={() => handleStarFilter(star)}
            >
              <Text
                style={[
                  styles.pillText,
                  filterStar === star && styles.activePillText,
                ]}
              >
                {`${star} Sao`}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Danh sách đánh giá với phân trang */}
      <Pagination
        dataList={filteredReviews}
        DisplayComponent={ReviewList}
        itemsPerPage={5}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    padding: 16,
    backgroundColor: "white",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  loadingContainer: {
    padding: 20,
    alignItems: "center",
  },
  errorContainer: {
    padding: 20,
  },
  filterContainer: {
    marginBottom: 16,
  },
  filterLabel: {
    fontWeight: "bold",
    marginBottom: 8,
  },
  filterScrollView: {
    flexDirection: "row",
    marginBottom: 8,
  },
  filterPill: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginRight: 8,
    backgroundColor: appColorTheme.grey_1,
  },
  activePill: {
    backgroundColor: appColorTheme.brown_2,
  },
  pillText: {
    fontSize: 14,
  },
  activePillText: {
    color: "white",
  },
  reviewItem: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  reviewHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  username: {
    fontWeight: "bold",
    marginRight: 8,
  },
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  timeText: {
    fontSize: 12,
    color: "#718096",
    marginLeft: 4,
  },
  starContainer: {
    marginBottom: 8,
  },
  commentText: {
    marginBottom: 8,
  },
  responseContainer: {
    marginTop: 8,
    paddingLeft: 12,
    borderLeftWidth: 2,
    borderLeftColor: "#E2E8F0",
  },
  responseTitle: {
    fontWeight: "bold",
    fontSize: 14,
  },
  responseText: {
    fontSize: 14,
  },
  responseTime: {
    fontSize: 10,
    color: "#718096",
  },
  emptyText: {
    textAlign: "center",
    padding: 16,
  },
});
